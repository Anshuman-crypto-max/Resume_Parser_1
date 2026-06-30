"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Command, FileSearch, Menu, Moon, Search, Sun } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mobileLinks = [
  ["/dashboard", "Dashboard"],
  ["/dashboard/candidates", "Candidates"],
  ["/dashboard/upload", "Upload"],
  ["/dashboard/analytics", "Analytics"]
] as const;

export function Topbar() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/84 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-8">
        <Button className="lg:hidden" size="icon" variant="ghost" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">
          <Menu size={18} />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileSearch size={17} />
          </span>
          Resume Parser
        </Link>
        <div className="hidden min-w-0 flex-1 items-center md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input className="pl-9 pr-20" placeholder="Search candidates, skills, locations, universities..." />
            <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground xl:flex">
              <Command size={11} /> K
            </span>
          </div>
        </div>
        <div className="ml-auto hidden sm:block">
          <OrganizationSwitcher hidePersonal />
        </div>
        <Button size="icon" variant="ghost" aria-label="Notifications">
          <Bell size={18} />
        </Button>
        <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle dark mode">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
      {menuOpen ? (
        <nav className="grid gap-1 border-t bg-background px-4 py-3 lg:hidden">
          {mobileLinks.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
