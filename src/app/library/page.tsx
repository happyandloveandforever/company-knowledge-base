import { Suspense } from "react";
import { LibraryClient } from "@/components/library-client";

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">加载知识库…</div>}>
      <LibraryClient />
    </Suspense>
  );
}
