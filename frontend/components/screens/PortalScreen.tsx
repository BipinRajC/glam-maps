"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Sparkles from "@/components/shared/Sparkles";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { ROUTES } from "@/lib/routes";
import { getDifficultyBg } from "@/lib/score";

interface PortalScreenProps {
  onEnter: () => void;
  passport: string[];
}

// Route-based leaderboard — ranked by road quality score (higher = better roads)
const ROUTE_LEADERBOARD = [
  { routeId: "influencer", badge: "🥇" },
  { routeId: "brunch",     badge: "🥈" },
  { routeId: "survival",   badge: "💀" },
];

export default function PortalScreen({ onEnter, passport }: PortalScreenProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center min-h-dvh w-full overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Sparkles />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-4 py-8 gap-5">
        {/* Brand pill */}
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter font-semibold"
          style={{ background: "rgba(194,24,91,0.18)", border: "1px solid rgba(194,24,91,0.4)", color: "#FF4081" }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ✦ Flipkart Glam Up × Namma Pothole ✦
        </motion.div>

        {/* Hero card */}
        <motion.div
          className="relative glass w-full px-6 pt-7 pb-6 flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 18, stiffness: 80, delay: 0.1 }}
        >
          {/* Animated gold border glow */}
          <motion.div
            className="absolute inset-0 rounded-[20px] pointer-events-none"
            style={{ border: "1px solid rgba(249,168,37,0.25)", borderRadius: 20 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.div
            className="text-7xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💄
          </motion.div>

          <div>
            <motion.h1
              className="font-playfair text-4xl font-bold text-cream leading-tight mb-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Welcome to the{" "}
              <span style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Glamverse
              </span>
            </motion.h1>
            <motion.p
              className="font-inter text-sm text-cream/60 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Bengaluru&apos;s roads have opinions about your makeup.
              <br />Let&apos;s find out which ones are on your side.
            </motion.p>
          </div>

          <motion.button
            className="w-full py-4 rounded-2xl font-inter font-bold text-base text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 50%, #F9A825 100%)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            />
            Enter the Glamverse ✨
          </motion.button>

          {/* Passport link */}
          {passport.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
              <Link
                href="/passport"
                className="font-inter text-xs text-gold/80 hover:text-gold underline underline-offset-2 transition-colors"
              >
                ✦ {passport.length} route{passport.length > 1 ? "s" : ""} in your Glam Passport →
              </Link>
            </motion.div>
          )}
          {passport.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
              <Link
                href="/passport"
                className="font-inter text-xs text-cream/30 hover:text-cream/50 transition-colors"
              >
                View Glam Passport →
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Bengaluru Glam Leaderboard — route-based */}
        <motion.div
          className="glass w-full px-5 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-playfair text-sm font-bold text-cream">Bengaluru Road Report</h3>
            <span className="font-inter text-xs text-champagne/50">Route rankings</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {ROUTE_LEADERBOARD.map(({ routeId, badge }, i) => {
              const r = ROUTES[routeId];
              return (
                <motion.div
                  key={routeId}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.08 }}
                >
                  <span className="text-lg w-7 text-center shrink-0">{badge}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-xs font-semibold text-cream truncate">{r.glamName}</p>
                    <p className="font-inter text-xs text-champagne/50 truncate">{r.realName}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-inter font-semibold px-1.5 py-0.5 rounded-full border ${getDifficultyBg(r.difficulty)}`}>
                      {r.difficulty}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="font-inter text-sm font-bold tabular-nums" style={{ color: roadScoreColor(r.roadScore) }}>
                        {r.roadScore}
                      </span>
                      <span className="font-inter text-xs text-champagne/40 leading-none">/ 100</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-champagne/10 flex items-center gap-1.5">
            <span className="text-xs text-champagne/40 font-inter">Road score = inverse of pothole density</span>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <AuthenticityBadge variant="powered" />
          <p className="font-inter text-xs text-cream/25 text-center">
            Road data powered by Namma Pothole 🗺️
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function roadScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#F9A825";
  return "#ef4444";
}
