"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import { computeGlamScore, getArrivalMessage, getDifficultyBg } from "@/lib/score";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface ArrivalScreenProps {
  route: GlamRoute;
  makeupIntegrity: number;
  onRestart: () => void;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    common: "Maybelline Colossal Kajal",
    binomial: "₹89  ·  42% off",
    photo: {
      url: "https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&auto=format&fit=crop&q=80",
      text: "eye kajal makeup",
      pos: "50% 30%",
      by: "Maybelline · Fan Fave 🔥",
    },
  },
  {
    common: "Lakme 9-to-5 Primer Matte Lip",
    binomial: "₹250  ·  37% off",
    photo: {
      url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      text: "lipstick beauty product",
      pos: "50% 40%",
      by: "Lakme · Trending ✨",
    },
  },
  {
    common: "Makeup Brush Set — Pro",
    binomial: "₹349  ·  45% off",
    photo: {
      url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      text: "professional makeup brushes",
      pos: "50% 50%",
      by: "Nykaa Pro · Bestseller 💄",
    },
  },
  {
    common: "L'Oreal Setting Spray",
    binomial: "₹449  ·  38% off",
    photo: {
      url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      text: "beauty skincare products",
      pos: "50% 35%",
      by: "L'Oreal · Must Have 💦",
    },
  },
  {
    common: "Faces Canada Compact Powder",
    binomial: "₹285  ·  40% off",
    photo: {
      url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      text: "cosmetics makeup flat lay",
      pos: "50% 45%",
      by: "Faces Canada · Top Rated ⭐",
    },
  },
  {
    common: "NYX Butter Gloss",
    binomial: "₹399  ·  43% off",
    photo: {
      url: "https://images.unsplash.com/photo-1631730486784-74757b57f9c3?w=600&auto=format&fit=crop&q=80",
      text: "lipstick gloss beauty",
      pos: "50% 30%",
      by: "NYX Professional · New 🆕",
    },
  },
  {
    common: "Maybelline Fit Me Foundation",
    binomial: "₹329  ·  40% off",
    photo: {
      url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&auto=format&fit=crop&q=80",
      text: "foundation makeup product",
      pos: "50% 35%",
      by: "Maybelline · Bestseller 💎",
    },
  },
];

function getDeals(integrity: number, routeId: string) {
  if (routeId === "survival" || integrity < 50) {
    return {
      headline: "Bengaluru wrecked your look. Flipkart has the rebuild kit.",
      sub: "Emergency glam supplies — because Koramangala owes you.",
      coupon: "GLAMSOS30",
      couponDesc: "30% off on damage-control essentials",
    };
  }
  if (routeId === "brunch" || integrity < 80) {
    return {
      headline: "You survived. Now treat yourself.",
      sub: "Touch-up essentials curated for Bengaluru's bravest brunchers.",
      coupon: "GLAMBRUNCH25",
      couponDesc: "25% off on your next beauty order",
    };
  }
  return {
    headline: "Flawless run. Time to upgrade the kit.",
    sub: "Your roads were kind. Reward yourself with a glam upgrade.",
    coupon: "GLAMQUEEN20",
    couponDesc: "20% off on premium beauty picks",
  };
}

