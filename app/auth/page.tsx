"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { WordmarkIcon } from "@/components/ui/header-2";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import posthog from "posthog-js";

function AuthPageInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastProvider, setLastProvider] = useState<"google" | "github" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastAuthProvider");
    if (stored === "google" || stored === "github") setLastProvider(stored);
  }, []);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "callback_failed") setError("Sign-in failed. Please try again.");
    if (err === "missing_code") setError("Invalid sign-in link. Please try again.");
  }, [searchParams]);

  const signInWith = async (provider: "google" | "github") => {
    localStorage.setItem("lastAuthProvider", provider);
    setLoading(provider);
    setError(null);
    posthog.capture("sign_in_clicked", { provider });
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background ambient gradients to match landing page polish */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-6 left-6 z-10 md:top-8 md:left-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-100">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-8 flex items-center justify-center">
            <WordmarkIcon className="text-3xl text-[#09090b]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#09090b] text-center">
            Log in or sign up
          </h2>
          <p className="mt-2 text-sm text-zinc-500 text-center">
            Join thousands of builders shipping faster.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3.5">
            <div className="relative">
              {lastProvider === "google" && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 text-[11px] font-medium bg-zinc-900 text-white px-2.5 py-0.5 rounded-full shadow-sm pointer-events-none">
                  Last used
                </span>
              )}
              <button
                type="button"
                onClick={() => signInWith("google")}
                disabled={loading !== null}
                className={`group flex w-full items-center justify-center gap-3 rounded-xl border bg-white px-4 py-3.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-1 ${lastProvider === "google" ? "border-zinc-400 ring-1 ring-zinc-200" : "border-zinc-200"}`}
              >
                {loading === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-hover:scale-105" aria-hidden="true">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.25024 6.60998L5.32028 9.76998C6.27525 6.61001 9.19528 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L20.18 21.29C22.57 19.09 24 15.96 24 12.275H23.49Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.55493C0.46 8.22993 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.4449L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 20.965L15.8404 17.775C14.7504 18.51 13.4454 18.945 12.0004 18.945C9.19538 18.945 6.2754 17.085 5.3204 13.925L1.25037 17.085C3.25537 21.005 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                )}
                Continue with Google
              </button>
            </div>

            <div className="relative">
              {lastProvider === "github" && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 text-[11px] font-medium bg-zinc-900 text-white px-2.5 py-0.5 rounded-full shadow-sm pointer-events-none">
                  Last used
                </span>
              )}
              <button
                type="button"
                onClick={() => signInWith("github")}
                disabled={loading !== null}
                className={`group flex w-full items-center justify-center gap-3 rounded-xl border bg-[#24292F] px-4 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#24292F]/90 focus:outline-none focus:ring-2 focus:ring-[#24292F] focus:ring-offset-1 ${lastProvider === "github" ? "border-zinc-900 ring-1 ring-zinc-500" : "border-transparent"}`}
              >
                {loading === "github" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white/80" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-transform group-hover:scale-105" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                )}
                Continue with GitHub
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[13px] text-zinc-500 leading-relaxed px-4">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 transition-colors">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageInner />
    </Suspense>
  );
}
