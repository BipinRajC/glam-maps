"use client";

import { motion } from "framer-motion";
import Mascot from "@/components/shared/Mascot";
import { DESTINATION_CARDS, type Difficulty } from "@/lib/routes";
import { getDifficultyBg } from "@/lib/score";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";

interface DestinationScreenProps {
  onSelect: (routeId: string) => void;
}

export default function DestinationScreen({ onSelect }: DestinationScreenProps) {
  return (
    <motion.div
      className="relative flex flex-col min-h-dvh w-full overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {/* Header with mascot */}
      <div className="flex flex-col items-center gap-1 pt-10 pb-4 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", damping: 14 }}
        >
          <Mascot size={90} />
        </motion.div>

        <motion.h2
          className="font-playfair text-2xl font-bold text-cream text-center mt-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Where are we slaying today?
        </motion.h2>

        <motion.p
          className="font-inter text-sm text-cream/60 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          Pick your destination. Your makeup will beg for mercy.
        </motion.p>
      </div>

      {/* Bottom sheet of cards — scrollable */}
      <motion.div
        className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col gap-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", damping: 18 }}
      >
        {DESTINATION_CARDS.map((card, i) => (
          <DestinationCard
            key={card.id}
            card={card}
            index={i}
            onSelect={onSelect}
          />
        ))}

        <div className="mt-2 flex justify-center">
          <AuthenticityBadge variant="powered" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function DestinationCard({
  card,
  index,
  onSelect,
}: {
  card: typeof DESTINATION_CARDS[0];
  index: number;
  onSelect: (routeId: string) => void;
}) {
  return (
    <motion.button
      className="w-full text-left"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 + index * 0.07, type: "spring", damping: 20 }}
      onClick={() => onSelect(card.routeId)}
    >
      <motion.div
        className="glass w-full px-4 py-4 flex items-center gap-4"
        whileHover={{ scale: 1.02, borderColor: "rgba(255,64,129,0.5)" }}
        whileTap={{ scale: 0.98 }}
        style={{ border: "1px solid rgba(245,230,202,0.15)" }}
      >
        {/* Emoji + difficulty indicator */}
        <div className="flex flex-col items-center gap-1 min-w-[44px]">
          <span className="text-3xl">{card.emoji}</span>
          <DifficultyDot difficulty={card.difficulty} />
        </div>

        {/* Text content */}
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="flex items-start gap-2">
            <h3 className="font-playfair text-base font-bold text-cream leading-tight flex-1">
              {card.glamName}
            </h3>
          </div>
          <p className="font-inter text-xs text-champagne/60">{card.realName}</p>
          <p className="font-inter text-xs text-cream/60 mt-1 italic">{card.vibe}</p>
        </div>

        {/* Difficulty badge */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBg(card.difficulty)}`}
          >
            {card.difficulty}
          </span>
          <span className="text-cream/40 text-base">›</span>
        </div>
      </motion.div>
    </motion.button>
  );
}

function DifficultyDot({ difficulty }: { difficulty: Difficulty }) {
  const color =
    difficulty === "Easy" ? "#22c55e" :
    difficulty === "Medium" ? "#F9A825" : "#ef4444";
  return (
    <div
      className="w-2.5 h-2.5 rounded-full"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}
