"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface PortalScreenProps {
  onEnter: () => void;
}

const STATS = [
  { value: "41+", label: "Reports" },
  { value: "20", label: "Routes" },
  { value: "100%", label: "Verified" },
];

export default function PortalScreen({ onEnter }: PortalScreenProps) {
  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex-1 flex flex-col gap-6 px-5 py-8">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter font-semibold w-fit"
            style={{ background: "rgba(194,24,91,0.1)", border: "1px solid rgba(194,24,91,0.25)", color: "#C2185B" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✦ Flipkart Glam Up
          </motion.div>

          <div>
            <p className="font-inter text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#8480aa" }}>
              Bengaluru
            </p>
            <h1
              className="font-playfair font-bold leading-[0.95] mb-3"
              style={{
                fontSize: "3.2rem",
                background: "linear-gradient(135deg, #1e1b4b 0%, #C2185B 55%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Glamverse
            </h1>
            <p className="font-inter text-sm leading-relaxed" style={{ color: "#4c4876" }}>
              Pick the route. Protect the look.
            </p>
          </div>

          <motion.button
            className="relative overflow-hidden py-5 rounded-2xl font-inter font-bold text-lg text-white"
            style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 55%, #6366f1 100%)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnter}
          >
            Enter the Glamverse ✨
          </motion.button>

          <Link
            href="/road-report"
            className="glass py-3.5 rounded-2xl font-inter font-semibold text-base text-center"
            style={{ color: "#2f2957" }}
          >
            View Road Report
          </Link>

          <div className="grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="glass px-3 py-3 text-center">
                <div className="font-inter font-bold text-lg" style={{ color: "#C2185B" }}>{s.value}</div>
                <div className="font-inter text-xs" style={{ color: "#8480aa" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center px-5 pb-6">
          <AuthenticityBadge variant="powered" size="sm" />
        </div>
      </motion.div>
    </GradientBackground>
  );
}

const ROUTE_LEADERBOARD = [
  { routeId: "influencer", badge: "🥇" },
  { routeId: "brunch", badge: "🥈" },
  { routeId: "survival", badge: "💀" },
];

const STATS = [
  { value: "41+", label: "Reports" },
  { value: "3", label: "Routes" },
  { value: "100%", label: "Verified" },
];

export default function PortalScreen({ onEnter }: PortalScreenProps) {

  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex-1 flex flex-col gap-6 px-5 py-8">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter font-semibold w-fit"
            style={{ background: "rgba(194,24,91,0.1)", border: "1px solid rgba(194,24,91,0.25)", color: "#C2185B" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✦ Flipkart Glam Up
          </motion.div>

          <div>
            <p className="font-inter text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#8480aa" }}>
              Bengaluru
            </p>
            <h1
              className="font-playfair font-bold leading-[0.95] mb-3"
              style={{
                fontSize: "3.2rem",
                background: "linear-gradient(135deg, #1e1b4b 0%, #C2185B 55%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Glamverse
            </h1>
            <p className="font-inter text-sm leading-relaxed" style={{ color: "#4c4876" }}>
              Pick the route. Protect the look.
            </p>
          </div>

          <motion.button
            className="relative overflow-hidden py-5 rounded-2xl font-inter font-bold text-lg text-white"
            style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 55%, #6366f1 100%)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnter}
          >
            Enter the Glamverse ✨
          </motion.button>

          <Link
            href="/road-report"
            className="glass py-3.5 rounded-2xl font-inter font-semibold text-base text-center"
            style={{ color: "#2f2957" }}
          >
            View Road Report
          </Link>

          <div className="grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="glass px-3 py-3 text-center">
                <div className="font-inter font-bold text-lg" style={{ color: "#C2185B" }}>{s.value}</div>
                <div className="font-inter text-xs" style={{ color: "#8480aa" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
              <h3 className="font-playfair text-lg font-bold" style={{ color: "#1e1b4b" }}>Road Report</h3>
            </div>
            <div className="px-3 py-3 flex flex-col gap-2">
              {ROUTE_LEADERBOARD.map(({ routeId, badge }) => {
                const r = ROUTES[routeId];
                return (
                  <div
                    key={routeId}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl"
                    style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.08)" }}
                  >
                    <span className="text-xl w-6 text-center shrink-0">{badge}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-sm font-semibold truncate" style={{ color: "#1e1b4b" }}>{r.glamName}</p>
                    </div>
                    <span className="font-inter text-base font-bold tabular-nums" style={{ color: roadScoreColor(r.roadScore) }}>
                      {r.roadScore}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center px-5 pb-6">
          <AuthenticityBadge variant="powered" size="sm" />
        </div>
      </motion.div>
    </GradientBackground>
  );
}

function roadScoreColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}
