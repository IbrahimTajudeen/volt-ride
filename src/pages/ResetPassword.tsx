import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    nav("/account");
  };

  return (
    <Layout>
      <section className="container-px mx-auto max-w-md py-16">
        <div className="card-surface rounded-2xl p-8 shadow-elevated">
          <h1 className="font-display text-2xl font-bold mb-2">Set a new password</h1>
          <p className="text-sm text-muted-foreground mb-6">Pick something you'll remember — at least 6 characters.</p>
          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input required type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password"
                className="w-full h-11 pl-10 pr-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;