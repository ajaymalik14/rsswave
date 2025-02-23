import { Radio, Github } from "lucide-react";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Radio className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">rsswave</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to RssWave</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your Personal AI Radio Station
          </p>
          <a 
            href="https://github.com/ajaymalik14/rsswave"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mt-4"
          >
            <Github className="h-5 w-5" />
            <span className="text-sm">View on GitHub</span>
          </a>
        </div>
        {/* Rest of your auth content */}
      </div>
    </div>
  );
};

export default AuthPage; 