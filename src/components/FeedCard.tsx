import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Trash2, Pencil, Check, X } from "lucide-react";

interface FeedCardProps {
  feed: {
    id: string;
    title: string | null;
    description: string | null;
    url: string;
  };
  fetchingFeedId: string | null;
  onFetchArticles: (feedId: string) => void;
  onDeleteFeed: (feedId: string) => void;
  onEditTitle: (feedId: string, title: string) => void;
}

export default function FeedCard({ 
  feed, 
  fetchingFeedId, 
  onFetchArticles, 
  onDeleteFeed,
  onEditTitle 
}: FeedCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(feed.title || "");

  const handleSaveTitle = () => {
    onEditTitle(feed.id, editedTitle);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(feed.title || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="max-w-sm"
                  placeholder="Enter feed title"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveTitle}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CardTitle>{feed.title || "Untitled Feed"}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
            <CardDescription>{feed.url}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onFetchArticles(feed.id)}
              disabled={fetchingFeedId === feed.id}
            >
              <RefreshCw className={`h-4 w-4 ${fetchingFeedId === feed.id ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDeleteFeed(feed.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {feed.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{feed.description}</p>
        </CardContent>
      )}
    </Card>
  );
} 