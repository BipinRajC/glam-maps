"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "@/components/shared/Mascot";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";

interface PermissionScreenProps {
  onGrant: () => void;
  onDeny: () => void;
}

export default function PermissionScreen({ onGrant, onDeny }: PermissionScreenProps) {
  const [state, setState] = useState<"idle" | "locating" | "success" | "denied">("idle");

  function handleShare() {
    setState("locating");
    if (!navigator.geolocation) {
      setState("denied");
      setTimeout(onDeny, 1200);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setState("success");
        setTimeout(onGrant, 1400);
      },
      () => {
        setState("denied");
        setTimeout(onDeny, 1200);
      },
      { timeout: 8000 }
    );
  }

  function handleSkip() {
    onDeny();
  }

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-dvh w-full px-4 py-8"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        {/* Mascot debut */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 14 }}
        >
          <Mascot size={140} />
        </motion.div>

        {/* Card */}
        <motion.div
          className="glass w-full px-6 py-7 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", damping: 16 }}
        >
          <motion.p
            className="font-playfair text-2xl font-bold text-cream leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Before we plot your glow route…
          </motion.p>

          <motion.p
            className="font-inter text-sm text-cream/70 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            I need to know where you&apos;re starting your slay from 📍
          </motion.p>

          <motion.p
            className="font-inter text-xs text-champagne/50 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            Your location is used only to mark your starting point on the map.
            The actual journey follows a curated Bengaluru route.
          </motion.p>

          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="idle"
                className="w-full flex flex-col gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  className="w-full py-4 rounded-2xl font-inter font-bold text-base text-white"
                  style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 60%, #F9A825 100%)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                >
                  Share my location 💄
                </motion.button>
                <button
                  className="w-full py-2.5 text-sm text-cream/40 font-inter underline"
                  onClick={handleSkip}
                >
                  Skip for now
                </button>
              </motion.div>
            )}

            {state === "locating" && (
              <motion.div
                key="locating"
                className="flex items-center gap-3 py-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full border-2 border-electric-pink border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                <span className="font-inter text-sm text-cream/70">Finding your glow…</span>
              </motion.div>
            )}

            {state === "success" && (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-2 py-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, 20, -10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  📍
                </motion.span>
                <span className="font-inter text-sm text-green-400 font-semibold">
                  Location found! Starting your glow route…
                </span>
              </motion.div>
            )}

            {state === "denied" && (
              <motion.div
                key="denied"
                className="flex flex-col items-center gap-2 py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="font-inter text-sm text-cream/60">
                  No worries — we&apos;ll start from MG Road ✨
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <AuthenticityBadge variant="namma" />
        </motion.div>
      </div>
    </motion.div>
  );
}
