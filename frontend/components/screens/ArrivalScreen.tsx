"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import { computeGlamScore, getArrivalMessage } from "@/lib/score";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface ArrivalScreenProps {
  route: GlamRoute;
  makeupIntegrity: number;
  onRestart: () => void;
}

function getDeals(integrity: number, routeId: string) {
  if (routeId === "survival" || integrity < 50) {
    return { code: "GLAMSOS30", title: "Touch-Up Pro", copy: "Damage-control essentials." };
  }
  if (routeId === "brunch" || integrity < 80) {
    return { code: "GLAMBRUNCH25", title: "Brunch Rescue", copy: "Touch-up picks for rough roads." };
  }
  return { code: "GLAMQUEEN20", title: "Glow Upgrade", copy: "Premium beauty picks unlocked." };
}

export default function ArrivalScreen({ route, makeupIntegrity, onRestart }: ArrivalScreenProps) {
  const confettiFiredRef = useRef(false);
  const glamScore = computeGlamScore(makeupIntegrity);
  const { headline, sub } = getArrivalMessage(makeupIntegrity);
  const deals = getDeals(makeupIntegrity, route.id);
  const flipkartUrl = "https://www.flipkart.com/beauty-hygiene/pr?sid=8g8&otracker=categorytree";

  useEffect(() => {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 130, spread: 65, origin: { y: 0.65 }, colors: ["#C2185B", "#FF4081", "#F9A825"] });
    });
  }, []);

  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex items-center justify-center px-5 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass-dark w-full rounded-3xl p-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="text-center mb-5">
            <div className="text-4xl mb-2">💄</div>
            <h1 className="font-playfair text-4xl font-bold leading-tight mb-2" style={{ color: "#1e1b4b" }}>
              {headline}
            </h1>
            <p className="font-inter text-sm" style={{ color: "#4c4876" }}>{sub}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatTile label="Glam Score" value={`${glamScore}`} />
            <StatTile label="Integrity" value={`${makeupIntegrity}%`} />
            <StatTile label="Route" value={route.id === "survival" ? "Hard" : route.id === "brunch" ? "Mid" : "Easy"} />
          </div>

          <div
            className="rounded-2xl px-4 py-4 mb-4"
            style={{ border: "1px dashed rgba(194,24,91,0.35)", background: "rgba(194,24,91,0.06)" }}
          >
            <p className="font-inter text-xs font-semibold mb-1" style={{ color: "#C2185B" }}>{deals.title}</p>
            <p className="font-inter text-4xl font-bold tracking-widest leading-none mb-1" style={{ color: "#b01257" }}>{deals.code}</p>
            <p className="font-inter text-sm" style={{ color: "#4c4876" }}>{deals.copy}</p>
          </div>

          <a
            href={flipkartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-2xl text-center font-inter font-bold text-white mb-3"
            style={{ background: "linear-gradient(135deg, #e60073 0%, #ff4081 55%, #ff9933 100%)" }}
          >
            Shop unlocked reward →
          </a>

          <button
            className="w-full py-3.5 rounded-2xl font-inter font-semibold text-base"
            style={{ border: "1px solid rgba(99,102,241,0.2)", color: "#2f2957", background: "rgba(255,255,255,0.55)" }}
            onClick={onRestart}
          >
            Try another route
          </button>
        </motion.div>
      </motion.div>
    </GradientBackground>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-3 py-3 text-center"
      style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}
    >
      <p className="font-inter text-[0.7rem] uppercase tracking-widest mb-1" style={{ color: "#7e77ab" }}>{label}</p>
      <p className="font-inter text-2xl font-bold leading-none" style={{ color: "#C2185B" }}>{value}</p>
    </div>
  );
}
