"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="PromptOps"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            PromptOps
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.push("/pricing")}
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </button>

          <ModeToggle />

          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/auth")}
                className="hidden sm:inline-flex"
              >
                Sign in
              </Button>
              <Button size="sm" onClick={() => router.push("/auth")}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
