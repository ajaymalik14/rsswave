import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Radio, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, resetPassword } = useAuth();
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, action: "signin" | "signup" | "reset") => {
    e.preventDefault();
    switch (action) {
      case "signin":
        await signIn(email, password);
        break;
      case "signup":
        await signUp(email, password);
        break;
      case "reset":
        await resetPassword(email);
        setIsResetting(false);
        break;
    }
  };

  if (isResetting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
                <Radio className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">rsswave</span>
              </Link>
            </div>
            <a 
              href="https://github.com/ajaymalik14/rsswave"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </nav>

        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md w-full space-y-8 p-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Reset Password
              </h2>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "reset")} className="mt-8 space-y-6">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex gap-4">
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResetting(false)}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
              <Radio className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">rsswave</span>
            </Link>
          </div>
          <a 
            href="https://github.com/ajaymalik14/rsswave"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full space-y-8 p-8">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, "signin")} className="space-y-6">
                <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome Back
                  </h2>
                </div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsResetting(true)}
                  className="w-full"
                >
                  Forgot password?
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-6">
                <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create Account
                  </h2>
                </div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
