"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/analysis", label: "Analysis" },
  { href: "/risk", label: "Risk" },
  { href: "/report", label: "Report" },
  { href: "/architecture", label: "Architecture" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            NexusBridge
          </span>
          <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            DX
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={cn(
                  pathname === item.href && "shadow-lg shadow-primary/20"
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

