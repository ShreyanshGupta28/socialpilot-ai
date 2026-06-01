"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, User, Users } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Sheet } from "../ui/Sheet";
import { PlanBadge } from "../shared/PlanBadge";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "../shared/ThemeToggle";
import {
  LayoutDashboard,
  MessageSquareReply,
  PenTool,
  Bookmark,
  BookOpen,
  Settings,
  LogOut,
  BarChart3
} from "lucide-react";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    plan: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Creator Studio";
      case "/reply":
        return "Reply Generator";
      case "/improve":
        return "Message Improver";
      case "/saved":
        return "Saved Replies";
      case "/crm":
        return "Brand Opportunities";
      case "/analytics":
        return "Creator Insights";
      case "/templates":
        return "Template Playbook";
      case "/settings":
        return "Settings";
      default:
        return "Creator Studio";
    }
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Reply Generator", href: "/reply", icon: MessageSquareReply },
    { name: "Message Improver", href: "/improve", icon: PenTool },
    { name: "Saved Library", href: "/saved", icon: Bookmark },
    { name: "Templates", href: "/templates", icon: BookOpen },
    { name: "Brand Opportunities", href: "/crm", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-[#F1F5F9] bg-[#FFFFFF]/90 backdrop-blur-md px-6 lg:left-64 text-[#334155]">
        {/* Mobile Left Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden rounded-lg p-1.5 hover:bg-slate-50 text-[#64748B] hover:text-[#334155] transition-colors cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg lg:text-xl font-bold font-syne text-[#334155] tracking-wide">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right User summary */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs text-muted font-medium">Active Account</span>
            <span className="text-sm font-semibold text-[#334155] truncate max-w-[120px]">
              {user.name || user.email}
            </span>
          </div>
          <Link href="/settings">
            <Avatar name={user.name} email={user.email} size="sm" className="hover:scale-105 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Mobile Nav Sheet Drawer */}
      <Sheet isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} side="left">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-600 shadow-md">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-base font-bold font-syne tracking-wider text-[#334155]">
            Creator <span className="text-violet-500">Studio</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-[#64748B] hover:text-violet-600 hover:bg-[#F9A8D4]/8"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/5 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[#F0F4FF]">{user.name || "User"}</p>
              <p className="text-xs truncate text-[#94A3B8]">{user.email}</p>
            </div>
            <PlanBadge plan={user.plan} />
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </Sheet>
    </>
  );
}
