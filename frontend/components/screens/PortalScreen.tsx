"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { ROUTES } from "@/lib/routes";
import { getDifficultyBg } from "@/lib/score";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

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
  { value: "3",   label: "Glam routes" },
  { value: "6",   label: "Destinations" },
  { value: "100%", label: "Road-verified" },
];

export default function PortalScreen({ onEnter, passport }: PortalScreenProps) {
  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* ── Main grid: hero (left) + leaderboard (right) ── */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_540px] gap-10 xl:gap-16 items-start">

            {/* ── LEFT: editorial hero ── */}
            <motion.div
              className="flex flex-col gap-8 lg:sticky lg:top-10"
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.1 }}
            >
              {/* Brand pill */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-inter font-semibold w-fit"
                style={{ background: "rgba(194,24,91,0.1)", border: "1px solid rgba(194,24,91,0.3)", color: "#C2185B" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ✦ Flipkart Glam Up × Namma Pothole ✦
              </motion.div>

              {/* Big headline */}
              <div>
                <motion.p
                  className="font-inter text-sm sm:text-base uppercase tracking-widest font-semibold mb-2"
                  style={{ color: "#8480aa" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome to the
                </motion.p>
                <motion.h1
                  className="font-playfair font-bold leading-[0.9] mb-5"
                  style={{
                    fontSize: "clamp(3.5rem, 8vw, 7rem)",
                    background: "linear-gradient(135deg, #1e1b4b 0%, #C2185B 50%, #6366f1 100%)",
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
                  className="font-inter text-base sm:text-lg leading-relaxed max-w-lg"
                  style={{ color: "#4c4876" }}
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
                  style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 50%, #6366f1 100%)" }}
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
                  className="px-6 py-4 rounded-2xl font-inter font-semibold text-base text-center sm:text-left transition-colors"
                  style={{ border: "1px solid rgba(99,102,241,0.25)", color: "#4c4876" }}
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
                    <span className="font-inter font-bold text-xl sm:text-2xl" style={{ color: "#C2185B" }}>{s.value}</span>
                    <span className="font-inter text-xs leading-tight" style={{ color: "#8480aa" }}>{s.label}</span>
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
                  className="px-6 py-5 border-b"
                  style={{ borderColor: "rgba(99,102,241,0.12)", background: "rgba(99,102,241,0.05)" }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-playfair text-xl font-bold" style={{ color: "#1e1b4b" }}>Bengaluru Road Report</h3>
                    <span className="font-inter text-xs" style={{ color: "#8480aa" }}>Route rankings</span>
                  </div>
                </div>

                {/* Route rows */}
                <div className="px-4 py-4 flex flex-col gap-2">
                  {ROUTE_LEADERBOARD.map(({ routeId, badge }, i) => {
                    const r = ROUTES[routeId];
                    return (
                      <motion.div
                        key={routeId}
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl"
                        style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.08)" }}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.09 }}
                      >
                        <span className="text-2xl w-8 text-center shrink-0">{badge}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-sm font-semibold" style={{ color: "#1e1b4b" }}>{r.glamName}</p>
                          <p className="font-inter text-xs truncate" style={{ color: "#8480aa" }}>{r.realName}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBg(r.difficulty)}`}>
                            {r.difficulty === "Survival Mode" ? "💀" : r.difficulty}
                          </span>
                          <div className="text-right w-14">
                            <span className="font-inter text-lg font-bold tabular-nums block" style={{ color: roadScoreColor(r.roadScore) }}>
                              {r.roadScore}
                            </span>
                            <span className="font-inter text-xs leading-none" style={{ color: "#8480aa" }}>/ 100</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Panel footer */}
                <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
                  <p className="font-inter text-xs leading-snug" style={{ color: "#8480aa" }}>
                    Score = road quality index based on pothole density, severity &amp; community reports from Namma Pothole.
                  </p>
                </div>
              </div>

              {/* Quick feature cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🗺️", title: "Real Road Data",   desc: "Powered by Namma Pothole reports" },
                  { icon: "💄", title: "Glam Score",       desc: "Track your makeup through Bengaluru" },
                  { icon: "🛍️", title: "Flipkart Deals",  desc: "Exclusive beauty discounts on arrival" },
                  { icon: "📍", title: "3 Live Routes",    desc: "Easy → Medium → Survival Mode" },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="glass px-5 py-4 rounded-2xl flex flex-col gap-1.5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.07 }}
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <p className="font-inter text-sm font-semibold" style={{ color: "#1e1b4b" }}>{f.title}</p>
                    <p className="font-inter text-xs leading-tight" style={{ color: "#8480aa" }}>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="flex items-center justify-center gap-2 px-6 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="font-inter text-xs" style={{ color: "#8480aa" }}>Road data powered by</span>
          <AuthenticityBadge variant="namma" size="sm" />
          <span className="font-inter text-xs" style={{ color: "#8480aa" }}>· nammapothole.com</span>
        </motion.div>
      </motion.div>
    </GradientBackground>
  );
}

function roadScoreColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}
