"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { loadPassport } from "@/lib/passport";
import { ROUTES } from "@/lib/routes";
import { getDifficultyBg, computeGlamScore } from "@/lib/score";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import Sparkles from "@/components/shared/Sparkles";

export default function PassportPage() {
  const [passport, setPassport] = useState<string[]>([]);

  useEffect(() => {
    setPassport(loadPassport());
  }, []);

  const completedRoutes = passport.map((id) => ROUTES[id]).filter(Boolean);
  const totalRoutes = Object.keys(ROUTES).length;

  return (
    <div
      className="relative min-h-dvh w-full flex justify-center"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
    >
      <Sparkles />

      <div className="relative z-10 w-full max-w-[430px] px-4 py-8 flex flex-col gap-5">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center font-inter text-cream/60 hover:text-cream transition-colors"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,230,202,0.15)" }}
          >
            ‹
          </Link>
          <div>
            <h1 className="font-playfair text-2xl font-bold text-cream">Glam Passport</h1>
            <p className="font-inter text-xs text-champagne/50">
              {completedRoutes.length} of {totalRoutes} routes explored
            </p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="glass px-4 py-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex justify-between text-xs font-inter mb-2">
            <span className="text-cream/60">Routes collected</span>
            <span className="font-bold text-cream">{completedRoutes.length}/{totalRoutes}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)" }}
              initial={{ width: 0 }}
              animate={{ width: `${(completedRoutes.length / totalRoutes) * 100}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Completed routes */}
        {completedRoutes.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="font-inter text-xs text-champagne/50 font-semibold uppercase tracking-widest">Completed</p>
            {completedRoutes.map((route, i) => (
              <motion.div
                key={route.id}
                className="glass px-4 py-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{route.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair text-base font-bold text-cream leading-tight">{route.glamName}</p>
                    <p className="font-inter text-xs text-champagne/50">{route.realName}</p>
                  </div>
                  <span className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getDifficultyBg(route.difficulty)}`}>
                    {route.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <PassportStat label="Road Score" value={`${route.roadScore}/100`} color={roadScoreColor(route.roadScore)} />
                  <PassportStat label="Potholes" value={`${route.stats.potholeCount}`} color="#ef4444" />
                  <PassportStat label="Glam Score" value={`${computeGlamScore(route.integrityEnd)}`} color="#F9A825" />
                </div>

                <div className="text-xs font-inter text-cream/40 leading-relaxed border-t border-champagne/10 pt-2">
                  <p><span className="text-red-400/70">Worst:</span> {route.stats.worstStretch}</p>
                  <p className="mt-0.5"><span className="text-green-400/70">Best:</span> {route.stats.smoothestStretch}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="glass px-6 py-10 text-center flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-5xl">🗺️</span>
            <p className="font-playfair text-xl font-bold text-cream">No routes yet</p>
            <p className="font-inter text-sm text-cream/50">Complete a Glam Journey to earn your first passport stamp.</p>
            <Link
              href="/"
              className="mt-2 px-5 py-3 rounded-2xl font-inter font-semibold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #C2185B, #FF4081)" }}
            >
              Start a Journey →
            </Link>
          </motion.div>
        )}

        {/* Uncompleted routes */}
        {Object.values(ROUTES).filter((r) => !passport.includes(r.id)).length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="font-inter text-xs text-champagne/50 font-semibold uppercase tracking-widest">Not yet explored</p>
            {Object.values(ROUTES)
              .filter((r) => !passport.includes(r.id))
              .map((route, i) => (
                <motion.div
                  key={route.id}
                  className="glass px-4 py-3.5 flex items-center gap-3 opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                >
                  <span className="text-2xl grayscale">{route.emoji}</span>
                  <div className="flex-1">
                    <p className="font-playfair text-sm font-bold text-cream">{route.glamName}</p>
                    <p className="font-inter text-xs text-champagne/50">{route.realName}</p>
                  </div>
                  <span className="font-inter text-xs text-cream/30">🔒</span>
                </motion.div>
              ))}
          </div>
        )}

        <motion.div
          className="flex flex-col items-center gap-2 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AuthenticityBadge variant="namma" />
          <p className="font-inter text-xs text-cream/25 text-center">Road data powered by Namma Pothole 🗺️</p>
        </motion.div>
      </div>
    </div>
  );
}

function PassportStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center text-center py-2 rounded-xl"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <span className="font-inter text-sm font-bold" style={{ color }}>{value}</span>
      <span className="font-inter text-xs text-champagne/45 leading-tight">{label}</span>
    </div>
  );
}

function roadScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#F9A825";
  return "#ef4444";
}
