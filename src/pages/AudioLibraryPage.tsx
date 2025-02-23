import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Pause } from "lucide-react";
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

export default function AudioLibraryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    isPlayingAll, 
    setIsPlayingAll,
    currentPlayingArticle, 
    setCurrentPlayingArticle,
    playerQueue,
    setPlayerQueue,
    currentQueueIndex,
    setCurrentQueueIndex,
    playerAudioRef,
    handlePlayNext,
    handlePlayPrevious
  } = useAudioPlayer();

  const { data: articles } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(
          `
          id,
          title,
          content,
          url,
          feed_title,
          published_at,
          audio_url,
          transcript
        `
        )
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });

  const deleteAudioMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from("articles")
        .update({ audio_url: null })
        .eq("id", articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Audio deleted",
        description: "The audio has been removed successfully.",
      });
    },
  });

  const articlesWithAudio =
    articles?.filter((article) => article.audio_url) || [];
  const hasAudioArticles = articlesWithAudio.length > 0;

  const handlePlayAll = async () => {
    if (!articlesWithAudio.length) return;

    if (isPlayingAll) {
      setIsPlayingAll(false);
      setCurrentPlayingArticle(null);
      setPlayerQueue([]);
      setCurrentQueueIndex(0);
    } else {
      setIsPlayingAll(true);
      setPlayerQueue(articlesWithAudio);
      setCurrentQueueIndex(0);
      setCurrentPlayingArticle(articlesWithAudio[0]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Audio Library</CardTitle>
            {hasAudioArticles && (
              <Button
                variant="secondary"
                onClick={handlePlayAll}
                className="flex items-center gap-2"
              >
                {isPlayingAll ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Stop All
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play All
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articlesWithAudio.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No audio files found. Generate some audio from your
                transcripts first.
              </p>
            ) : (
              articlesWithAudio.map((article) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        From: {article.feed_title} •{" "}
                        {new Date(article.published_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAudioMutation.mutate(article.id)}
                    >
                      Delete Audio
                    </Button>
                  </div>
                  <audio
                    src={article.audio_url || undefined}
                    controls
                    className="w-full"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
} 