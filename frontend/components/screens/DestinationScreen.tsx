"use client";

import { motion } from "framer-motion";
import { DESTINATION_CARDS } from "@/lib/routes";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface DestinationScreenProps {
  onSelect: (routeId: string) => void;
}

const ROUTE_GROUPS = [
  {
    label: "Easy",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.2)",
    dotColor: "#16a34a",
    cards: ["mg-road", "whitefield"],
  },
  {
    label: "Medium",
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
    dotColor: "#d97706",
    cards: ["indiranagar", "jpnagar"],
  },
  {
    label: "Survival Mode 💀",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.18)",
    dotColor: "#dc2626",
    cards: ["koramangala", "electronic-city"],
  },
];

export default function DestinationScreen({ onSelect }: DestinationScreenProps) {
  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
      >
        {/* Header */}
        <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-6">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter font-semibold mb-5"
            style={{ background: "rgba(194,24,91,0.1)", border: "1px solid rgba(194,24,91,0.28)", color: "#C2185B" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            ✦ Flipkart Glam Up × Namma Pothole
          </motion.div>
          <motion.h2
            className="font-playfair font-bold leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#1e1b4b" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Where are we slaying today?
          </motion.h2>
          <motion.p
            className="font-inter text-sm sm:text-base mt-2 max-w-lg"
            style={{ color: "#4c4876" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Pick your destination. Your makeup will beg for mercy.
          </motion.p>
        </div>

        {/* Card groups by difficulty */}
        <div className="flex-1 px-6 sm:px-10 lg:px-16 xl:px-24 pb-10 flex flex-col gap-10">
          {ROUTE_GROUPS.map((group, gi) => {
            const groupCards = DESTINATION_CARDS.filter((c) => group.cards.includes(c.id));
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + gi * 0.12 }}
              >
                {/* Difficulty label */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${group.color}50, transparent)` }} />
                  <span
                    className="font-inter text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: group.bg, color: group.color, border: `1px solid ${group.border}` }}
                  >
                    {group.label}
                  </span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${group.color}50)` }} />
                </div>

                {/* Cards — 2-col on tablet+, 3-col on xl+ for scalability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {groupCards.map((card, i) => (
                    <motion.button
                      key={card.id}
                      className="w-full text-left"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + gi * 0.12 + i * 0.06 }}
                      onClick={() => onSelect(card.routeId)}
                    >
                      <motion.div
                        className="glass w-full rounded-2xl overflow-hidden"
                        whileHover={{ scale: 1.015, boxShadow: `0 8px 32px ${group.color}22` }}
                        whileTap={{ scale: 0.975 }}
                        style={{ border: `1px solid ${group.border}` }}
                      >
                        {/* Color accent strip */}
                        <div style={{ height: 3, background: `linear-gradient(90deg, ${group.color}, ${group.color}60)` }} />

                        <div className="px-5 py-5 flex items-center gap-4">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                            style={{ background: group.bg, border: `1px solid ${group.border}` }}
                          >
                            {card.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-playfair text-base font-bold leading-tight" style={{ color: "#1e1b4b" }}>{card.glamName}</p>
                            <p className="font-inter text-xs mt-1" style={{ color: "#8480aa" }}>{card.realName}</p>
                            <p className="font-inter text-xs mt-2 italic leading-snug" style={{ color: "#6366f1" }}>{card.vibe}</p>
                          </div>
                          <span className="font-inter text-lg shrink-0" style={{ color: group.color }}>›</span>
                        </div>
                      </motion.div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            );
          })}

          <motion.div className="flex justify-center pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <AuthenticityBadge variant="powered" />
          </motion.div>
        </div>
      </motion.div>
    </GradientBackground>
  );
}
