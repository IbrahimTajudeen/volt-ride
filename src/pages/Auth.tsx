import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { auth } from "@/integrations/auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Auth = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(params.get("mode") === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", user.id).eq("role", "admin").maybeSingle();
      nav(data ? "/admin" : "/account", { replace: true });
    })();
  }, [user, nav]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Welcome aboard! You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    const result = { error: "Failed to sign in using OAuth" } // await auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Sign-in failed");
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message); else toast.success("Reset link sent — check your inbox.");
  };

  return (
    <Layout>
      <section className="container-px mx-auto max-w-md py-16 lg:py-24">
        <div className="card-surface rounded-2xl p-8 shadow-elevated">
          <div className="flex gap-2 p-1 bg-secondary rounded-lg mb-6">
            {(["login", "signup"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode===m ? "bg-background text-foreground shadow-card" : "text-muted-foreground"}`}>
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h1 className="font-display text-2xl font-bold mb-1">
            {mode === "login" ? "Welcome back" : "Join Voltride"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Sign in to track orders and manage your rides." : "Create an account to start riding electric."}
          </p>

          <div className="space-y-2">
            <Button type="button" variant="outline" className="w-full" onClick={() => handleOAuth("google")} disabled={loading}>
              <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h5.9c-.3 1.4-1 2.6-2.3 3.4v2.9h3.7c2.2-2 3.2-4.9 3.2-8.5z"/><path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.4 1.1-3.9 1.1-3 0-5.6-2-6.5-4.8H1.7v3c1.9 3.8 5.8 6.4 10.3 6.4z"/><path fill="#FBBC05" d="M5.5 13.6c-.2-.7-.4-1.4-.4-2.1s.1-1.5.4-2.1V6.4H1.7C.9 7.9.5 9.6.5 11.5s.5 3.6 1.2 5.1l3.8-3z"/><path fill="#EA4335" d="M12 4.6c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15 .1 12 .1 7.5.1 3.6 2.7 1.7 6.4l3.8 3c.9-2.8 3.5-4.8 6.5-4.8z"/></svg>
              Continue with Google
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => handleOAuth("apple")} disabled={loading}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M17.05 12.04c-.02-2.5 2.04-3.7 2.13-3.76-1.16-1.7-2.97-1.93-3.62-1.96-1.54-.15-3 .9-3.79.9-.78 0-1.98-.88-3.26-.86-1.68.03-3.23.98-4.1 2.48-1.74 3.03-.45 7.5 1.25 9.97.83 1.21 1.82 2.56 3.1 2.51 1.24-.05 1.71-.8 3.21-.8 1.49 0 1.92.8 3.23.77 1.33-.02 2.18-1.22 3-2.43.94-1.4 1.34-2.76 1.36-2.83-.03-.01-2.61-1-2.64-3.99zM14.61 4.4c.69-.83 1.15-1.99 1.02-3.14-.99.04-2.19.66-2.9 1.49-.64.73-1.2 1.91-1.05 3.04 1.1.09 2.23-.56 2.93-1.39z"/></svg>
              Continue with Apple
            </Button>
          </div>

          <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> or with email <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"
                  className="w-full h-11 pl-10 pr-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
                className="w-full h-11 pl-10 pr-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input required type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"
                className="w-full h-11 pl-10 pr-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
            </div>

            {mode === "login" && (
              <button type="button" onClick={handleReset} className="text-xs text-primary hover:underline">Forgot password?</button>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By continuing you agree to our <Link to="/" className="text-primary hover:underline">Terms</Link> and <Link to="/" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;