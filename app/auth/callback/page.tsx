"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WordmarkIcon } from "@/components/ui/header-2";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // PKCE flow — exchange code for session
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        router.replace(error ? "/auth?error=callback_failed" : "/");
      });
      return;
    }

    // Implicit flow — Supabase client auto-reads the #hash and fires SIGNED_IN
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
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
