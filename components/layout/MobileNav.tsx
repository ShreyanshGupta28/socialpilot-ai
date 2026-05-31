"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquareReply,
  PenTool,
  Bookmark,
  Settings
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Reply", href: "/reply", icon: MessageSquareReply },
    { name: "Improve", href: "/improve", icon: PenTool },
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden flex h-16 items-center justify-around border-t border-white/10 bg-[#070B16]/95 backdrop-blur-md px-2 pb-safe text-[#F0F4FF] shadow-lg shadow-black/45">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 text-center transition-all cursor-pointer min-h-[44px] min-w-[44px]",
              isActive ? "text-violet-500 scale-105" : "text-[#94A3B8] hover:text-[#F0F4FF]"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium mt-1 tracking-wider">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
