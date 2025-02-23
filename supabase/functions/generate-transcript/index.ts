
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchArticleContent(url: string): Promise<string | null> {
  try {
    console.log(`Fetching content from URL: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    
    // Try to get content from paragraphs first as it's most reliable
    const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gs);
    if (paragraphs) {
      const combinedContent = paragraphs
        .map(p => p.replace(/<[^>]*>/g, '').trim())
        .filter(p => p.length > 20)  // Filter out very short paragraphs
        .join('\n\n');
      
      if (combinedContent.length > 100) {
        console.log('Successfully extracted content from paragraphs');
        return combinedContent;
      }
    }

    // Fallback to any text content if paragraphs not found
    const cleanContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanContent.length > 100) {
      console.log('Using cleaned HTML content');
      return cleanContent;
    }

    console.log('No content could be extracted from the article');
    return null;
  } catch (error) {
    console.error(`Error fetching article content: ${error}`);
    return null;
  }
}

async function processArticle(
  article: { id: string; title: string; content: string | null; url: string },
  geminiApiKey: string,
  supabaseClient: any
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Processing article: ${article.title}`);
    
    // Try to get content from the article's stored content first
    let content = article.content;
    
    // If no stored content, try to fetch from URL
    if (!content) {
      content = await fetchArticleContent(article.url);
    }
    
    if (!content) {
      throw new Error('No content available for article');
    }

    console.log('Sending content to Gemini API...');
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Convert this article into a radio-ready script. Make it engaging and easy to read aloud:

            Title: ${article.title}

            Content: ${content.substring(0, 30000)}`, // Limit content length to avoid token limits
          }],
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API request failed: ${errorData}`);
    }

    const data = await response.json();
    const transcript = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!transcript) {
      throw new Error('No transcript generated from Gemini API');
    }

    console.log('Updating article with transcript...');
    const { error: updateError } = await supabaseClient
      .from('articles')
      .update({ transcript })
      .eq('id', article.id);

    if (updateError) {
      throw new Error(`Failed to update article with transcript: ${updateError.message}`);
    }

    console.log(`Successfully processed article ${article.id}`);
    return { success: true };

  } catch (error) {
    console.error(`Error processing article ${article.id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      throw new Error('No authorization token found');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );

    const { data: profile, error: profileError } = await supabaseClient.auth.getUser(token);
    if (profileError || !profile.user) {
      throw new Error('User not found');
    }

    console.log('Fetching user profile...');
    const { data: userData, error: userDataError } = await supabaseClient
      .from('profiles')
      .select('gemini_api_key')
      .eq('id', profile.user.id)
      .maybeSingle();

    if (userDataError) {
      throw new Error(`Failed to fetch user profile: ${userDataError.message}`);
    }
    if (!userData?.gemini_api_key) {
      throw new Error('Gemini API key not found in user profile');
    }

    console.log('Fetching articles without transcripts...');
    const { data: articles, error: articlesError } = await supabaseClient
      .from('articles')
      .select('id, title, content, url')
      .is('transcript', null)
      .order('published_at', { ascending: false })
      .limit(1); // Process one article at a time

    if (articlesError) {
      throw new Error(`Failed to fetch articles: ${articlesError.message}`);
    }

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No articles found that need transcripts' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process single article
    const article = articles[0];
    const result = await processArticle(article, userData.gemini_api_key, supabaseClient);

    return new Response(
      JSON.stringify({
        result,
        articleId: article.id,
        title: article.title,
        success: result.success,
        error: result.error,
        remainingArticles: articles.length - 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
