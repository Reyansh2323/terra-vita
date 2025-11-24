import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Recycle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
// LiquidEther is rendered globally via the app layout

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-login', {
        body: { username, password }
      });

      if (error) throw error;

      if (data?.success && data?.isAdmin) {
        localStorage.setItem('ecomart_admin_session', 'true');
        toast.success("Admin login successful!");
        navigate("/admin");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error("Failed to login as admin");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome to Ecomart! Check your email to verify.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        navigate("/");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
      {/* Background is provided globally */}
      {/* Theme Toggle and AI Chat Button */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex h-12 w-12 rounded-lg bg-primary items-center justify-center">
            <img src="https://storage.googleapis.com/gpt-engineer-file-uploads/XkL04eRZzUTW6aT2tLMIZD0HlTS2/uploads/1762161615259-d8a4d64a-a82e-41f6-8fec-9a16fe9fe5c1-1_all_2645.jpg" alt="Terra Vitta icon" className="h-6 w-6 rounded-md object-cover" />
          </div>
          <h1 className="text-4xl font-bold font-playfair">EcoMart</h1>
          <p className="text-foreground/60">Building a sustainable future</p>
        </div>

        {/* Auth Card */}
        <div className="border border-primary/10 rounded-lg p-8 bg-background/40 backdrop-blur-sm space-y-6">
          {/* Title */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold font-playfair">
              {isAdminLogin ? "Admin Access" : isSignUp ? "Create Account" : "Sign In"}
            </h2>
            <p className="text-sm text-foreground/60">
              {isAdminLogin 
                ? "Secure dashboard access" 
                : isSignUp 
                  ? "Join the eco-movement" 
                  : "Welcome back"}
            </p>
          </div>

          {isAdminLogin ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-primary/10 bg-background/40 h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPassword" className="text-sm font-medium">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-primary/10 bg-background/40 h-10"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary text-background hover:bg-primary/90 font-semibold h-10">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <>
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border border-primary/10 bg-background/40 h-10"
                      required={isSignUp}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-primary/10 bg-background/40 h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-primary/10 bg-background/40 h-10"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary text-background hover:bg-primary/90 font-semibold h-10">
                  {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>
            </>
          )}

          {/* Footer Links */}
          <div className="pt-4 text-center text-sm text-foreground/60 space-y-2">
            {isAdminLogin ? (
              <button
                onClick={() => setIsAdminLogin(false)}
                className="block w-full text-primary font-medium hover:underline"
                type="button"
              >
                Back to user login
              </button>
            ) : (
              <>
                <p>
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary font-medium hover:underline"
                    type="button"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </p>
                <p>
                  <button
                    onClick={() => setIsAdminLogin(true)}
                    className="text-primary font-medium hover:underline"
                    type="button"
                  >
                    Admin login
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
