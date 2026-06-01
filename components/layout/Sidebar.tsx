"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { PlanBadge } from "../shared/PlanBadge";
import {
  LayoutDashboard,
  MessageSquareReply,
  PenTool,
  Bookmark,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  BarChart3,
  Users
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    plan: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

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
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-[#F1F5F9] bg-[#FFFFFF] text-[#334155]">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-[#F1F5F9] gap-2.5">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-violet-600 shadow-md shadow-violet-600/20 border border-violet-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold font-syne tracking-wider text-[#334155]">
          Creator <span className="text-violet-500">Studio</span>
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                  : "text-[#64748B] hover:text-violet-600 hover:bg-[#F9A8D4]/8"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Session Details & Logout */}
      <div className="border-t border-[#F1F5F9] p-4 space-y-3 bg-[#FFFDF8]">
        <div className="flex items-center gap-3 px-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-[#334155]">{user.name || "User"}</p>
            <p className="text-xs truncate text-[#64748B]">{user.email}</p>
          </div>
          <PlanBadge plan={user.plan} />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
