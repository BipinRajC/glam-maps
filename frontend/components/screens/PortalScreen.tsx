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

const ROUTE_LEADERBOARD = [
  { routeId: "influencer", badge: "🥇" },
  { routeId: "brunch",     badge: "🥈" },
  { routeId: "survival",   badge: "💀" },
];

export default function PortalScreen({ onEnter, passport }: PortalScreenProps) {
  return (
    <motion.div
      className="relative w-full min-h-dvh overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Sparkles />

      {/* Responsive inner layout: stacked on mobile, side-by-side on desktop */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 flex flex-col lg:flex-row gap-8 items-center lg:items-start">

        {/* Left column: hero card */}
        <div className="flex flex-col items-center lg:items-start gap-5 w-full lg:max-w-md">
          {/* Brand pill */}
          <motion.div
            className="px-3 py-1 rounded-full text-xs font-inter font-semibold"
            style={{ background: "rgba(194,24,91,0.18)", border: "1px solid rgba(194,24,91,0.4)", color: "#FF4081" }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            ✦ Flipkart Glam Up × Namma Pothole ✦
          </motion.div>

          {/* Hero card */}
          <motion.div
            className="relative glass w-full px-6 sm:px-8 pt-8 pb-7 flex flex-col items-center gap-5 text-center"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 18, stiffness: 80, delay: 0.1 }}
          >
            <motion.div
              className="absolute inset-0 rounded-[20px] pointer-events-none"
              style={{ border: "1px solid rgba(249,168,37,0.22)", borderRadius: 20 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <motion.div
              className="text-7xl sm:text-8xl"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              💄
            </motion.div>

            <div>
              <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream leading-tight mb-3">
                Welcome to the{" "}
                <span style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Glamverse
                </span>
              </h1>
              <p className="font-inter text-sm sm:text-base text-cream/60 leading-relaxed">
                Bengaluru&apos;s roads have opinions about your makeup.
                <br />Let&apos;s find out which ones are on your side.
              </p>
            </div>

            <motion.button
              className="w-full py-4 rounded-2xl font-inter font-bold text-base sm:text-lg text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 50%, #F9A825 100%)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
              />
              Enter the Glamverse ✨
            </motion.button>

            <div className="flex items-center gap-4 text-xs font-inter">
              <Link href="/passport" className="text-gold/70 hover:text-gold transition-colors underline underline-offset-2">
                {passport.length > 0 ? `✦ ${passport.length} route${passport.length > 1 ? "s" : ""} in Passport` : "View Glam Passport"}
              </Link>
              <span className="text-cream/20">|</span>
              <span className="text-cream/30">nammapothole.com</span>
            </div>
          </motion.div>
        </div>

        {/* Right column: leaderboard — always shows, stacks below on mobile */}
        <motion.div
          className="glass w-full lg:max-w-sm px-5 sm:px-6 py-5 flex flex-col gap-4 self-start"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-playfair text-base sm:text-lg font-bold text-cream">Bengaluru Road Report</h3>
            <span className="font-inter text-xs text-champagne/50">Route rankings</span>
          </div>

          <div className="flex flex-col gap-3">
            {ROUTE_LEADERBOARD.map(({ routeId, badge }, i) => {
              const r = ROUTES[routeId];
              return (
                <motion.div
                  key={routeId}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  <span className="text-xl w-7 text-center shrink-0">{badge}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm font-semibold text-cream truncate">{r.glamName}</p>
                    <p className="font-inter text-xs text-champagne/45">{r.realName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-inter font-semibold px-1.5 py-0.5 rounded-full border ${getDifficultyBg(r.difficulty)}`}>
                      {r.difficulty === "Survival Mode" ? "💀" : r.difficulty}
                    </span>
                    <span className="font-inter text-sm font-bold tabular-nums" style={{ color: roadScoreColor(r.roadScore) }}>
                      {r.roadScore}<span className="text-xs text-champagne/40">/100</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-champagne/10">
            <p className="font-inter text-xs text-champagne/40 leading-relaxed">
              Road score based on pothole density, community reports, and surface condition data from Namma Pothole.
            </p>
          </div>

          <AuthenticityBadge variant="powered" />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        className="relative z-10 font-inter text-xs text-cream/20 text-center pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
      >
        Road data powered by Namma Pothole community reports 🗺️
      </motion.p>
    </motion.div>
  );
}

function roadScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#F9A825";
  return "#ef4444";
}
