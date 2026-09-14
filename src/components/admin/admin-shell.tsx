"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, UserRound } from "lucide-react";
import { Crest } from "@/components/crest";
import { AdminIcon } from "@/components/admin/admin-icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { adminNav, isLive, type AdminNavItem } from "@/lib/admin-nav";
import { school } from "@/lib/site";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/admin/(panel)/actions";

type ShellUser = { displayName: string; username: string };

function NavLink({ item, active, onNavigate }: { item: AdminNavItem; active: boolean; onNavigate?: () => void }) {
  const live = isLive(item);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-white/12 text-white shadow-sm ring-1 ring-white/10"
          : "text-brand-foreground/70 hover:bg-white/8 hover:text-white",
      )}
    >
      <AdminIcon
        name={item.icon}
        className={cn("size-4 shrink-0", active ? "text-gold" : "text-brand-foreground/50 group-hover:text-gold")}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {!live ? (
        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-foreground/60">
          Phase {item.phase}
        </span>
      ) : null}
    </Link>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <Crest className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[15px] font-semibold tracking-tight text-white">{school.shortName}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">Admin Panel</span>
      </span>
    </Link>
  );
}

function UserBlock({ user }: { user: ShellUser }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/6 p-3 ring-1 ring-white/10">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground">
        <UserRound className="size-4" />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-semibold text-white">{user.displayName}</span>
        <span className="block truncate text-xs text-brand-foreground/60">@{user.username}</span>
      </span>
      <form action={signOut}>
        <Button
          type="submit"
          size="icon-sm"
          variant="ghost"
          title="Sign out"
          aria-label="Sign out"
          className="text-brand-foreground/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" />
        </Button>
      </form>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");
}

export function AdminShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = adminNav.find((i) => isActive(pathname, i.href));

  const nav = (onNavigate?: () => void) => (
    <nav className="grid gap-1" aria-label="Admin sections">
      {adminNav.map((item) => (
        <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} onNavigate={onNavigate} />
      ))}
    </nav>
  );

  return (
    <div className="flex flex-1">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh w-72 shrink-0 flex-col bg-brand text-brand-foreground lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">{nav()}</div>
        <div className="space-y-3 border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-1 text-xs font-medium text-brand-foreground/60 transition-colors hover:text-gold"
          >
            <ExternalLink className="size-3.5" />
            Open the public website
          </Link>
          <UserBlock user={user} />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-brand p-0 text-brand-foreground [&>button]:text-white">
                <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
                  <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                  <Brand />
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4 py-5">{nav(() => setOpen(false))}</div>
                <div className="space-y-3 border-t border-white/10 p-4">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-1 text-xs font-medium text-brand-foreground/60 transition-colors hover:text-gold"
                  >
                    <ExternalLink className="size-3.5" />
                    Open the public website
                  </Link>
                  <UserBlock user={user} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
              <Crest className="h-8 w-8" />
              <span className="truncate font-heading text-sm font-semibold text-brand">Admin Panel</span>
            </div>

            <h1 className="hidden min-w-0 flex-1 truncate font-heading text-lg font-semibold text-brand lg:block">
              {current?.label ?? "Admin Panel"}
            </h1>

            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span className="hidden md:inline">Signed in as</span>
              <span className="font-medium text-foreground">{user.displayName}</span>
            </div>
            <form action={signOut} className="hidden lg:block">
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="size-3.5" />
                Sign out
              </Button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          {school.name} · Website Admin Panel
        </footer>
      </div>
    </div>
  );
}
