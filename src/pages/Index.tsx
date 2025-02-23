import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Rss, Headphones, Bot, Radio, Settings, Clock, Volume2, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const Index = () => {
  const { session } = useAuth();

  if (session) {
    return (
      <>
        <Helmet>
          <title>RssWave - Your Personal AI Radio Station</title>
          <meta name="description" content="Turn any RSS feed into your personal radio station with RssWave. AI-powered audio transformation for ad-free, noise-free listening experience." />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>RssWave - Turn Any RSS Feed Into Your Personal Radio Station</title>
        <meta name="description" content="Transform your favorite RSS feeds into high-quality audio with RssWave. Enjoy ad-free, customizable listening powered by AI technology." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header/Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Radio className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-gray-900">rsswave</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Button asChild variant="ghost" size="icon">
                <a 
                  href="https://github.com/ajaymalik14/rsswave" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Turn Any RSS Feed into Your
              <span className="text-primary block mt-2">Personal Radio Station</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ad-Free, Noise-Free, and Tailored to You. Create your perfect listening experience with AI-powered audio transformation.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex justify-center gap-4"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-xl text-gray-600">Three simple steps to your personal radio station</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Rss className="h-8 w-8 text-primary" />,
                  title: "Add Your Feed",
                  description: "Paste any RSS feed URL—it's that simple. News, blogs, podcasts—anything you want to hear."
                },
                {
                  icon: <Settings className="h-8 w-8 text-primary" />,
                  title: "Customize It",
                  description: "Choose your voice, adjust the pacing, and set the tone. Make it sound exactly how you want."
                },
                {
                  icon: <Headphones className="h-8 w-8 text-primary" />,
                  title: "Listen Anywhere",
                  description: "Enjoy your personal radio station on any device, completely ad-free and tailored to you."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-primary/10 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* What is RssWave Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900">What is RssWave?</h2>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                RssWave converts your favorite RSS feeds into high-quality, natural-sounding audio. 
                Enjoy a seamless, customizable listening experience without ads or interruptions. 
                Whether it's news, blogs, or niche content, RssWave creates a noise-free radio station 
                tailored to your interests.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Try It Now Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900">Try It Now</h2>
              <p className="mt-4 text-xl text-gray-600">Listen to a sample station</p>
            </motion.div>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8">
              <p className="text-gray-600 text-center italic mb-4">
                Sample audio from TechFeed. Content copyright original publisher.
              </p>
              <audio 
                controls
                className="w-full"
                src="https://lhcbhkqbvucufzekvgpr.supabase.co/storage/v1/object/public/audio/d9018d33-49b5-46c9-8535-16b84faa25e2.mp3"
              >
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="text-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Create Your Own Station <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900">Why Choose RssWave?</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Volume2 className="h-8 w-8" />,
                  title: "Ad-Free Listening",
                  description: "No ads, no clutter—just your content, uninterrupted."
                },
                {
                  icon: <Settings className="h-8 w-8" />,
                  title: "Fully Customizable",
                  description: "Control every aspect, from voice to speed, for a tailored experience."
                },
                {
                  icon: <Bot className="h-8 w-8" />,
                  title: "AI-Powered Audio",
                  description: "Advanced technology delivers natural-sounding audio from any feed."
                },
                {
                  icon: <Radio className="h-8 w-8" />,
                  title: "Community Features",
                  description: "Share and discover stations with others as RssWave grows. (Coming Soon)"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gray-100 rounded-lg p-4 w-14 h-14 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Features Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900">Features</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Headphones className="h-8 w-8" />,
                  title: "Voice Selection",
                  description: "Choose from a range of natural voices powered by ElevenLabs AI."
                },
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: "Speed Control",
                  description: "Adjust playback to match your pace."
                },
                {
                  icon: <Volume2 className="h-8 w-8" />,
                  title: "High-Quality Audio",
                  description: "Gemini and ElevenLabs AI ensure crisp, engaging sound."
                },
                {
                  icon: <Rss className="h-8 w-8" />,
                  title: "Any RSS Feed",
                  description: "From news to blogs, listen to what matters to you."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Start Listening Your Way Today
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Ready to revolutionize your listening experience? Try it free and turn your favorite content into your personal radio station in minutes.
            </p>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center border-t pt-8">
            <div className="flex items-center">
              <Radio className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-gray-900">rsswave</span>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} rsswave. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
