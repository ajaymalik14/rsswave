
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CuratedFeed {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
}

interface UserFeed {
  id: string;
  url: string;
}

export default function ExplorePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch curated feeds
  const { data: curatedFeeds, isLoading: isLoadingCurated } = useQuery({
    queryKey: ["curated-feeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("curated_feeds")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      return data as CuratedFeed[];
    },
  });

  // Fetch user's existing feeds
  const { data: userFeeds } = useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feeds")
        .select("id, url");

      if (error) throw error;
      return data as UserFeed[];
    },
  });

  // Add feed mutation
  const addFeedMutation = useMutation({
    mutationFn: async (feed: CuratedFeed) => {
      const { error } = await supabase
        .from("feeds")
        .insert([{
          url: feed.url,
          title: feed.title,
          description: feed.description
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      toast({
        title: "Feed added",
        description: "The feed has been added to your list.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error adding feed",
        description: error.message,
      });
    },
  });

  // Remove feed mutation
  const removeFeedMutation = useMutation({
    mutationFn: async (url: string) => {
      const { error } = await supabase
        .from("feeds")
        .delete()
        .eq("url", url);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      toast({
        title: "Feed removed",
        description: "The feed has been removed from your list.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error removing feed",
        description: error.message,
      });
    },
  });

  const isSubscribed = (url: string) => {
    return userFeeds?.some(feed => feed.url === url);
  };

  const handleFeedAction = (feed: CuratedFeed) => {
    if (isSubscribed(feed.url)) {
      removeFeedMutation.mutate(feed.url);
    } else {
      addFeedMutation.mutate(feed);
    }
  };

  // Group feeds by category
  const groupedFeeds = curatedFeeds?.reduce((acc, feed) => {
    if (!acc[feed.category]) {
      acc[feed.category] = [];
    }
    acc[feed.category].push(feed);
    return acc;
  }, {} as Record<string, CuratedFeed[]>) ?? {};

  if (isLoadingCurated) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedFeeds).map(([category, feeds]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-4">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {feeds.map((feed) => (
              <Card key={feed.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{feed.title}</CardTitle>
                      {feed.description && (
                        <CardDescription>{feed.description}</CardDescription>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isSubscribed(feed.url) ? "secondary" : "default"}
                      onClick={() => handleFeedAction(feed)}
                      disabled={addFeedMutation.isPending || removeFeedMutation.isPending}
                    >
                      {isSubscribed(feed.url) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
