"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { loadPassport } from "@/lib/passport";
import { ROUTES } from "@/lib/routes";
import { getDifficultyBg, computeGlamScore } from "@/lib/score";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

export default function PassportPage() {
  const [passport, setPassport] = useState<string[]>([]);

  useEffect(() => {
    setPassport(loadPassport());
  }, []);

  const completedRoutes = passport.map((id) => ROUTES[id]).filter(Boolean);
  const uncompletedRoutes = Object.values(ROUTES).filter((r) => !passport.includes(r.id));
  const totalRoutes = Object.keys(ROUTES).length;

  return (
    <GradientBackground>
      <div className="relative w-full min-h-dvh">
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 py-10 flex flex-col gap-8">

          {/* Header */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/"
              className="w-10 h-10 rounded-full flex items-center justify-center font-inter text-lg transition-colors"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", color: "#4c4876" }}
            >
              ‹
            </Link>
            <div>
              <h1 className="font-playfair text-3xl font-bold" style={{ color: "#1e1b4b" }}>Glam Passport</h1>
              <p className="font-inter text-sm" style={{ color: "#8480aa" }}>
                {completedRoutes.length} of {totalRoutes} routes explored
              </p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="glass px-6 py-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex justify-between text-xs font-inter mb-3">
              <span style={{ color: "#4c4876" }}>Routes collected</span>
              <span className="font-bold" style={{ color: "#1e1b4b" }}>{completedRoutes.length}/{totalRoutes}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(99,102,241,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #6366f1)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedRoutes.length / totalRoutes) * 100}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Completed routes */}
          {completedRoutes.length > 0 ? (
            <div>
              <p className="font-inter text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6366f1" }}>Completed</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {completedRoutes.map((route, i) => (
                  <motion.div
                    key={route.id}
                    className="glass rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                  >
                    <div style={{ height: 3, background: "linear-gradient(90deg, #C2185B, #6366f1)" }} />
                    <div className="px-5 py-5">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-3xl">{route.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-playfair text-base font-bold leading-tight" style={{ color: "#1e1b4b" }}>{route.glamName}</p>
                          <p className="font-inter text-xs mt-0.5" style={{ color: "#8480aa" }}>{route.realName}</p>
                        </div>
                        <span className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getDifficultyBg(route.difficulty)}`}>
                          {route.difficulty}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <PassportStat label="Road Score" value={`${route.roadScore}/100`} color={roadScoreColor(route.roadScore)} />
                        <PassportStat label="Potholes" value={`${route.stats.potholeCount}`} color="#dc2626" />
                        <PassportStat label="Glam Score" value={`${computeGlamScore(route.integrityEnd)}`} color="#C2185B" />
                      </div>

                      <div className="text-xs font-inter leading-relaxed border-t pt-3" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
                        <p><span style={{ color: "#dc2626" }}>Worst:</span> <span style={{ color: "#4c4876" }}>{route.stats.worstStretch}</span></p>
                        <p className="mt-0.5"><span style={{ color: "#16a34a" }}>Best:</span> <span style={{ color: "#4c4876" }}>{route.stats.smoothestStretch}</span></p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              className="glass px-8 py-14 text-center flex flex-col items-center gap-4 rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-6xl">🗺️</span>
              <p className="font-playfair text-2xl font-bold" style={{ color: "#1e1b4b" }}>No routes yet</p>
              <p className="font-inter text-sm" style={{ color: "#4c4876" }}>Complete a Glam Journey to earn your first passport stamp.</p>
              <Link
                href="/"
                className="mt-2 px-6 py-3.5 rounded-2xl font-inter font-semibold text-sm text-white"
                style={{ background: "linear-gradient(135deg, #C2185B, #FF4081)" }}
              >
                Start a Journey →
              </Link>
            </motion.div>
          )}

          {/* Uncompleted routes */}
          {uncompletedRoutes.length > 0 && (
            <div>
              <p className="font-inter text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8480aa" }}>Not yet explored</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {uncompletedRoutes.map((route, i) => (
                  <motion.div
                    key={route.id}
                    className="glass rounded-2xl px-5 py-4 flex items-center gap-3"
                    style={{ opacity: 0.55 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                  >
                    <span className="text-2xl grayscale">{route.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-sm font-bold" style={{ color: "#1e1b4b" }}>{route.glamName}</p>
                      <p className="font-inter text-xs" style={{ color: "#8480aa" }}>{route.realName}</p>
                    </div>
                    <span className="font-inter text-sm" style={{ color: "#8480aa" }}>🔒</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <motion.div
            className="flex flex-col items-center gap-2 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <AuthenticityBadge variant="namma" />
            <p className="font-inter text-xs text-center" style={{ color: "#8480aa" }}>Road data powered by Namma Pothole · nammapothole.com</p>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
}

function PassportStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center text-center py-2.5 rounded-xl"
      style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}
    >
      <span className="font-inter text-sm font-bold" style={{ color }}>{value}</span>
      <span className="font-inter text-xs leading-tight" style={{ color: "#8480aa" }}>{label}</span>
    </div>
  );
}

function roadScoreColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}
