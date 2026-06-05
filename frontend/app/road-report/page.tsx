"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import { computeGlamScore } from "@/lib/score";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

type RouteRow = {
  id: string;
  glamName: string;
  glamScore: number;
};

export default function RoadReportPage() {
  const rows = useMemo<RouteRow[]>(() => {
    return Object.values(ROUTES).map((route) => ({
      id: route.id,
      glamName: route.glamName,
      glamScore: computeGlamScore(route.integrityEnd),
    })).sort((a, b) => b.glamScore - a.glamScore);
  }, []);

  return (
    <GradientBackground>
      <div className="relative w-full min-h-dvh px-5 py-6">
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/"
            className="h-11 w-11 rounded-2xl inline-flex items-center justify-center text-2xl"
            style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(99,102,241,0.18)", color: "#4c4876" }}
            aria-label="Back to landing"
          >
            ‹
          </Link>
          <div>
            <p className="font-inter text-xs font-semibold" style={{ color: "#7e77ab" }}>
              Route leaderboard
            </p>
            <h1 className="font-playfair text-4xl font-bold leading-none" style={{ color: "#1e1b4b" }}>
              Road Report
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((row, index) => (
            <motion.div
              key={row.id}
              className="glass rounded-3xl p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index }}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="font-playfair text-3xl font-bold leading-tight" style={{ color: "#2f2957" }}>
                    {row.glamName}
                  </p>
                </div>
                <div
                  className="rounded-2xl px-4 py-3 text-center"
                  style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(99,102,241,0.14)", minWidth: 74 }}
                >
                  <p className="font-inter text-4xl font-bold leading-none" style={{ color: scoreColor(row.glamScore) }}>
                    {row.glamScore}
                  </p>
                  <p className="font-inter text-xs mt-1" style={{ color: "#7e77ab" }}>/100</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}
