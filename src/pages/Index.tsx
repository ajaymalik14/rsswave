import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Rss, Headphones, Bot, Radio, Settings, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Index = () => {
  const { session } = useAuth();

  useEffect(() => {
    document.title = "RssWave - Your Personal Radio Experience";
  }, []);

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <Button asChild className="bg-white text-primary hover:bg-white/90">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-fuchsia-50">
      {/* Header/Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Radio className="h-8 w-8 text-violet-600 mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-transparent bg-clip-text">
              RssWave
            </span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-x-4"
          >
            <Button asChild variant="ghost" className="text-violet-600 hover:text-violet-700">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
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
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-transparent bg-clip-text">
              Your Personalized,
            </span>
            <br />
            <span className="text-gray-900">Noise-Free Radio Experience</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience radio on your own terms. RssWave transforms any RSS feed into a clean, 
            ad-free audio stream that lets you enjoy your favorite content without the usual noise.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex justify-center gap-4"
          >
            <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
              <Link to="/auth">
                Try RssWave Now <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-transparent bg-clip-text">
              What It Does
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              RssWave converts written content from your chosen RSS feeds into engaging, natural-sounding audio.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Headphones className="h-8 w-8 text-violet-600" />,
                title: "Noise-Free Listening",
                description: "No ads, no clutter—just pure, uninterrupted audio."
              },
              {
                icon: <Wand2 className="h-8 w-8 text-fuchsia-600" />,
                title: "Total Customization",
                description: "Choose your voice, pace, and tone to suit your mood."
              },
              {
                icon: <Rss className="h-8 w-8 text-violet-600" />,
                title: "Any Content, Anywhere",
                description: "Whether it's news, blogs, or podcasts, your content is delivered exactly how you want it."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-b from-white to-violet-50/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="bg-white rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center mb-6 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-b from-violet-50 to-fuchsia-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-transparent bg-clip-text">
              How It Works
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Add Your Feed",
                description: "Simply paste the RSS feed URL of your choice."
              },
              {
                number: "2",
                title: "Customize Your Station",
                description: "Select your preferred audio settings, including voice and playback speed."
              },
              {
                number: "3",
                title: "Start Listening",
                description: "Your personalized, noise-free radio station is ready to play."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose RssWave Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-transparent bg-clip-text">
              Why Choose RssWave?
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-8 rounded-2xl shadow-lg max-w-3xl mx-auto"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              RssWave was built to cut through the chaos of traditional radio. It's designed for listeners 
              who value clarity and control. With advanced AI and seamless technology, every listening 
              experience is tailored just for you—free of distractions and full of the content you love.
            </p>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Get Started Today
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Ready to enjoy a radio experience that's entirely yours? Try RssWave now and discover 
            the freedom of a noise-free, customizable radio station.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button asChild size="lg" className="gap-2 bg-white text-violet-600 hover:bg-white/90">
              <Link to="/auth">
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center border-t border-gray-200 pt-8">
          <div className="flex items-center">
            <Radio className="h-6 w-6 text-violet-600 mr-2" />
            <span className="font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-transparent bg-clip-text">
              RssWave
            </span>
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
