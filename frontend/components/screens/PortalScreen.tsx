"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface PortalScreenProps {
  onEnter: () => void;
}

const FEATURES = [
  {
    icon: "✨",
    title: "Curated Glam Journeys",
    description: "Themed routes from glow-up paths to survival challenges.",
  },
  {
    icon: "🕳️",
    title: "Real Bengaluru Road Insights",
    description: "Real road data turned into interactive moments.",
  },
  {
    icon: "🎁",
    title: "Rewards at the Finish",
    description: "Unlock exclusive Glam Up rewards and surprises.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function PortalScreen({ onEnter }: PortalScreenProps) {
  return (
    <GradientBackground mapOpacity={0.40}>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Content Section */}
        <div className="flex-1 flex flex-col gap-5 px-5 py-8 justify-center">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-inter font-semibold w-fit"
            style={{
              background: "rgba(194,24,91,0.1)",
              border: "1px solid rgba(194,24,91,0.25)",
              color: "#C2185B",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            ✦ Flipkart Glam Up
          </motion.div>

          <div>
            <p
              className="font-inter text-xs uppercase tracking-widest font-semibold mb-2"
              style={{ color: "#8480aa" }}
            >
              Bengaluru
            </p>
            <h1
              className="font-playfair font-bold leading-[0.95] mb-3"
              style={{
                fontSize: "4.5rem",
                background:
                  "linear-gradient(135deg, #1e1b4b 0%, #C2185B 55%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Glamverse
            </h1>
            <p
              className="font-inter text-base leading-relaxed"
              style={{ color: "#4c4876" }}
            >
              Pick the route. Protect the look.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <motion.button
              className="relative overflow-hidden w-full py-5 rounded-2xl font-inter font-bold text-lg text-white"
              style={{
                background:
                  "linear-gradient(135deg, #C2185B 0%, #FF4081 55%, #6366f1 100%)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnter}
            >
              Enter the Glamverse ✨
            </motion.button>

            <Link
              href="/road-report"
              className="glass w-full py-4 rounded-2xl font-inter font-semibold text-base text-center block"
              style={{ color: "#2f2957" }}
            >
              View Road Report
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-col gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass px-4 py-4 flex items-start gap-3"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <span className="text-2xl leading-none mt-0.5">{f.icon}</span>
                <div>
                  <h3
                    className="font-inter font-bold text-base leading-tight mb-1"
                    style={{ color: "#1e1b4b" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="font-inter text-sm leading-snug"
                    style={{ color: "#4c4876" }}
                  >
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="flex justify-center px-5 pb-6 pt-2">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-inter font-medium"
            style={{ color: "#8480aa" }}
          >
            <Image
              src="/nammapothole-logo.png"
              alt="Namma Pothole"
              width={14}
              height={14}
              className="rounded-sm object-contain"
              style={{ opacity: 0.85 }}
            />
            Powered by Nammapothole
          </span>
        </div>
      </motion.div>
    </GradientBackground>
  );
}
