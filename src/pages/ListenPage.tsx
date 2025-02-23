import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { RefreshCw, Volume2, Play, Pause } from "lucide-react";

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

export default function ListenPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("21m00Tcm4TlvDq8ikWAM");
  const [selectedModel, setSelectedModel] = useState("eleven_multilingual_v2");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [currentConversionIndex, setCurrentConversionIndex] = useState(0);
  const audioRefs = new Map<string, HTMLAudioElement>();

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
      if (profile.elevenlabs_api_key) {
        setElevenLabsApiKey(profile.elevenlabs_api_key);
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

  const updateElevenLabsKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ elevenlabs_api_key: key })
        .eq("id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "API Key Updated",
        description: "Your ElevenLabs API key has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

    const generateAudioMutation = useMutation({
    mutationFn: async ({ articleId }: { articleId: string }) => {
      setIsGeneratingAudio(true);
      const { data, error } = await supabase.functions.invoke("generate-audio", {
        body: {
          voice_id: selectedVoice,
          model_id: selectedModel,
          articleId: articleId
        }
      });

      if (error) throw error;

      if (!data.audio_url) {
        throw new Error("No audio URL received");
      }

      return data.audio_url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Audio Generated",
        description: "The transcript has been converted to audio successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error generating audio",
        description: error.message,
      });
    },
    onSettled: () => {
      setIsGeneratingAudio(false);
    },
  });

  const handleUpdateElevenLabsKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateElevenLabsKeyMutation.mutate(elevenLabsApiKey);
  };

    const handleGenerateAudio = (articleId: string) => {
    generateAudioMutation.mutate({ articleId });
  };

  const handlePlayAudio = async (articleId: string) => {
    if (playingAudioId === articleId) {
      const audio = audioRefs.get(articleId);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlayingAudioId(null);
    } else {
      if (playingAudioId) {
        const currentAudio = audioRefs.get(playingAudioId);
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      const audio = audioRefs.get(articleId);
      if (audio) {
        try {
          await audio.play();
          setPlayingAudioId(articleId);

          audio.onended = () => {
            setPlayingAudioId(null)
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not play audio",
          });
        }
      }
    }
  };

    const handleGenerateAllAudio = async () => {
    const articlesWithTranscript = articles?.filter(article =>
      article.transcript && !article.audio_url
    ) || [];

    if (articlesWithTranscript.length === 0) {
      toast({
        title: "No transcripts to convert",
        description: "All transcripts already have audio or no transcripts found.",
      });
      return;
    }

    setIsConvertingAll(true);
    setCurrentConversionIndex(0);

    for (let i = 0; i < articlesWithTranscript.length; i++) {
      const article = articlesWithTranscript[i];
      setCurrentConversionIndex(i);

      try {
        await generateAudioMutation.mutateAsync({
          articleId: article.id
        });

        toast({
          title: "Progress",
          description: `Converted ${i + 1} of ${articlesWithTranscript.length} articles`,
        });
      } catch (error) {
        console.error('Error generating audio:', error);
      }
    }

    setIsConvertingAll(false);
    setCurrentConversionIndex(0);

    toast({
      title: "Conversion Complete",
      description: "All transcripts have been converted to audio.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>ElevenLabs Configuration</CardTitle>
            <Button
              variant="secondary"
              onClick={handleGenerateAllAudio}
              disabled={isConvertingAll || !elevenLabsApiKey}
              className="flex items-center gap-2"
            >
              {isConvertingAll ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Converting {currentConversionIndex + 1}...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Convert All to Audio
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateElevenLabsKey} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice</label>
                <Select
                  value={selectedVoice}
                  onValueChange={setSelectedVoice}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21m00Tcm4TlvDq8ikWAM">
                      Rachel
                    </SelectItem>
                    <SelectItem value="AZnzlk1XvdvUeBnXmlld">Domi</SelectItem>
                    <SelectItem value="EXAVITQu4vr4xnSDxMaL">
                      Bella
                    </SelectItem>
                    <SelectItem value="ErXwobaYiN019PkySvjV">
                      Antoni
                    </SelectItem>
                    <SelectItem value="MF3mGyEYCl7XYWbV9V6O">Elli</SelectItem>
                    <SelectItem value="TxGEqnHWrfWFTfGW9XjX">Josh</SelectItem>
                    <SelectItem value="VR6AewLTigWG4xSOukaG">
                      Arnold
                    </SelectItem>
                    <SelectItem value="pNInz6obpgDQGcFmaJgB">Adam</SelectItem>
                    <SelectItem value="yoZ06aMxZJJ28mfd3POQ">Sam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eleven_multilingual_v2">
                      Multilingual v2
                    </SelectItem>
                    <SelectItem value="eleven_turbo_v2">Turbo v2</SelectItem>
                    <SelectItem value="eleven_english_v2">
                      English v2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              disabled={updateElevenLabsKeyMutation.isPending}
            >
              Save API Key
            </Button>
          </form>
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
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className="font-medium">Radio-Ready Transcript:</h4>
                    <div className="flex gap-2">
                      {article.audio_url && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePlayAudio(article.id)}
                        >
                          {playingAudioId === article.id ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Play
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerateAudio(article.id)}
                        disabled={isGeneratingAudio || !elevenLabsApiKey}
                      >
                        {isGeneratingAudio ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Converting...
                          </>
                        ) : (
                          <>
                            <Volume2 className="mr-2 h-4 w-4" />
                            Generate Audio
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {article.transcript}
                  </p>
                  {article.audio_url && (
                    <div className="mt-4 relative">
                      <audio
                        ref={(el) => {
                          if (el) {
                            audioRefs.set(article.id, el);
                          }
                        }}
                        src={article.audio_url}
                        onEnded={() => {
                            setPlayingAudioId(null)
                        }}
                        controls
                        className="w-full"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
      </div>
    </>
  );
} 