"use client";

import { motion } from "framer-motion";

const SPARKS = [
  { x: "5%", y: "8%", delay: 0, size: 10 },
  { x: "90%", y: "12%", delay: 0.4, size: 8 },
  { x: "3%", y: "85%", delay: 0.8, size: 12 },
  { x: "92%", y: "80%", delay: 0.2, size: 9 },
  { x: "50%", y: "3%", delay: 0.6, size: 7 },
  { x: "15%", y: "50%", delay: 1.0, size: 8 },
  { x: "82%", y: "45%", delay: 0.3, size: 10 },
  { x: "30%", y: "95%", delay: 0.9, size: 7 },
  { x: "70%", y: "92%", delay: 0.5, size: 9 },
];

export default function Sparkles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {SPARKS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: s.x, top: s.y }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 10 10">
            <path
              d="M5 0 L5.8 3.8 L9.5 5 L5.8 6.2 L5 10 L4.2 6.2 L0.5 5 L4.2 3.8Z"
              fill="#F9A825"
              opacity="0.85"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
