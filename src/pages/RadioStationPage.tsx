
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Radio, FileText, FileAudio } from "lucide-react";
import { format } from "date-fns";

interface RadioStation {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
  category: string | null;
  tags: string[];
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

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

export default function RadioStationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: station } = useQuery({
    queryKey: ['radio-station', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radio_stations')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as RadioStation;
    }
  });

  const { data: feeds } = useQuery({
    queryKey: ['radio-feeds', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radio_feeds')
        .select('*')
        .eq('radio_station_id', id);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: articles } = useQuery({
    queryKey: ['radio-articles', id],
    queryFn: async () => {
      const feedIds = feeds?.map(feed => feed.id) || [];
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .in('feed_id', feedIds)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
    enabled: !!feeds?.length
  });

  if (!station) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard/radio')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stations
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{station.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <p>Created by {station.profiles?.full_name}</p>
                {station.category && <p>• {station.category}</p>}
              </div>
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
            {station.image_url && (
              <img 
                src={station.image_url} 
                alt={station.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4">Feeds</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {feeds?.map(feed => (
                  <Card key={feed.id} className="p-4">
                    <h3 className="font-medium">{feed.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feed.url}</p>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Articles</h2>
              <div className="space-y-4">
                {articles?.map(article => (
                  <Card key={article.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium">
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {article.title}
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Published {format(new Date(article.published_at), 'PPP')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {article.transcript && (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        )}
                        {article.audio_url && (
                          <FileAudio className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    {article.audio_url && (
                      <audio 
                        src={article.audio_url} 
                        controls 
                        className="w-full mt-4"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
