import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

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
interface Profile {
  id: string;
  gemini_api_key: string | null;
  elevenlabs_api_key: string | null;
  avatar_url: string | null;
  full_name: string | null;
  updated_at: string | null;
  username: string | null;
}

export default function AIFetchPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [processingStatus, setProcessingStatus] = useState<{
    total: number;
    processed: number;
    current: string | null;
  }>({ total: 0, processed: 0, current: null });

    const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  useEffect(() => {
    if (profile) {
      if (profile.gemini_api_key) {
        setGeminiApiKey(profile.gemini_api_key);
      }
    }
  }, [profile]);

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

  const updateGeminiKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ gemini_api_key: key })
        .eq("id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "API Key Updated",
        description: "Your Gemini API key has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

    const generateTranscriptsMutation = useMutation({
    mutationFn: async () => {
      setIsProcessing(true);
      let keepProcessing = true;
      let processedCount = 0;
      let totalArticles = 0;

      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .is('transcript', null);

      totalArticles = count || 0;
      setProcessingStatus({ total: totalArticles, processed: 0, current: null });

      while (keepProcessing) {
        const { data, error } = await supabase.functions.invoke("generate-transcript");

        if (error) throw error;

        if (data.message === 'No articles found that need transcripts') {
          keepProcessing = false;
        } else if (data.result?.success) {
          processedCount++;
          setProcessingStatus(prev => ({
            ...prev,
            processed: processedCount,
            current: data.title
          }));
          queryClient.invalidateQueries({ queryKey: ["articles"] });
        } else {
          console.error('Error processing article:', data.error);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return { processedCount, totalArticles };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Transcripts Generated",
        description: `Processed ${data.processedCount} out of ${data.totalArticles} articles.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error generating transcripts",
        description: error.message,
      });
    },
    onSettled: () => {
      setIsProcessing(false);
      setProcessingStatus({ total: 0, processed: 0, current: null });
    },
  });

  const handleUpdateGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeminiKeyMutation.mutate(geminiApiKey);
  };

    const handleGenerateTranscripts = () => {
    generateTranscriptsMutation.mutate();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gemini AI Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateGeminiKey} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={updateGeminiKeyMutation.isPending}
            >
              Save API Key
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Transcripts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Click the button below to process articles with Gemini AI and
              generate radio-ready transcripts.
            </p>
            {processingStatus.total > 0 && (
              <div className="text-sm text-gray-600">
                Processing: {processingStatus.processed} /{" "}
                {processingStatus.total} articles
                {processingStatus.current && (
                  <p className="mt-1 italic">
                    Current: {processingStatus.current}
                  </p>
                )}
              </div>
            )}
            <Button
              onClick={handleGenerateTranscripts}
              disabled={isProcessing || !geminiApiKey}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Transcripts"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {articles
          ?.filter((article) => article.transcript)
          .map((article) => (
            <Card key={article.id} className="p-6">
              <h3 className="font-semibold text-xl mb-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  {article.title}
                </a>
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <span>From: {article.feed_title}</span>
                <span>•</span>
                <span>
                  {new Date(article.published_at).toLocaleDateString()}
                </span>
              </div>
              {article.transcript && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">
                    Radio-Ready Transcript:
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {article.transcript}
                  </p>
                </div>
              )}
            </Card>
          ))}
      </div>
    </>
  );
} 