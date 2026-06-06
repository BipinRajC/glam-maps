import { useMemo } from "react";

export function useFuzzyFilter<T>(
  items: T[],
  query: string,
  keys: (keyof T)[],
): T[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const scored: Array<{ item: T; score: number }> = [];
    for (const item of items) {
      let best = -1;
      for (const key of keys) {
        const value = String(item[key] ?? "").toLowerCase();
        if (value.startsWith(q)) best = Math.max(best, 3);
        else if (value.includes(q)) best = Math.max(best, 2);
      }
      if (best > 0) scored.push({ item, score: best });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.item);
  }, [items, query, keys]);
}
