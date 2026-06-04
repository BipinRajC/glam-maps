"use client";

import { motion } from "framer-motion";
import Sparkles from "@/components/shared/Sparkles";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";

interface PortalScreenProps {
  onEnter: () => void;
  passport: string[];
}

const LEADERBOARD = [
  { rank: 1, name: "Priya_Glam 💅", score: 94, route: "MG Road Strip", badge: "👑" },
  { rank: 2, name: "RoadQueen_B 💋", score: 88, route: "Highlight Avenue", badge: "🥈" },
  { rank: 3, name: "NeonNandini ✨", score: 81, route: "Glam Strip", badge: "🥉" },
];

const HALL_OF_SHAME = [
  { name: "PotholePanic_Rao", score: 12, route: "Koramangala 💀" },
  { name: "FoundationFailed", score: 8, route: "Survival Challenge" },
];

export default function PortalScreen({ onEnter, passport }: PortalScreenProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-between min-h-dvh w-full px-4 py-8 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sparkles />

      {/* Top passport strip */}
      {passport.length > 0 && (
        <motion.div
          className="w-full flex items-center gap-2 justify-center mb-2"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs text-champagne font-inter opacity-70">
            {passport.length} route{passport.length > 1 ? "s" : ""} in your Glam Passport ✨
          </span>
        </motion.div>
      )}

      {/* Hero card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-6">
        <motion.div
          className="relative glass w-full px-6 pt-8 pb-6 flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 16, stiffness: 80, delay: 0.15 }}
        >
          {/* Glitter border effect */}
          <motion.div
            className="absolute inset-0 rounded-[20px] pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(249,168,37,0.12) 0%, transparent 50%, rgba(194,24,91,0.12) 100%)",
              border: "1px solid rgba(249,168,37,0.3)",
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Logo / brand pill */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter font-semibold"
            style={{ background: "rgba(194,24,91,0.2)", border: "1px solid rgba(194,24,91,0.4)", color: "#FF4081" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            ✦ Flipkart Glam Up × Namma Pothole ✦
          </motion.div>

          {/* Mascot silhouette big icon */}
          <motion.div
            className="text-8xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💄
          </motion.div>

          <motion.h1
            className="font-playfair text-4xl font-bold text-cream leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Welcome to the<br />
            <span style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Glamverse
            </span>
          </motion.h1>

          <motion.p
            className="font-inter text-sm text-cream/70 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            Bengaluru&apos;s roads have opinions about your makeup.
            <br />Let&apos;s find out which ones are on your side.
          </motion.p>

          <motion.button
            className="w-full py-4 rounded-2xl font-inter font-bold text-base text-white mt-2 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 50%, #F9A825 100%)" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            Enter the Glamverse ✨
          </motion.button>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          className="w-full glass px-5 py-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-playfair text-sm font-semibold text-cream">
              Bengaluru Glam Leaderboard
            </h3>
            <span className="text-xs text-champagne/60 font-inter">Today</span>
          </div>

          <div className="flex flex-col gap-2">
            {LEADERBOARD.map((entry, i) => (
              <motion.div
                key={entry.rank}
                className="flex items-center gap-3 py-1.5"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.1 }}
              >
                <span className="text-base w-6 text-center">{entry.badge}</span>
                <span className="font-inter text-xs text-cream flex-1">{entry.name}</span>
                <span className="font-inter text-xs text-champagne/60">{entry.route}</span>
                <span
                  className="font-inter text-sm font-bold tabular-nums"
                  style={{ color: "#F9A825" }}
                >
                  {entry.score}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-champagne/10">
            <p className="text-xs text-red-400 font-inter font-semibold mb-1">💀 Hall of Shame</p>
            {HALL_OF_SHAME.map((entry, i) => (
              <div key={i} className="flex items-center gap-2 py-0.5">
                <span className="font-inter text-xs text-cream/50 flex-1">{entry.name}</span>
                <span className="font-inter text-xs text-cream/40">{entry.route}</span>
                <span className="font-inter text-xs font-bold text-red-500">{entry.score}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-4 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <AuthenticityBadge variant="powered" />
        <p className="text-xs text-cream/30 font-inter text-center">
          Road data powered by Namma Pothole community reports 🗺️
        </p>
      </motion.div>
    </motion.div>
  );
}
