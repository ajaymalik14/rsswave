import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card"

interface Feed {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    created_at: string;
    user_id?: string;
}

interface FeedCardProps {
    feed: Feed;
    fetchingFeedId: string | null;
    onFetchArticles: (feedId: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ feed, fetchingFeedId, onFetchArticles }) => {
    return (
        <Card className="p-4">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="font-semibold text-lg mb-2">
                        {feed.title || feed.url}
                    </h3>
                    {feed.description && (
                        <p className="text-gray-600 text-sm mb-2">{feed.description}</p>
                    )}
                    <p className="text-gray-500 text-xs">
                        Added on {new Date(feed.created_at).toLocaleDateString()}
                    </p>
                </div>
                <Button
                    onClick={() => onFetchArticles(feed.id)}
                    disabled={fetchingFeedId === feed.id}
                    variant="secondary"
                    size="sm"
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${fetchingFeedId === feed.id ? "animate-spin" : ""
                            }`}
                    />
                    Fetch Articles
                </Button>
            </div>
        </Card>
    );
};

export default FeedCard; 