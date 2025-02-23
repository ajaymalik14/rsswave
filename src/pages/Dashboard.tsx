
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
import RadioPage from "./RadioPage";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { HomeTab } from "@/components/dashboard/HomeTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";

export default function Dashboard() {
  const { signOut } = useAuth();

  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-8 pb-32">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
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
              <TabsTrigger value="radio">Radio</TabsTrigger>
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

            <TabsContent value="radio" className="space-y-6">
              <RadioPage />
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
