import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, RefreshCw, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

interface Article {
  id: string;
  title: string;
  content: string | null;
  url: string;
  feed_title: string | null;
  published_at: string;
  audio_url: string | null;
  transcript: string | null;
}

export function HomeTab() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    setCurrentPlayingArticle, 
    setPlayerQueue, 
    setIsPlayingAll, 
    setCurrentQueueIndex,
    currentPlayingArticle 
  } = useAudioPlayer();

  const fetchArticlesMutation = useMutation({
    mutationFn: async (feedId: string) => {
      const { data, error } = await supabase.functions.invoke('fetch-articles', {
        body: { feedId }
      });
      if (error) throw error;
      return data;
    }
  });

  const generateTranscriptMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { data, error } = await supabase.functions.invoke("generate-transcript", {
        body: { articleId }
      });
      if (error) throw error;
      return data;
    },
  });

  const generateAudioMutation = useMutation({
    mutationFn: async ({ articleId }: { articleId: string }) => {
      const { data, error } = await supabase.functions.invoke("generate-audio", {
        body: {
          voice_id: "21m00Tcm4TlvDq8ikWAM",
          model_id: "eleven_multilingual_v2",
          articleId: articleId
        }
      });
      if (error) throw error;
      if (!data.audio_url) throw new Error("No audio URL received");
      return data.audio_url;
    },
  });

  const processNextArticle = async (currentArticles: Article[], index: number) => {
    if (index >= currentArticles.length) {
      setIsProcessing(false);
      setCurrentStatus("All articles processed!");
      toast({
        title: "Processing Complete",
        description: "All articles have been processed and are ready for playback.",
      });
      return;
    }

    const article = currentArticles[index];

    try {
      // Generate transcript if needed
      if (!article.transcript) {
        setCurrentStatus(`Generating transcript for: ${article.title}`);
        await generateTranscriptMutation.mutateAsync(article.id);
        await queryClient.invalidateQueries({ queryKey: ["articles"] });
      }

      // Generate audio if needed
      if (!article.audio_url) {
        setCurrentStatus(`Converting to audio: ${article.title}`);
        await generateAudioMutation.mutateAsync({ articleId: article.id });
        await queryClient.invalidateQueries({ queryKey: ["articles"] });

        // Get the updated article data and update the queue
        const { data: updatedArticles } = await supabase
          .from("articles")
          .select("*")
          .order("published_at", { ascending: false });

        if (updatedArticles) {
          const articlesWithAudio = updatedArticles.filter(a => a.audio_url);
          setPlayerQueue(articlesWithAudio);

          // If this is the first article with audio, start playing
          if (articlesWithAudio.length === 1) {
            setCurrentPlayingArticle(articlesWithAudio[0]);
            setCurrentQueueIndex(0);
            setIsPlayingAll(true);
          }
        }
      }

      // Process next article in background
      setTimeout(() => processNextArticle(currentArticles, index + 1), 0);
    } catch (error) {
      console.error("Error processing article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to process article: ${article.title}`,
      });
      // Continue with next article despite error
      setTimeout(() => processNextArticle(currentArticles, index + 1), 0);
    }
  };

  const stopRadio = () => {
    setIsProcessing(false);
    setCurrentStatus("");
    setCurrentPlayingArticle(null);
    setPlayerQueue([]);
    setCurrentQueueIndex(0);
    setIsPlayingAll(false);
  };

  const startRadio = async () => {
    if (currentPlayingArticle) {
      stopRadio();
      return;
    }

    if (!profile?.elevenlabs_api_key) {
      toast({
        variant: "destructive",
        title: "ElevenLabs API Key Required",
        description: "Please set up your ElevenLabs API key in the Listen tab first.",
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStatus("Fetching feeds...");

    // First, get all feeds
    const { data: feeds, error: feedsError } = await supabase
      .from("feeds")
      .select("*");

    if (feedsError || !feeds || feeds.length === 0) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "No feeds found",
        description: "Please add some feeds first in the Feeds tab.",
      });
      return;
    }

    // Fetch articles for each feed
    setCurrentStatus("Fetching articles from feeds...");
    try {
      for (const feed of feeds) {
        await fetchArticlesMutation.mutateAsync(feed.id);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }

    // Get all articles after fetching
    const { data: latestArticles, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false });

    if (error || !latestArticles || latestArticles.length === 0) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "No articles found",
        description: "Could not fetch any articles from your feeds.",
      });
      return;
    }

    setCurrentStatus("Starting radio processing...");

    // Start with any articles that already have audio
    const articlesWithAudio = latestArticles.filter(article => article.audio_url);
    if (articlesWithAudio.length > 0) {
      setPlayerQueue(articlesWithAudio);
      setCurrentPlayingArticle(articlesWithAudio[0]);
      setCurrentQueueIndex(0);
      setIsPlayingAll(true);
    }

    // Start processing all articles
    processNextArticle(latestArticles, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <Button
              size="lg"
              className="gap-2"
              onClick={startRadio}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : currentPlayingArticle ? (
                <>
                  <Square className="h-5 w-5" />
                  Stop Radio
                </>
              ) : (
                <>
                  <Radio className="h-5 w-5" />
                  Start Radio
                </>
              )}
            </Button>
            {isProcessing && currentStatus && (
              <p className="text-sm text-muted-foreground animate-fade-in">
                {currentStatus}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
