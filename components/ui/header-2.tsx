"use client";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/hooks/useScroll";
import { motion } from "framer-motion";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const links = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Use Cases", href: "/#use-cases" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ];

  React.useEffect(() => {
    if (open) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll
      document.body.style.overflow = "";
    }

    // Cleanup when component unmounts (important for Next.js)
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      layout
      transition={{ type: "spring", stiffness: 300, damping: 100 }}
      className={cn(
        "sticky z-50 mx-auto w-full md:border text-zinc-900 transition-colors duration-300 border-b py-2 ",
        {
          "bg-white/95 supports-backdrop-filter:bg-white/50 border-zinc-200 backdrop-blur-lg md:shadow-sm md:rounded-full":
            scrolled && !open,
          "bg-white/90 border-zinc-200 md:rounded-md": open,
          "border-transparent bg-transparent md:rounded-full":
            !scrolled && !open,
          "top-0 max-w-5xl": !scrolled,
          "top-0 md:top-4 max-w-5xl md:max-w-5xl": scrolled,
        },
      )}
    >
      <motion.nav
        layout
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12",
          {
            "md:px-6": scrolled,
          },
        )}
      >
        <Link href="/#hero">
          <WordmarkIcon className="h-4" />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link, i) => (
            <Link
              key={i}
              className={buttonVariants({
                variant: "ghost",
                className: "hover:bg-zinc-100 hover:text-zinc-900",
              })}
              href={link.href}
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  const targetId = link.href.split("#")[1];
                  const target = document.getElementById(targetId);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* <Link
            href="/auth"
            className={buttonVariants({
              variant: "outline",
              className:
                "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100",
            })}
          >
            Sign In
          </Link> */}
          <Link
            href="/auth"
            className={buttonVariants({
              className: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
            })}
          >
            Get Started
          </Link>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </motion.nav>

      <div
        className={cn(
          "bg-white/95 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y border-zinc-200 md:hidden text-zinc-900",
          open ? "block" : "hidden",
        )}
      >
        <div
          data-slot={open ? "open" : "closed"}
          className={cn(
            "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out",
            "flex h-full w-full flex-col justify-between gap-y-2 p-4",
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => (
              <Link
                key={link.label}
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "justify-start hover:bg-zinc-100 hover:text-zinc-900",
                })}
                href={link.href}
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    const targetId = link.href.split("#")[1];
                    const target = document.getElementById(targetId);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                      setOpen(false);
                    }
                  } else {
                    setOpen(false);
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                variant: "outline",
                className:
                  "w-full border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100",
              })}
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                className: "w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
              })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export const WordmarkIcon = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "font-bold text-xl tracking-tight flex items-center pointer-events-none select-none",
      className,
    )}
    {...props}
  >
    <svg
      className="h-[0.9em] w-auto "
      viewBox="0 0 226 347"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M89.018 12.75C82.252 19.763 65.996 36.3 52.893 49.5L29.07 73.5L41.092 87.5C47.704 95.2 53.546 101.934 54.075 102.465C54.692 103.083 58.237 100.245 63.957 94.551L72.877 85.672L68.442 80.603C66.003 77.815 64.008 75.121 64.008 74.615C64.008 74.11 72.184 65.456 82.177 55.384C92.169 45.313 100.635 36.603 100.99 36.03C101.346 35.453 108.142 41.538 116.199 49.648L130.763 64.308L133.636 61.631C137.76 57.788 144.541 54.751 150.218 54.206L155.131 53.734L135.707 34.117C125.024 23.328 113.201 11.237 109.434 7.25C105.667 3.263 102.3 0 101.952 0C101.604 0 95.783 5.737 89.018 12.75ZM144.092 64.498C142.213 65.348 137.393 69.521 133.38 73.772L126.084 81.5L135.085 90.5L144.086 99.5L148.693 94.185L153.3 88.87L157.779 93.185C163.322 98.524 170.915 109.879 173.961 117.384L176.252 123.03L182.88 113.24C186.525 107.856 190.272 102.277 191.205 100.842C192.876 98.272 192.83 98.123 188.205 91.112C182.857 83.006 170.432 69.929 164.542 66.208C159.499 63.022 149.25 62.165 144.092 64.498ZM74.753 95.755L48.008 122.514V158.88V195.247L59.758 184.428C66.22 178.477 72.081 172.922 72.78 172.083C73.722 170.954 74.029 165.494 73.962 151.101L73.871 131.646L87.929 117.588L101.987 103.529L109.248 110.653C114.786 116.086 117.398 117.932 120.262 118.434C125.327 119.322 128.008 122.385 128.008 127.284C128.008 132.509 130.659 136.701 135.242 138.723C139.573 140.634 139.947 141.547 136.73 142.355C132.396 143.443 128.932 148.29 128.098 154.432C127.675 157.554 126.599 160.837 125.708 161.728C123.743 163.694 117.106 164.854 102.466 165.792L91.423 166.5L69.731 186.5L48.038 206.5L48.023 223.958L48.008 241.416L52.258 237.384C54.595 235.167 64.833 225.742 75.008 216.441C85.183 207.139 93.733 199.297 94.008 199.014C94.283 198.731 96.635 196.587 99.236 194.25C103.491 190.424 104.472 190 109.059 190C115.3 190 127.84 185.931 134.274 181.818C144.129 175.518 148.503 168.293 149.744 156.266C150.355 150.35 153.919 145.562 158.585 144.391C160.431 143.928 161.008 143.113 161.008 140.969C161.008 138.659 160.403 137.955 157.629 137.04C152.577 135.373 150.931 132.875 149.516 124.724C148.81 120.66 147.545 116.023 146.703 114.418C145.339 111.814 104.042 69.87 102.231 69.248C101.828 69.11 89.462 81.038 74.753 95.755ZM11.238 91.27L0 102.539L0.253998 224.286L0.507996 346.033L11.508 338.209C24.963 328.639 48.812 311.904 63.22 301.922L73.932 294.5L73.97 261.646L74.008 228.793L70.258 232.072C68.196 233.875 62.345 239.186 57.258 243.875L48.008 252.4L47.97 266.95L47.932 281.5L37.573 288.75C31.876 292.738 26.943 296 26.611 296C26.28 296 26.008 254.723 26.008 204.274V112.547L32.969 105.524L39.931 98.5L31.918 89.25C27.511 84.162 23.583 80 23.19 80C22.797 80 17.418 85.071 11.238 91.27ZM176.247 137.541L159.987 162H167.997C172.403 162 176.008 162.212 176.008 162.471C176.008 163.89 170.747 174.494 167.745 179.127C164.133 184.701 156.488 193.114 151.816 196.656L149.123 198.697L155.699 209.322L162.274 219.947L165.213 217.854C179.559 207.639 194.167 187.732 199.228 171.5C200.429 167.65 201.814 163.951 202.306 163.281C202.897 162.477 207.085 161.966 214.605 161.781L226.009 161.5L210.011 137.501C201.212 124.301 193.674 113.407 193.26 113.291C192.847 113.176 185.191 124.088 176.247 137.541ZM93.78 209.296L85.051 217.5L93.266 227.25L101.481 237H109.657C122.369 237 135.668 233.995 147.508 228.446C156.351 224.301 156.615 226.178 144.491 206.972L142.064 203.129L137.786 205.402C132.223 208.358 124.78 210.704 118.428 211.502L113.348 212.141L108.928 206.618C106.497 203.58 104.058 201.094 103.508 201.094C102.958 201.093 98.58 204.784 93.78 209.296Z"
        fill="currentColor"
      />
    </svg>
    romptops
  </div>
);
