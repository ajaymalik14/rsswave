
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Hearrss</h1>
        <p className="text-xl text-gray-600 mb-8">Your RSS feed management solution</p>
        {session ? (
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <div className="space-x-4">
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">Create Account</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
