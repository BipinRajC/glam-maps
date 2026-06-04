"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "@/components/shared/Mascot";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface PermissionScreenProps {
  onGrant: () => void;
  onDeny: () => void;
}

export default function PermissionScreen({ onGrant, onDeny }: PermissionScreenProps) {
  const [state, setState] = useState<"idle" | "locating" | "success" | "denied">("idle");

  function handleShare() {
    setState("locating");
    if (!navigator.geolocation) { setState("denied"); setTimeout(onDeny, 1200); return; }
    navigator.geolocation.getCurrentPosition(
      () => { setState("success"); setTimeout(onGrant, 1400); },
      () => { setState("denied"); setTimeout(onDeny, 1200); },
      { timeout: 8000 }
    );
  }

  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col items-center justify-center px-4 py-10"
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -48 }}
        transition={{ type: "spring", damping: 22 }}
      >
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, type: "spring", damping: 14 }}>
            <Mascot size={130} />
          </motion.div>

          <motion.div
            className="glass w-full px-7 py-8 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 16 }}
          >
            <h2 className="font-playfair text-2xl font-bold leading-snug" style={{ color: "#1e1b4b" }}>
              Before we plot your glow route…
            </h2>
            <p className="font-inter text-sm leading-relaxed" style={{ color: "#4c4876" }}>
              I need to know where you&apos;re starting your slay from 📍
            </p>
            <p className="font-inter text-xs leading-relaxed" style={{ color: "#8480aa" }}>
              Your location is used only to mark your starting point. The journey follows a curated Bengaluru route regardless.
            </p>

            <AnimatePresence mode="wait">
              {state === "idle" && (
                <motion.div key="idle" className="w-full flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.button
                    className="w-full py-4 rounded-2xl font-inter font-bold text-base text-white"
                    style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 60%, #F9A825 100%)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleShare}
                  >
                    Share my location 💄
                  </motion.button>
                  <button
                    className="w-full py-2 text-sm font-inter"
                    style={{ color: "#8480aa" }}
                    onClick={onDeny}
                  >
                    Skip for now
                  </button>
                </motion.div>
              )}
              {state === "locating" && (
                <motion.div key="locating" className="flex items-center gap-3 py-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.div className="w-5 h-5 rounded-full border-2" style={{ borderColor: "#FF4081", borderTopColor: "transparent" }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                  <span className="font-inter text-sm" style={{ color: "#4c4876" }}>Finding your glow…</span>
                </motion.div>
              )}
              {state === "success" && (
                <motion.div key="success" className="flex flex-col items-center gap-2 py-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.span className="text-4xl" animate={{ rotate: [0, 20, -10, 0] }} transition={{ duration: 0.6 }}>📍</motion.span>
                  <span className="font-inter text-sm font-semibold" style={{ color: "#16a34a" }}>Location found! Starting your glow route…</span>
                </motion.div>
              )}
              {state === "denied" && (
                <motion.div key="denied" className="py-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="font-inter text-sm" style={{ color: "#4c4876" }}>No worries — we&apos;ll start from MG Road ✨</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <AuthenticityBadge variant="namma" />
          </motion.div>
        </div>
      </motion.div>
    </GradientBackground>
  );
}
