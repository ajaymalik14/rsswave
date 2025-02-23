
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ArticleCard from "@/components/ArticleCard";

interface Article {
  id: string;
  title: string;
  content: string | null;
  url: string;
  feed_title: string | null;
  published_at: string;
  audio_url: string | null;
  transcript: string | null;
  listened: boolean;
}

export default function ArticlesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const { data: articles, isLoading: articlesLoading } = useQuery({
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
          transcript,
          listened
        `
        )
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleIds: string[]) => {
      const { data: articles, error: fetchError } = await supabase
        .from("articles")
        .select("id, audio_url")
        .in("id", articleIds);

      if (fetchError) throw fetchError;

      const audioFiles = articles
        ?.filter((article) => article.audio_url)
        .map((article) => article.audio_url?.split("/").pop())
        .filter(Boolean) as string[];

      if (audioFiles.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("audio")
          .remove(audioFiles);

        if (storageError) throw storageError;
      }

      const { error } = await supabase
        .from("articles")
        .delete()
        .in("id", articleIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setSelectedArticles([]);
      toast({
        title: "Articles deleted",
        description: "Selected articles have been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting articles",
        description: error.message,
      });
    },
  });

  const selectAllArticles = () => {
    if (articles) {
      const allSelected = articles.length === selectedArticles.length;
      if (allSelected) {
        setSelectedArticles([]);
      } else {
        setSelectedArticles(articles.map((article) => article.id));
      }
    }
  };

  const toggleArticleSelection = (articleId: string) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedArticles.length > 0) {
      deleteArticleMutation.mutate(selectedArticles);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Articles</h2>
          <Button variant="outline" size="sm" onClick={selectAllArticles}>
            {articles && articles.length === selectedArticles.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>
        {selectedArticles.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedArticles.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedArticles.length}{" "}
                  selected articles and their associated audio files. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {articlesLoading ? (
        <Card className="p-4">Loading articles...</Card>
      ) : !articles?.length ? (
        <Card className="p-4">No articles found.</Card>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isSelected={selectedArticles.includes(article.id)}
              onToggleSelection={toggleArticleSelection}
              onDelete={() => deleteArticleMutation.mutate([article.id])}
            />
          ))}
        </div>
      )}
    </>
  );
}
