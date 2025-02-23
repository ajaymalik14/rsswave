
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RadioStation {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

interface RadioFeed {
  id: string;
  title: string;
  url: string;
  radio_station_id: string;
}

interface CreateStationForm {
  name: string;
  image: File | null;
  feeds: { title: string; url: string }[];
}

export default function RadioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<CreateStationForm>({
    name: '',
    image: null,
    feeds: [{ title: '', url: '' }]
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingStation, setEditingStation] = useState<RadioStation | null>(null);

  // Fetch radio stations
  const { data: stations, isLoading } = useQuery({
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

  // Fetch feeds for each station
  const { data: feeds } = useQuery({
    queryKey: ['radio-feeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radio_feeds')
        .select('*');
      
      if (error) throw error;
      return data as RadioFeed[];
    }
  });

  // Create station mutation
  const createStationMutation = useMutation({
    mutationFn: async (formData: CreateStationForm) => {
      if (!user) throw new Error('User not authenticated');

      // Upload image if exists
      let imageUrl = null;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('radio-images')
          .upload(filePath, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('radio-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      // Create radio station
      const { data: station, error: stationError } = await supabase
        .from('radio_stations')
        .insert({
          name: formData.name,
          image_url: imageUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (stationError) throw stationError;

      // Create feeds
      const feedPromises = formData.feeds.map(feed => 
        supabase
          .from('radio_feeds')
          .insert({
            radio_station_id: station.id,
            title: feed.title,
            url: feed.url
          })
      );

      await Promise.all(feedPromises);

      return station;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radio-stations'] });
      queryClient.invalidateQueries({ queryKey: ['radio-feeds'] });
      setIsCreating(false);
      resetForm();
      toast({
        title: "Success",
        description: "Radio station created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  });

  // Delete station mutation
  const deleteStationMutation = useMutation({
    mutationFn: async (stationId: string) => {
      const { error } = await supabase
        .from('radio_stations')
        .delete()
        .eq('id', stationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radio-stations'] });
      queryClient.invalidateQueries({ queryKey: ['radio-feeds'] });
      toast({
        title: "Success",
        description: "Radio station deleted successfully",
      });
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeed = () => {
    setForm(prev => ({
      ...prev,
      feeds: [...prev.feeds, { title: '', url: '' }]
    }));
  };

  const removeFeed = (index: number) => {
    setForm(prev => ({
      ...prev,
      feeds: prev.feeds.filter((_, i) => i !== index)
    }));
  };

  const updateFeed = (index: number, field: 'title' | 'url', value: string) => {
    setForm(prev => ({
      ...prev,
      feeds: prev.feeds.map((feed, i) => 
        i === index ? { ...feed, [field]: value } : feed
      )
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      image: null,
      feeds: [{ title: '', url: '' }]
    });
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStationMutation.mutate(form);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Radio Stations</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Station
        </Button>
      </div>

      {isCreating && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Station Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Station Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>RSS Feeds</Label>
                <Button type="button" variant="outline" onClick={addFeed}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feed
                </Button>
              </div>

              {form.feeds.map((feed, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Feed Title"
                      value={feed.title}
                      onChange={e => updateFeed(index, 'title', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="RSS URL"
                      value={feed.url}
                      onChange={e => updateFeed(index, 'url', e.target.value)}
                      required
                    />
                  </div>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFeed(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createStationMutation.isPending}
              >
                {createStationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Station
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stations?.map(station => (
          <Card key={station.id} className="p-6">
            <div className="space-y-4">
              {station.image_url && (
                <img
                  src={station.image_url}
                  alt={station.name}
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{station.name}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {feeds?.filter(f => f.radio_station_id === station.id).map(feed => (
                      <div key={feed.id}>
                        {feed.title}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteStationMutation.mutate(station.id)}
                    disabled={deleteStationMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
