
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      throw new Error('No authorization token found');
    }

    const { voice_id, model_id, articleId } = await req.json();

    if (!articleId) {
      throw new Error('Missing required parameter: articleId');
    }

    // Get the article transcript from the database
    const { data: article, error: articleError } = await supabaseClient
      .from('articles')
      .select('transcript')
      .eq('id', articleId)
      .single();

    if (articleError || !article?.transcript) {
      throw new Error('Article transcript not found');
    }

    const text = article.transcript;
    console.log(`Generating audio for text length: ${text.length} characters`);

    // Get user's ElevenLabs API key from profile
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      throw new Error('User not found');
    }

    const { data: userData, error: userDataError } = await supabaseClient
      .from('profiles')
      .select('elevenlabs_api_key')
      .eq('id', user.id)
      .single();

    if (userDataError || !userData?.elevenlabs_api_key) {
      throw new Error('ElevenLabs API key not found');
    }

    // Call ElevenLabs API to generate audio
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': userData.elevenlabs_api_key,
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.message || 'Failed to generate audio');
    }

    // Get the audio data
    const audioData = await response.arrayBuffer();

    // Generate a unique filename
    const filename = `${crypto.randomUUID()}.mp3`;

    // Create a storage bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabaseClient
      .storage
      .createBucket('audio', {
        public: true,
        allowedMimeTypes: ['audio/mpeg'],
        fileSizeLimit: 52428800, // 50MB
      });

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }

    // Upload the audio file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('audio')
      .upload(filename, audioData, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('audio')
      .getPublicUrl(filename);

    // Update the article with the audio URL
    const { error: updateError } = await supabaseClient
      .from('articles')
      .update({ audio_url: publicUrl })
      .eq('id', articleId);

    if (updateError) {
      throw updateError;
    }

    console.log('Audio generated and uploaded successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        success: true,
        audio_url: publicUrl
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
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
