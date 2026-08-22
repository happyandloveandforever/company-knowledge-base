import type { ReadonlyURLSearchParams } from "next/navigation";

export interface FilterState {
  search: string;
  category: string;
  status: string;
  similar: string;
  source: string;
  tags: string[];
}

export function parseFilters(params: URLSearchParams | ReadonlyURLSearchParams): FilterState {
  const tags = params.get("tags");
  return {
    search: params.get("q") || "",
    category: params.get("category") || "",
    status: params.get("status") || "",
    similar: params.get("similar") || "",
    source: params.get("source") || "",
    tags: tags ? tags.split(",").filter(Boolean) : [],
  };
}

export function filtersToParams(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.search) p.set("q", f.search);
  if (f.category) p.set("category", f.category);
  if (f.status) p.set("status", f.status);
  if (f.similar) p.set("similar", f.similar);
  if (f.source) p.set("source", f.source);
  if (f.tags.length) p.set("tags", f.tags.join(","));
  return p.toString();
}

export function filtersKey(f: FilterState): string {
  return filtersToParams(f);
}
