"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileUp,
  LayoutDashboard,
  Presentation,
  Library,
  AlertTriangle,
  Activity,
  FolderOpen,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ServerStatus } from "@/components/server-status";

const links: { href: string; label: string; icon: typeof LayoutDashboard; blank?: boolean }[] = [
  { href: "/", label: "首页", icon: LayoutDashboard },
  { href: "/library", label: "知识总库", icon: Library },
  { href: "/handbook", label: "手册", icon: FileText, blank: true },
  { href: "/library/conflicts", label: "冲突组", icon: AlertTriangle },
  { href: "/sources", label: "来源", icon: FolderOpen },
  { href: "/upload", label: "导入", icon: FileUp },
  { href: "/compose", label: "编排", icon: Presentation },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/library") return pathname === "/library";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="hidden sm:inline">公司知识库</span>
          <span className="sm:hidden">知识库</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ServerStatus />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map(({ href, label, icon: Icon, blank }) => {
              const className = cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              );
              if (blank) {
                return (
                  <a key={href} href={href} target="_blank" rel="noreferrer" className={className}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                );
              }
              return (
                <Link key={href} href={href} className={className}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/status"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                pathname === "/status"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              )}
              title="系统状态"
            >
              <Activity className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {links.map(({ href, label, icon: Icon, blank }) => {
              const className = cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                isActive(href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              );
              if (blank) {
                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className={className}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/status"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                pathname === "/status" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Activity className="h-4 w-4" />
              系统状态
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
