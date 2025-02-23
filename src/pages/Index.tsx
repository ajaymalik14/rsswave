
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Rss, Headphones, Bot, Radio } from "lucide-react";

const Index = () => {
  const { session } = useAuth();

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header/Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Radio className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold text-gray-900">Rsswave</span>
          </div>
          <div className="space-x-4">
            <Button asChild variant="ghost">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Transform Text to Speech with
            <span className="text-primary"> AI Power</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Listen to your favorite RSS feeds and articles with natural-sounding AI voices. 
            Stay informed while multitasking.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth">
                Start for Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <Rss className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">RSS Integration</h3>
            <p className="text-gray-600">
              Import and manage your favorite RSS feeds in one place. Stay updated with the latest content.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">AI-Powered</h3>
            <p className="text-gray-600">
              Convert articles to natural-sounding speech using advanced AI technology for a better listening experience.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <Headphones className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Listen Anywhere</h3>
            <p className="text-gray-600">
              Access your audio library on any device. Perfect for commuting, working out, or multitasking.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-primary/5 rounded-3xl my-20">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to Transform Your Reading Experience?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying their content in audio format.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Get Started Now</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center border-t pt-8">
          <div className="flex items-center">
            <Radio className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold text-gray-900">Hearrss</span>
          </div>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RssWave. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
