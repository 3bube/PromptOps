"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { user, loading } = useAuth();
  //   const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-background">
  //         <Loader2 className="w-6 h-6 animate-spin text-primary" />
  //       </div>
  //     );
  //   }

  if (user) {
    router.push("/templates");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setEmailSent(true);
      //   toast({
      //     title: "Magic link sent!",
      //     description: "Check your email to sign in.",
      //   });
    } catch (error: any) {
      //   toast({
      //     title: "Something went wrong",
      //     description: error.message,
      //     variant: "destructive",
      //   });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[200px] bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            PromptOps
          </span>
        </div>

        <div className="card-elevated rounded-3xl p-8 glow-primary animate-fade-in-scale">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Check your email
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We sent a magic link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Click it to sign in.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setEmailSent(false)}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to PromptOps
                </h1>
                <p className="text-muted-foreground">
                  Sign in with your email — no password needed
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="input-glow rounded-xl transition-shadow duration-300">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 rounded-xl border-border/60 bg-surface-sunken text-base placeholder:text-text-tertiary focus-visible:ring-primary/20"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  Continue with Email
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
