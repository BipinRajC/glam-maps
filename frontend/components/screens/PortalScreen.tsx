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

const STATS = [
  { value: "41+", label: "Community reports" },
  { value: "3", label: "Glam routes" },
  { value: "6", label: "Destinations" },
  { value: "100%", label: "Road-verified" },
];

export default function PortalScreen({ onEnter, passport }: PortalScreenProps) {
  return (
    <motion.div
      className="relative w-full min-h-dvh flex flex-col"
      style={{ background: "linear-gradient(145deg, #0f0a1e 0%, #1e0d30 40%, #12091e 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Sparkles />

      {/* ── Main grid: editorial hero (left) + leaderboard panel (right) ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-center">

          {/* ── LEFT: editorial hero ── */}
          <motion.div
            className="flex flex-col gap-7"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.1 }}
          >
            {/* Brand pill */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-inter font-semibold w-fit"
              style={{ background: "rgba(194,24,91,0.18)", border: "1px solid rgba(194,24,91,0.4)", color: "#FF4081" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✦ Flipkart Glam Up × Namma Pothole ✦
            </motion.div>

            {/* Big headline */}
            <div>
              <motion.p
                className="font-inter text-sm sm:text-base text-cream/50 uppercase tracking-widest font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome to the
              </motion.p>
              <motion.h1
                className="font-playfair font-bold leading-[0.9] mb-4"
                style={{
                  fontSize: "clamp(3.5rem, 8vw, 7rem)",
                  background: "linear-gradient(135deg, #FFF8F0 0%, #FF4081 50%, #F9A825 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: "spring", damping: 16 }}
              >
                Glamverse
              </motion.h1>
              <motion.p
                className="font-inter text-base sm:text-lg text-cream/55 leading-relaxed max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Bengaluru&apos;s roads have opinions about your makeup.
                <br className="hidden sm:block" />
                Let&apos;s find out which ones are on your side.
              </motion.p>
            </div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="relative overflow-hidden px-8 py-4 rounded-2xl font-inter font-bold text-base sm:text-lg text-white"
                style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 50%, #F9A825 100%)" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onEnter}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
                />
                Enter the Glamverse ✨
              </motion.button>

              <Link
                href="/passport"
                className="px-6 py-4 rounded-2xl font-inter font-semibold text-base text-cream/60 hover:text-cream border border-champagne/15 hover:border-champagne/30 transition-colors text-center sm:text-left"
              >
                {passport.length > 0 ? `✦ ${passport.length} route${passport.length > 1 ? "s" : ""} in Passport` : "View Glam Passport"}
              </Link>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              className="grid grid-cols-4 gap-4 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="font-inter font-bold text-xl sm:text-2xl" style={{ color: "#F9A825" }}>{s.value}</span>
                  <span className="font-inter text-xs text-cream/40 leading-tight">{s.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
              <AuthenticityBadge variant="powered" />
            </motion.div>
          </motion.div>

          {/* ── RIGHT: leaderboard panel ── */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.2 }}
          >
            <div className="glass rounded-3xl overflow-hidden">
              {/* Panel header */}
              <div
                className="px-6 py-4 border-b border-champagne/10"
                style={{ background: "rgba(194,24,91,0.08)" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-lg font-bold text-cream">Bengaluru Road Report</h3>
                  <span className="font-inter text-xs text-champagne/45">Route rankings</span>
                </div>
              </div>

              {/* Route rows */}
              <div className="px-4 py-3 flex flex-col gap-1">
                {ROUTE_LEADERBOARD.map(({ routeId, badge }, i) => {
                  const r = ROUTES[routeId];
                  return (
                    <motion.div
                      key={routeId}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.09 }}
                    >
                      <span className="text-2xl w-8 text-center shrink-0">{badge}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-sm font-semibold text-cream">{r.glamName}</p>
                        <p className="font-inter text-xs text-champagne/40 truncate">{r.realName}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBg(r.difficulty)}`}>
                          {r.difficulty === "Survival Mode" ? "💀" : r.difficulty}
                        </span>
                        <div className="text-right w-14">
                          <span className="font-inter text-base font-bold tabular-nums block" style={{ color: roadScoreColor(r.roadScore) }}>
                            {r.roadScore}
                          </span>
                          <span className="font-inter text-xs text-champagne/35 leading-none">/ 100</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Panel footer */}
              <div className="px-6 py-3 border-t border-champagne/10">
                <p className="font-inter text-xs text-champagne/35 leading-snug">
                  Score = road quality index based on pothole density, severity &amp; community reports from Namma Pothole.
                </p>
              </div>
            </div>

            {/* Quick feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🗺️", title: "Real Road Data", desc: "Powered by Namma Pothole reports" },
                { icon: "💄", title: "Glam Score", desc: "Track your makeup through Bengaluru" },
                { icon: "🛍️", title: "Flipkart Deals", desc: "Exclusive beauty discounts on arrival" },
                { icon: "📍", title: "3 Live Routes", desc: "Easy → Medium → Survival Mode" },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  className="glass px-4 py-3 rounded-2xl flex flex-col gap-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.07 }}
                >
                  <span className="text-xl">{f.icon}</span>
                  <p className="font-inter text-xs font-semibold text-cream leading-tight">{f.title}</p>
                  <p className="font-inter text-xs text-champagne/45 leading-tight">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.p
        className="relative z-10 font-inter text-xs text-cream/20 text-center px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Road data powered by Namma Pothole community reports 🗺️ &nbsp;·&nbsp; nammapothole.com
      </motion.p>
    </motion.div>
  );
}

function roadScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#F9A825";
  return "#ef4444";
}
