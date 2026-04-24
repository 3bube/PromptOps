"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WordmarkIcon } from "@/components/ui/header-2";
import posthog from "posthog-js";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const sendWelcomeEmail = async (email: string, fullName?: string) => {
      try {
        await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fullName }),
        });
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    };

    if (code) {
      // PKCE flow — exchange code for session
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error && data.session?.user) {
          const u = data.session.user;
          posthog.identify(u.id, { email: u.email, provider: u.app_metadata?.provider });
          posthog.capture("sign_in_completed", { provider: u.app_metadata?.provider, flow: "pkce" });
          sendWelcomeEmail(u.email || "", u.user_metadata?.full_name);
        }
        router.replace(error ? "/auth?error=callback_failed" : "/");
      });
      return;
    }

    // Implicit flow — Supabase client auto-reads the #hash and fires SIGNED_IN
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        posthog.identify(session.user.id, { email: session.user.email, provider: session.user.app_metadata?.provider });
        posthog.capture("sign_in_completed", { provider: session.user.app_metadata?.provider, flow: "implicit" });
        sendWelcomeEmail(session.user.email || "", session.user.user_metadata?.full_name);
        subscription.unsubscribe();
        router.replace("/");
      }
    });

    // No code and no hash means the link is invalid
    if (!window.location.hash) {
      router.replace("/auth?error=missing_code");
    }

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-2 flex items-center justify-center ">
          <WordmarkIcon className="text-4xl text-[#09090b]" />
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2 className="w-5 h-5 animate-spin text-black" />
          <p className="text-sm font-medium">Authenticating your session...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
