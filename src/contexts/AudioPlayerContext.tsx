import React, { createContext, useContext, useState, useRef } from 'react';
import AudioPlayer from "@/components/AudioPlayer";

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

interface AudioPlayerContextType {
    currentPlayingArticle: Article | null;
    setCurrentPlayingArticle: (article: Article | null) => void;
    playerQueue: Article[];
    setPlayerQueue: (queue: Article[]) => void;
    currentQueueIndex: number;
    setCurrentQueueIndex: (index: number) => void;
    isPlayingAll: boolean;
    setIsPlayingAll: (playing: boolean) => void;
    playerAudioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentPlayingArticle, setCurrentPlayingArticle] = useState<Article | null>(null);
    const [playerQueue, setPlayerQueue] = useState<Article[]>([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
    const [isPlayingAll, setIsPlayingAll] = useState(false);
    const playerAudioRef = useRef<HTMLAudioElement>(null);

    return (
        <AudioPlayerContext.Provider
            value={{
                currentPlayingArticle,
                setCurrentPlayingArticle,
                playerQueue,
                setPlayerQueue,
                currentQueueIndex,
                setCurrentQueueIndex,
                isPlayingAll,
                setIsPlayingAll,
                playerAudioRef,
            }}
        >
            {children}
            {currentPlayingArticle && (
                <AudioPlayer
                    currentPlayingArticle={currentPlayingArticle}
                    playerAudioRef={playerAudioRef}
                    onPlayNext={() => {
                        if (currentQueueIndex < playerQueue.length - 1) {
                            const nextIndex = currentQueueIndex + 1;
                            setCurrentQueueIndex(nextIndex);
                            setCurrentPlayingArticle(playerQueue[nextIndex]);
                        }
                    }}
                    onPlayPrevious={() => {
                        if (currentQueueIndex > 0) {
                            const prevIndex = currentQueueIndex - 1;
                            setCurrentQueueIndex(prevIndex);
                            setCurrentPlayingArticle(playerQueue[prevIndex]);
                        }
                    }}
                    currentQueueIndex={currentQueueIndex}
                    playerQueue={playerQueue}
                    isPlayingAll={isPlayingAll}
                    setIsPlayingAll={setIsPlayingAll}
                    setCurrentPlayingArticle={setCurrentPlayingArticle}
                    setPlayerQueue={setPlayerQueue}
                    setCurrentQueueIndex={setCurrentQueueIndex}
                />
            )}
        </AudioPlayerContext.Provider>
    );
}

export function useAudioPlayer() {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
    }
    return context;
} 