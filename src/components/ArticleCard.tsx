
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileAudio, FileText, Trash2, Radio } from "lucide-react";
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

interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onToggleSelection: (articleId: string) => void;
  onDelete: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isSelected,
  onToggleSelection,
  onDelete,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(article.id)}
        />
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {article.listened && (
              <Radio className="h-4 w-4 text-green-500" />
            )}
            <h3 className="font-semibold">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {article.title}
              </a>
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {article.transcript && (
              <span
                className="flex items-center text-sm text-gray-500"
                title="Has transcript"
              >
                <FileText className="h-4 w-4" />
              </span>
            )}
            {article.audio_url && (
              <span
                className="flex items-center text-sm text-gray-500"
                title="Has audio"
              >
                <FileAudio className="h-4 w-4" />
              </span>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this article and its
                    associated audio file. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
