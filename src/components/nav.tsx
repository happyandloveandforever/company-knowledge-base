"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileUp, LayoutDashboard, Presentation, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "首页", icon: LayoutDashboard },
  { href: "/library", label: "知识总库", icon: Library },
  { href: "/upload", label: "导入文件", icon: FileUp },
  { href: "/compose", label: "编排演讲", icon: Presentation },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span>公司知识库</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
