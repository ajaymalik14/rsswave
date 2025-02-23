import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import FeedCard from "@/components/FeedCard";

interface Feed {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  created_at: string;
  user_id?: string;
}

export default function FeedsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const queryClient = useQueryClient();
  const [fetchingFeedId, setFetchingFeedId] = useState<string | null>(null);

    const { data: feeds, isLoading: feedsLoading } = useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feeds")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Feed[];
    }
  });

  const addFeedMutation = useMutation({
    mutationFn: async (url: string) => {
      const { data, error } = await supabase
        .from("feeds")
        .insert([{ url, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      toast({
        title: "Feed added successfully",
        description: "Your new RSS feed has been added.",
      });
      setNewFeedUrl("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error adding feed",
        description: error.message,
      });
    },
  });

    const fetchArticlesMutation = useMutation({
    mutationFn: async (feedId: string) => {
      const { data, error } = await supabase.functions.invoke('fetch-articles', {
        body: { feedId }
      });

      if (error) throw error;
      return data;
    },
    onMutate: (feedId) => {
      setFetchingFeedId(feedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Articles fetched",
        description: "Latest articles have been fetched successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error fetching articles",
        description: error.message,
      });
    },
    onSettled: () => {
      setFetchingFeedId(null);
    },
  });

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a feed URL",
      });
      return;
    }
    addFeedMutation.mutate(newFeedUrl);
  };

  const handleFetchArticles = (feedId: string) => {
    fetchArticlesMutation.mutate(feedId);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add New Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddFeed} className="flex gap-4">
            <Input
              type="url"
              placeholder="Enter RSS feed URL"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={addFeedMutation.isPending}>
              Add Feed
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {feedsLoading ? (
          <Card className="p-4">Loading feeds...</Card>
        ) : feeds?.length === 0 ? (
          <Card className="p-4">No feeds added yet.</Card>
        ) : (
          feeds?.map((feed) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              fetchingFeedId={fetchingFeedId}
              onFetchArticles={handleFetchArticles}
            />
          ))
        )}
      </div>
    </>
  );
} 