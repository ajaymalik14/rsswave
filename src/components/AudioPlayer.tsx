import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface AudioPlayerProps {
    currentPlayingArticle: Article;
    playerAudioRef: React.RefObject<HTMLAudioElement>;
    onPlayNext: () => void;
    onPlayPrevious: () => void;
    currentQueueIndex: number;
    playerQueue: Article[];
    isPlayingAll: boolean;
    setIsPlayingAll: (playing: boolean) => void;
    setCurrentPlayingArticle: (article: Article | null) => void;
    setPlayerQueue: (queue: Article[]) => void;
    setCurrentQueueIndex: (index: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
    currentPlayingArticle,
    playerAudioRef,
    onPlayNext,
    onPlayPrevious,
    currentQueueIndex,
    playerQueue,
    isPlayingAll,
    setIsPlayingAll,
    setCurrentPlayingArticle,
    setPlayerQueue,
    setCurrentQueueIndex
}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!playerAudioRef.current) return;

        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;
        const newTime = percentage * duration;

        playerAudioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const markArticleAsListened = async (articleId: string) => {
        await supabase
            .from('articles')
            .update({ listened: true })
            .eq('id', articleId);
    };

    useEffect(() => {
        if (playerAudioRef.current) {
            playerAudioRef.current.src = currentPlayingArticle.audio_url || "";
            if (isPlayingAll) {
                playerAudioRef.current
                    .play()
                    .catch(() => {
                        // Silently handle the error
                    });
            }
        }
    }, [currentPlayingArticle, isPlayingAll, playerAudioRef]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div
                className="h-1 bg-gray-200 w-full cursor-pointer"
                onClick={handleProgressBarClick}
                style={{
                    backgroundImage: `linear-gradient(to right, #3b82f6 ${
                        (currentTime / duration) * 100
                    }%, #e5e7eb ${(currentTime / duration) * 100}%)`,
                }}
            />

            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                            {currentPlayingArticle.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                            From: {currentPlayingArticle.feed_title}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onPlayPrevious}
                            disabled={currentQueueIndex <= 0}
                            className="hidden sm:flex"
                        >
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                if (playerAudioRef.current) {
                                    if (playerAudioRef.current.paused) {
                                        playerAudioRef.current.play()
                                            .catch(() => {
                                                // Silently handle the error
                                            });
                                    } else {
                                        playerAudioRef.current.pause();
                                    }
                                }
                            }}
                        >
                            {!playerAudioRef.current?.paused ? (
                                <>
                                    <Pause className="h-4 w-4" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4" />
                                    Play
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onPlayNext}
                            disabled={currentQueueIndex >= playerQueue.length - 1}
                            className="hidden sm:flex"
                        >
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <audio
                        ref={playerAudioRef}
                        onTimeUpdate={(e) =>
                            setCurrentTime(e.currentTarget.currentTime)
                        }
                        onLoadedMetadata={(e) =>
                            setDuration(e.currentTarget.duration)
                        }
                        onEnded={async () => {
                            await markArticleAsListened(currentPlayingArticle.id);
                            
                            if (currentQueueIndex < playerQueue.length - 1) {
                                onPlayNext();
                            } else {
                                setIsPlayingAll(false);
                                setCurrentPlayingArticle(null);
                                setPlayerQueue([]);
                                setCurrentQueueIndex(0);
                            }
                        }}
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
