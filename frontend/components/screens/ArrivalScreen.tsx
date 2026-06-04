"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import { computeGlamScore, getArrivalMessage, getDifficultyBg } from "@/lib/score";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import Sparkles from "@/components/shared/Sparkles";
import Mascot from "@/components/shared/Mascot";

interface ArrivalScreenProps {
  route: GlamRoute;
  makeupIntegrity: number;
  onRestart: () => void;
}

const FLIPKART_DEALS = [
  { name: "Maybelline Colossal Kajal", discount: "42% off", price: "₹89", original: "₹155", emoji: "✏️" },
  { name: "Lakme 9-to-5 Lipstick", discount: "35% off", price: "₹259", original: "₹399", emoji: "💄" },
  { name: "L'Oreal Setting Spray", discount: "38% off", price: "₹449", original: "₹725", emoji: "💦" },
];

export default function ArrivalScreen({ route, makeupIntegrity, onRestart }: ArrivalScreenProps) {
  const confettiFiredRef = useRef(false);
  const glamScore = computeGlamScore(makeupIntegrity);
  const { headline, sub } = getArrivalMessage(makeupIntegrity);

  useEffect(() => {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;

    import("canvas-confetti").then(({ default: confetti }) => {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#C2185B", "#FF4081", "#F9A825", "#FFF8F0", "#F5E6CA"];

      function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      }
      frame();
    });
  }, []);

  function handleShare() {
    const text = `I just survived Bengaluru's roads with ${makeupIntegrity}% makeup integrity on ${route.glamName}! Glam Score: ${glamScore}/100 💄✨ #GlamMaps #FlipkartGlamUp`;
    if (navigator.share) {
      navigator.share({ title: "Glam Maps Score", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
      alert("Score copied! Share it anywhere 💄");
    }
  }

  return (
    <motion.div
      className="relative flex flex-col min-h-dvh w-full overflow-y-auto"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sparkles />

      <div className="flex flex-col items-center gap-5 px-4 pt-8 pb-10 max-w-sm mx-auto w-full">
        {/* Mascot celebration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 12 }}
        >
          <Mascot size={110} />
        </motion.div>

        {/* Headline */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="font-playfair text-2xl font-bold text-cream leading-snug mb-1">{headline}</p>
          <p className="font-inter text-sm text-cream/60">{sub}</p>
        </motion.div>

        {/* SCORECARD — hero artifact */}
        <motion.div
          className="w-full rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #2D0F35 0%, #1A1A2E 50%, #2D1535 100%)",
            border: "1px solid rgba(249,168,37,0.4)",
            boxShadow: "0 0 40px rgba(194,24,91,0.25), 0 0 80px rgba(249,168,37,0.08)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 14 }}
        >
          {/* Gold shimmer top bar */}
          <div style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825, #FF4081, #C2185B)", height: 3 }} />

          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-inter text-xs text-champagne/50 uppercase tracking-widest font-semibold">Glam Maps Score</p>
                <p className="font-playfair text-5xl font-bold" style={{ color: "#F9A825" }}>
                  {glamScore}
                  <span className="text-xl text-champagne/50">/100</span>
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-inter font-semibold px-2 py-1 rounded-full border ${getDifficultyBg(route.difficulty)}`}>
                  {route.difficulty}
                </span>
                <p className="font-playfair text-sm text-cream font-bold mt-2">{route.emoji} {route.glamName}</p>
                <p className="font-inter text-xs text-champagne/50">{route.personality}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <ScoreMetric label="Makeup Integrity" value={`${makeupIntegrity}%`} color={integrityColor(makeupIntegrity)} />
              <ScoreMetric label="Potholes Survived" value={`${route.stats.potholeCount}`} color="#FF4081" />
              <ScoreMetric label="Hazard Zones" value={`${route.stats.hazardZones}`} color="#f97316" />
            </div>

            {/* Integrity bar */}
            <div>
              <div className="flex justify-between text-xs font-inter mb-1">
                <span className="text-cream/50">Makeup Integrity</span>
                <span style={{ color: integrityColor(makeupIntegrity) }}>{makeupIntegrity}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #C2185B, ${integrityColor(makeupIntegrity)})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${makeupIntegrity}%` }}
                  transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <AuthenticityBadge text="Powered by Namma Pothole · Flipkart Glam Up" />
            </div>
          </div>

          {/* Gold shimmer bottom bar */}
          <div style={{ background: "linear-gradient(90deg, #F9A825, #FF4081, #C2185B, #FF4081, #F9A825)", height: 3 }} />
        </motion.div>

        {/* Road Reality Report */}
        <motion.div
          className="glass w-full px-5 py-4 flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-playfair text-base font-bold text-cream">Road Reality Report</h3>
          <p className="font-inter text-xs text-champagne/60">Your route, by the numbers:</p>

          <div className="flex flex-col gap-2">
            <RealityRow label="Total pothole clusters" value={`${route.stats.potholeCount}`} />
            <RealityRow label="Hazard zones crossed" value={`${route.stats.hazardZones}`} />
            <RealityRow label="Community reports on this route" value={`${route.stats.communityReports}`} />
            <div className="border-t border-champagne/10 pt-2">
              <p className="font-inter text-xs text-red-400/80 font-semibold">Worst stretch:</p>
              <p className="font-inter text-xs text-cream/60">{route.stats.worstStretch}</p>
            </div>
            <div>
              <p className="font-inter text-xs text-green-400/80 font-semibold">Smoothest stretch:</p>
              <p className="font-inter text-xs text-cream/60">{route.stats.smoothestStretch}</p>
            </div>
          </div>

          <div className="border-t border-champagne/10 pt-2 flex flex-col gap-1">
            <p className="font-inter text-xs text-champagne/40">
              Based on Namma Pothole community reports — last updated today
            </p>
            <a
              href="https://nammapothole.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-xs font-semibold text-electric-pink underline"
            >
              See the full map at nammapothole.com →
            </a>
          </div>
        </motion.div>

        {/* Flipkart deals */}
        <motion.div
          className="glass w-full px-5 py-4 flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🛍️</span>
            <h3 className="font-playfair text-base font-bold text-cream">
              {makeupIntegrity < 50 ? "Bengaluru broke your look. Flipkart will fix it." : "Refresh your glam kit."}
            </h3>
          </div>
          <p className="font-inter text-xs text-champagne/50">Exclusive deals on Flipkart Glam Up:</p>

          <div className="flex flex-col gap-2">
            {FLIPKART_DEALS.map((deal, i) => (
              <motion.div
                key={deal.name}
                className="flex items-center gap-3 py-2 px-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
              >
                <span className="text-2xl">{deal.emoji}</span>
                <div className="flex-1">
                  <p className="font-inter text-xs text-cream font-semibold">{deal.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-inter text-sm font-bold text-cream">{deal.price}</span>
                    <span className="font-inter text-xs text-cream/40 line-through">{deal.original}</span>
                  </div>
                </div>
                <span
                  className="text-xs font-inter font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(249,168,37,0.2)", color: "#F9A825", border: "1px solid rgba(249,168,37,0.3)" }}
                >
                  {deal.discount}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="w-full flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <button
            className="w-full py-4 rounded-2xl font-inter font-bold text-base text-white"
            style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 60%, #F9A825 100%)" }}
            onClick={handleShare}
          >
            Share my Glam Score 📤
          </button>
          <button
            className="w-full py-3 rounded-2xl font-inter font-semibold text-sm text-cream/60 border border-champagne/20"
            onClick={onRestart}
          >
            Try another route →
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
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

function ScoreMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-0.5 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
      <span className="font-inter font-bold text-xl" style={{ color }}>{value}</span>
      <span className="font-inter text-xs text-champagne/50 leading-tight">{label}</span>
    </div>
  );
}

function RealityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-inter text-xs text-cream/60">{label}</span>
      <span className="font-inter text-xs font-bold text-cream">{value}</span>
    </div>
  );
}

function integrityColor(pct: number): string {
  if (pct > 70) return "#22c55e";
  if (pct > 40) return "#F9A825";
  return "#ef4444";
}
