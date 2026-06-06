"use client";

import { motion } from "framer-motion";

interface BrandPillProps {
  text: string;
  tone?: "rose" | "berry";
}

export default function BrandPill({ text, tone = "rose" }: BrandPillProps) {
  const styles =
    tone === "berry"
      ? {
          background: "rgba(131,24,67,0.1)",
          border: "1px solid rgba(131,24,67,0.25)",
          color: "#831843",
        }
      : {
          background: "rgba(194,24,91,0.1)",
          border: "1px solid rgba(194,24,91,0.25)",
          color: "#C2185B",
        };

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-inter font-semibold w-fit"
      style={styles}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {text}
    </motion.div>
  );
}
