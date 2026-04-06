"use client";

import { Sparkles, LogOut } from "lucide-react";
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
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <div className="w-18 h-18 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="PromptOps"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            PromptOps
          </span>
        </button>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/auth")}
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