export default function ArrivalScreen({ route, makeupIntegrity, onRestart }: ArrivalScreenProps) {
  const confettiFiredRef = useRef(false);
  const glamScore = computeGlamScore(makeupIntegrity);
  const { headline, sub } = getArrivalMessage(makeupIntegrity);
  const deals = getDeals(makeupIntegrity, route.id);
  const [couponCopied, setCouponCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (confettiFiredRef.current) return;
    confettiFiredRef.current = true;
    import("canvas-confetti").then(({ default: confetti }) => {
      const colors = ["#C2185B", "#FF4081", "#6366f1", "#F9A825", "#ffffff"];
      const end = Date.now() + 3000;
      function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }
      frame();
    });
  }, []);

  function handleShare() {
    const text = `I survived Bengaluru's roads with ${makeupIntegrity}% makeup integrity on "${route.glamName}"! Glam Score: ${glamScore}/100 💄✨ #GlamMaps #FlipkartGlamUp`;
    if (navigator.share) navigator.share({ title: "Glam Maps Score", text }).catch(() => {});
    else navigator.clipboard?.writeText(text).catch(() => {});
  }

  function copyCoupon() {
    navigator.clipboard?.writeText(deals.coupon).catch(() => {});
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  }

  const flipkartUrl = `https://www.flipkart.com/beauty-hygiene/pr?sid=8g8&otracker=categorytree`;

  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10">

          {/* ── Hero ── */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div className="text-6xl sm:text-7xl mb-4" animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>💄</motion.div>
            <h1 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight mb-2" style={{ color: "#1e1b4b" }}>{headline}</h1>
            <p className="font-inter text-sm sm:text-base" style={{ color: "#4c4876" }}>{sub}</p>
          </motion.div>

          {/* ── Main grid: scorecard (left) + deals/coupon (right) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr] gap-8 mb-14">

            {/* ── LEFT: scorecard + road report ── */}
            <div className="flex flex-col gap-5">
              {/* Scorecard */}
              <motion.div
                className="glass rounded-3xl overflow-hidden"
                style={{ border: "1px solid rgba(194,24,91,0.25)", boxShadow: "0 4px 40px rgba(194,24,91,0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #6366f1)", height: 3 }} />
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest mb-1" style={{ color: "#8480aa" }}>Glam Maps Score</p>
                      <p className="font-playfair text-6xl font-bold" style={{ color: "#C2185B" }}>
                        {glamScore}<span className="text-2xl" style={{ color: "#8480aa" }}>/100</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-inter font-semibold px-2 py-1 rounded-full border ${getDifficultyBg(route.difficulty)}`}>{route.difficulty}</span>
                      <p className="font-playfair text-sm font-bold mt-2" style={{ color: "#1e1b4b" }}>{route.emoji} {route.glamName}</p>
                      <p className="font-inter text-xs" style={{ color: "#8480aa" }}>{route.personality}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <ScoreTile label="Makeup" value={`${makeupIntegrity}%`} color={integrityColor(makeupIntegrity)} />
                    <ScoreTile label="Potholes" value={`${route.stats.potholeCount}`} color="#dc2626" />
                    <ScoreTile label="Hazard Zones" value={`${route.stats.hazardZones}`} color="#d97706" />
                  </div>

                  <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "rgba(99,102,241,0.1)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #C2185B, ${integrityColor(makeupIntegrity)})` }} initial={{ width: 0 }} animate={{ width: `${makeupIntegrity}%` }} transition={{ delay: 0.6, duration: 1, ease: "easeOut" }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <AuthenticityBadge text="Namma Pothole × Flipkart" size="sm" />
                    <button onClick={handleShare} className="font-inter text-xs underline transition-colors" style={{ color: "#8480aa" }}>Share →</button>
                  </div>
                </div>
                <div style={{ background: "linear-gradient(90deg, #6366f1, #FF4081, #C2185B)", height: 3 }} />
              </motion.div>

              {/* Road Reality Report */}
              <motion.div className="glass px-5 py-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <button className="w-full flex items-center justify-between" onClick={() => setShowReport(!showReport)}>
                  <h3 className="font-playfair text-sm font-bold" style={{ color: "#1e1b4b" }}>Road Reality Report</h3>
                  <span className="font-inter text-xs" style={{ color: "#8480aa" }}>{showReport ? "▲" : "▼ show"}</span>
                </button>
                <AnimatePresence>
                  {showReport && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                      <div className="pt-3 flex flex-col gap-2">
                        <ReportRow label="Pothole clusters" value={`${route.stats.potholeCount}`} />
                        <ReportRow label="Hazard zones crossed" value={`${route.stats.hazardZones}`} />
                        <ReportRow label="Community reports" value={`${route.stats.communityReports}`} />
                        <div className="pt-2 border-t border-[rgba(99,102,241,0.1)] text-xs font-inter leading-relaxed">
                          <p><span style={{ color: "#dc2626" }}>Worst:</span> <span style={{ color: "#4c4876" }}>{route.stats.worstStretch}</span></p>
                          <p className="mt-0.5"><span style={{ color: "#16a34a" }}>Best:</span> <span style={{ color: "#4c4876" }}>{route.stats.smoothestStretch}</span></p>
                        </div>
                        <a href="https://nammapothole.com" target="_blank" rel="noopener noreferrer" className="font-inter text-xs font-semibold underline" style={{ color: "#6366f1" }}>See full map at nammapothole.com →</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.button
                className="w-full py-3 rounded-2xl font-inter font-semibold text-sm transition-colors"
                style={{ border: "1px solid rgba(99,102,241,0.2)", color: "#8480aa" }}
                onClick={onRestart}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Try another route →
              </motion.button>
            </div>

            {/* ── RIGHT: coupon + shop CTA ── */}
            <div className="flex flex-col gap-5">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-inter text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(217,119,6,0.1)", color: "#d97706", border: "1px solid rgba(217,119,6,0.25)" }}>🛍️ Flipkart Glam Up</span>
                  <span className="font-inter text-xs" style={{ color: "#8480aa" }}>Exclusive deals for Glam Maps users</span>
                </div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#1e1b4b" }}>{deals.headline}</h2>
                <p className="font-inter text-sm" style={{ color: "#4c4876" }}>{deals.sub}</p>
              </motion.div>

              {/* Coupon */}
              <motion.div
                className="flex items-center gap-4 px-6 py-5 rounded-2xl"
                style={{ background: "linear-gradient(90deg, rgba(194,24,91,0.06), rgba(99,102,241,0.08))", border: "1.5px dashed rgba(99,102,241,0.3)" }}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex-1">
                  <p className="font-inter text-xs" style={{ color: "#8480aa" }}>{deals.couponDesc}</p>
                  <p className="font-inter text-3xl font-bold tracking-widest mt-1" style={{ color: "#C2185B" }}>{deals.coupon}</p>
                </div>
                <motion.button
                  className="px-5 py-3 rounded-xl font-inter text-sm font-bold shrink-0"
                  style={{
                    background: couponCopied ? "rgba(22,163,74,0.1)" : "rgba(194,24,91,0.1)",
                    color: couponCopied ? "#16a34a" : "#C2185B",
                    border: `1px solid ${couponCopied ? "rgba(22,163,74,0.3)" : "rgba(194,24,91,0.3)"}`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyCoupon}
                >
                  {couponCopied ? "✓ Copied!" : "Copy"}
                </motion.button>
              </motion.div>

              {/* Big Flipkart CTA */}
              <motion.a
                href={flipkartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 rounded-2xl font-inter font-bold text-lg text-white text-center relative overflow-hidden block"
                style={{ background: "linear-gradient(135deg, #F9A825 0%, #FF4081 50%, #C2185B 100%)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <motion.div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
                🛍️ Shop on Flipkart Glam Up →
              </motion.a>

              <p className="font-inter text-xs text-center" style={{ color: "#8480aa" }}>
                Scroll down to browse new arrivals ↓
              </p>
            </div>
          </div>

          {/* ── Full-width: CircularGallery for New Arrivals ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center mb-6">
              <p className="font-inter text-xs uppercase tracking-widest font-semibold" style={{ color: "#6366f1" }}>✨ New Arrivals on Flipkart Glam Up</p>
              <p className="font-inter text-xs mt-1" style={{ color: "#8480aa" }}>Scroll or watch it rotate · Click any card to shop</p>
            </div>

            <div className="relative w-full" style={{ height: 400 }}>
              <CircularGallery
                items={GALLERY_ITEMS}
                radius={420}
                autoRotateSpeed={0.025}
              />
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div className="flex justify-center mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <AuthenticityBadge variant="powered" />
          </motion.div>
        </div>
      </motion.div>
    </GradientBackground>
  );
}

function ScoreTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center text-center py-3 rounded-xl" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}>
      <span className="font-inter font-bold text-2xl" style={{ color }}>{value}</span>
      <span className="font-inter text-xs leading-tight" style={{ color: "#8480aa" }}>{label}</span>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs font-inter">
      <span style={{ color: "#4c4876" }}>{label}</span>
      <span className="font-bold" style={{ color: "#1e1b4b" }}>{value}</span>
    </div>
  );
}

function integrityColor(pct: number): string {
  if (pct > 70) return "#16a34a";
  if (pct > 40) return "#d97706";
  return "#dc2626";
}
