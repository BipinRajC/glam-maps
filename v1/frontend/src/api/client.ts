import { config } from "@/config";
import type { RouteBundle, RoutesResponse } from "./types";

const headers = { "X-Campaign-Token": config.campaignToken };

export async function fetchRoutes(city = "bengaluru"): Promise<RoutesResponse> {
  const res = await fetch(`/api/routes?city=${city}`, { headers });
  if (!res.ok) throw new Error(`Routes fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchRouteBundle(routeId: string): Promise<RouteBundle> {
  const res = await fetch(`/api/routes/${routeId}`, { headers });
  if (!res.ok) throw new Error(`Route bundle fetch failed: ${res.status}`);
  return res.json();
}

export async function subscribeWhatsApp(
  phone: string,
  routeId: string
): Promise<{ sessionId: string }> {
  const res = await fetch("/api/wa/subscribe", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ phone, routeId }),
  });
  if (!res.ok) throw new Error(`WA subscribe failed: ${res.status}`);
  return res.json();
}
