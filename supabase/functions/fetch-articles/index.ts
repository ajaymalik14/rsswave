
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { parseFeed } from 'https://deno.land/x/rss@1.0.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the JWT token from the Authorization header
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      throw new Error('No authorization token found');
    }

    const { feedId } = await req.json();
    console.log('Received request for feedId:', feedId);

    if (!feedId) {
      throw new Error('Feed ID is required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );

    // Get feed URL from database
    const { data: feed, error: feedError } = await supabaseClient
      .from('radio_feeds')
      .select('url, id')
      .eq('id', feedId)
      .single();

    if (feedError) {
      console.error('Feed fetch error:', feedError);
      throw new Error('Failed to fetch feed details');
    }

    if (!feed) {
      throw new Error('Feed not found');
    }

    console.log('Fetching RSS feed:', feed.url);

    // Fetch and parse RSS feed
    const response = await fetch(feed.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xml = await response.text();
    console.log('Received XML response');

    const parsedFeed = await parseFeed(xml);
    console.log('Successfully parsed feed, entries:', parsedFeed.entries.length);

    // Prepare articles for insertion
    const articles = parsedFeed.entries.slice(0, 10).map(entry => ({
      feed_id: feed.id,
      title: entry.title?.value || 'Untitled',
      content: entry.content?.value || entry.description?.value || null,
      url: entry.links[0]?.href || '',
      published_at: entry.published || new Date().toISOString(),
      feed_title: feed.title
    }));

    console.log('Prepared articles for insertion:', articles.length);

    // Insert articles into database
    const { error: insertError } = await supabaseClient
      .from('articles')
      .upsert(articles, {
        onConflict: 'feed_id,url'
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to insert articles');
    }

    // Update last_fetched timestamp for the feed
    await supabaseClient
      .from('radio_feeds')
      .update({ last_fetched: new Date().toISOString() })
      .eq('id', feedId);

    console.log('Successfully completed article fetch and insert');

    return new Response(
      JSON.stringify({
        message: 'Articles fetched successfully',
        count: articles.length
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in edge function:', error.message);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});
