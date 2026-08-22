"use client";

import { useEffect, useState } from "react";

type Health = "ok" | "down" | "checking";

export function ServerStatus() {
  const [health, setHealth] = useState<Health>("checking");
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (!cancelled) {
          setHealth("ok");
          setPoints(data.points ?? null);
        }
      } catch {
        if (!cancelled) {
          setHealth("down");
          setPoints(null);
        }
      }
    }

    check();
    const timer = setInterval(check, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  if (health === "checking") {
    return (
      <span className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-300" />
        <span className="hidden sm:inline">连接中</span>
      </span>
    );
  }

  if (health === "down") {
    return (
      <span
        className="flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-1 text-xs text-red-700"
        title="服务未响应，请等待自动重启或刷新页面"
      >
        <span className="h-2 w-2 rounded-full bg-red-500" />
        离线
      </span>
    );
  }

  return (
    <span
      className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
      title={points != null ? `知识库 ${points} 条知识点` : "服务正常"}
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span className="hidden sm:inline">在线</span>
      {points != null && <span>{points}</span>}
    </span>
  );
}
