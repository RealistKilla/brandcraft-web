"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-background"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2 md:gap-3 mr-4 h-8">
              <img
                src="/logos/logo-dark.svg"
                alt="Logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-2",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
              {pathname === item.href && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="navbar-underline"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ModeToggle />
          {loading ? (
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
            </div>
          ) : user ? (
            <Button asChild className="hidden md:flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="hidden md:flex">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-b"
          >
            <div className="container py-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                      pathname === item.href
                        ? "bg-muted text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-9 w-full bg-muted animate-pulse rounded-md"></div>
                    <div className="h-9 w-full bg-muted animate-pulse rounded-md"></div>
                  </div>
                ) : user ? (
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}