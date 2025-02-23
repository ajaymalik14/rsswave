import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Rss, Headphones, Bot, Radio, Settings, Clock, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

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
            className="space-x-4"
          >
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

      {/* Testimonial Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary/5 p-12 rounded-3xl text-center"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-2xl italic text-gray-700 mb-6">
              "I've never experienced radio like this—so personal, so clean, and exactly what I want to hear."
            </p>
            <p className="text-gray-600">— Early rsswave user</p>
          </div>
        </motion.div>
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
  );
};

export default Index;
