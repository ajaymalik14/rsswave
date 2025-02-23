import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedsPage from "./FeedsPage";
import ArticlesPage from "./ArticlesPage";
import AIFetchPage from "./AIFetchPage";
import ListenPage from "./ListenPage";
import AudioLibraryPage from "./AudioLibraryPage";
import ExplorePage from "./ExplorePage";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { HomeTab } from "@/components/dashboard/HomeTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { Radio, Github } from "lucide-react";

export default function Dashboard() {
  const { signOut } = useAuth();

  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-900">rsswave</span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/ajaymalik14/rsswave"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Github className="h-5 w-5" />
              </a>
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>

          <Tabs defaultValue="home" className="space-y-6">
            <TabsList>
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="feeds">Feeds</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="ai">AI Fetch</TabsTrigger>
              <TabsTrigger value="listen">Listen</TabsTrigger>
              <TabsTrigger value="library">Audio Library</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              <HomeTab />
            </TabsContent>

            <TabsContent value="explore" className="space-y-6">
              <ExplorePage />
            </TabsContent>

            <TabsContent value="feeds" className="space-y-6">
              <FeedsPage />
            </TabsContent>

            <TabsContent value="articles" className="space-y-4">
              <ArticlesPage />
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <AIFetchPage />
            </TabsContent>

            <TabsContent value="listen" className="space-y-6">
              <ListenPage />
            </TabsContent>

            <TabsContent value="library" className="space-y-6">
              <AudioLibraryPage />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <ProfileTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AudioPlayerProvider>
  );
}
