
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Radio, Square, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface RadioStation {
  id: string;
  name: string;
  image_url: string | null;
  category: string | null;
  tags: string[];
}

export default function RadioPage() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stations } = useQuery({
    queryKey: ['radio-stations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radio_stations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as RadioStation[];
    }
  });

  const { data: feeds } = useQuery({
    queryKey: ['radio-feeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radio_feeds')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const startStation = async (stationId: string) => {
    if (isProcessing) {
      setIsProcessing(null);
      setCurrentProgress(0);
      return;
    }

    const stationFeeds = feeds?.filter(f => f.radio_station_id === stationId);
    if (!stationFeeds?.length) {
      toast({
        variant: "destructive",
        title: "No feeds found",
        description: "Please add some feeds to this station first.",
      });
      return;
    }

    setIsProcessing("Starting radio station...");
    setCurrentProgress(0);

    try {
      // Fetch articles for each feed
      let totalProgress = 0;
      for (const feed of stationFeeds) {
        setIsProcessing(`Fetching articles from: ${feed.title}`);
        
        await supabase.functions.invoke('fetch-articles', {
          body: { feedId: feed.id }
        });

        totalProgress += (100 / stationFeeds.length);
        setCurrentProgress(totalProgress);
      }

      // Get all articles for processing
      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .in('feed_id', stationFeeds.map(f => f.id))
        .order('published_at', { ascending: false });

      if (!articles?.length) {
        throw new Error('No articles found');
      }

      // Process each article
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const progress = ((i + 1) / articles.length) * 100;

        // Generate transcript if needed
        if (!article.transcript) {
          setIsProcessing(`Generating transcript for: ${article.title}`);
          await supabase.functions.invoke('generate-transcript', {
            body: { articleId: article.id }
          });
        }

        // Generate audio if needed
        if (!article.audio_url) {
          setIsProcessing(`Converting to audio: ${article.title}`);
          await supabase.functions.invoke('generate-audio', {
            body: {
              voice_id: "21m00Tcm4TlvDq8ikWAM",
              model_id: "eleven_multilingual_v2",
              articleId: article.id
            }
          });
        }

        setCurrentProgress(progress);
      }

      setIsProcessing(null);
      setCurrentProgress(0);
      queryClient.invalidateQueries({ queryKey: ['radio-articles'] });
      
      toast({
        title: "Processing Complete",
        description: "All articles have been processed and are ready for playback.",
      });
    } catch (error: any) {
      console.error('Error processing station:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process radio station",
      });
      setIsProcessing(null);
      setCurrentProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stations?.map(station => (
          <Card key={station.id} className="p-6">
            <div className="space-y-4">
              <div 
                className="cursor-pointer" 
                onClick={() => navigate(`/dashboard/radio/${station.id}`)}
              >
                {station.image_url && (
                  <img
                    src={station.image_url}
                    alt={station.name}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <h3 className="text-lg font-semibold mt-2">{station.name}</h3>
                {station.category && (
                  <p className="text-sm text-muted-foreground">{station.category}</p>
                )}
                {station.tags && station.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {station.tags.map(tag => (
                      <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/radio/${station.id}`);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4">
                <Button
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    startStation(station.id);
                  }}
                  disabled={!feeds?.some(f => f.radio_station_id === station.id)}
                >
                  {isProcessing ? (
                    <>
                      <Square className="h-4 w-4" />
                      Stop Processing
                    </>
                  ) : (
                    <>
                      <Radio className="h-4 w-4" />
                      Start Station
                    </>
                  )}
                </Button>
                {isProcessing && (
                  <div className="mt-2 space-y-2">
                    <Progress value={currentProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">{isProcessing}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
