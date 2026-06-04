"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import { computeGlamScore, getArrivalMessage, getDifficultyBg } from "@/lib/score";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import Sparkles from "@/components/shared/Sparkles";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";

interface ArrivalScreenProps {
  route: GlamRoute;
  makeupIntegrity: number;
  onRestart: () => void;
}

// Beauty product gallery items for CircularGallery
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
      products: [
        { name: "L'Oreal True Match Foundation", brand: "L'Oreal", price: "₹549", original: "₹899", off: "39% off", emoji: "🧴", tag: "Bestseller", url: "https://www.flipkart.com/search?q=loreal+foundation" },
        { name: "Maybelline Master Conceal", brand: "Maybelline", price: "₹299", original: "₹499", off: "40% off", emoji: "✏️", tag: "Top Rated", url: "https://www.flipkart.com/search?q=maybelline+conceal" },
        { name: "MAC Studio Fix Powder", brand: "MAC", price: "₹1,099", original: "₹1,999", off: "45% off", emoji: "✨", tag: "Premium", url: "https://www.flipkart.com/search?q=mac+studio+fix" },
        { name: "Nykaa Beauty Blender", brand: "Nykaa", price: "₹199", original: "₹350", off: "43% off", emoji: "🟠", tag: "New", url: "https://www.flipkart.com/search?q=beauty+blender" },
      ],
    };
  }
  if (routeId === "brunch" || integrity < 80) {
    return {
      headline: "You survived. Now treat yourself.",
      sub: "Touch-up essentials curated for Bengaluru's bravest brunchers.",
      coupon: "GLAMBRUNCH25",
      couponDesc: "25% off on your next beauty order",
      products: [
        { name: "Maybelline Colossal Kajal", brand: "Maybelline", price: "₹89", original: "₹155", off: "42% off", emoji: "✏️", tag: "Fan Fave", url: "https://www.flipkart.com/search?q=maybelline+kajal" },
        { name: "Nykaa Matte Lipstick Set", brand: "Nykaa", price: "₹219", original: "₹350", off: "37% off", emoji: "💋", tag: "Trending", url: "https://www.flipkart.com/search?q=nykaa+lipstick" },
        { name: "Faces Canada Compact Powder", brand: "Faces", price: "₹285", original: "₹475", off: "40% off", emoji: "🌸", tag: "Top Rated", url: "https://www.flipkart.com/search?q=compact+powder" },
        { name: "Lakme Eyeconic Kajal", brand: "Lakme", price: "₹179", original: "₹299", off: "40% off", emoji: "👁️", tag: "Bestseller", url: "https://www.flipkart.com/search?q=lakme+kajal" },
      ],
    };
  }
  return {
    headline: "Flawless run. Time to upgrade the kit.",
    sub: "Your roads were kind. Reward yourself with a glam upgrade.",
    coupon: "GLAMQUEEN20",
    couponDesc: "20% off on premium beauty picks",
    products: [
      { name: "Lakme 9-to-5 Primer Matte Lip", brand: "Lakme", price: "₹250", original: "₹399", off: "37% off", emoji: "💄", tag: "Trending", url: "https://www.flipkart.com/search?q=lakme+lipstick" },
      { name: "Maybelline Fit Me Foundation", brand: "Maybelline", price: "₹329", original: "₹549", off: "40% off", emoji: "🧴", tag: "Bestseller", url: "https://www.flipkart.com/search?q=maybelline+foundation" },
      { name: "L'Oreal Setting Spray", brand: "L'Oreal", price: "₹449", original: "₹725", off: "38% off", emoji: "💦", tag: "Must Have", url: "https://www.flipkart.com/search?q=setting+spray" },
      { name: "NYX Butter Gloss", brand: "NYX", price: "₹399", original: "₹699", off: "43% off", emoji: "✨", tag: "New", url: "https://www.flipkart.com/search?q=nyx+lip+gloss" },
    ],
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
      const colors = ["#C2185B", "#FF4081", "#F9A825", "#FFF8F0", "#F5E6CA"];
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
    <motion.div
      className="relative w-full min-h-dvh overflow-y-auto"
      style={{ background: "linear-gradient(145deg, #0f0a1e 0%, #1e0d30 40%, #12091e 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Sparkles />

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10">

        {/* ── Hero ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div className="text-6xl sm:text-7xl mb-4" animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>💄</motion.div>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-cream leading-tight mb-2">{headline}</h1>
          <p className="font-inter text-sm sm:text-base text-cream/50">{sub}</p>
        </motion.div>

        {/* ── Main grid: scorecard (left) + deals (right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr] gap-8">

          {/* ── LEFT: scorecard + road report ── */}
          <div className="flex flex-col gap-5">
            {/* Scorecard */}
            <motion.div
              className="rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #2D0F35 0%, #1A1A2E 100%)", border: "1px solid rgba(249,168,37,0.35)", boxShadow: "0 0 40px rgba(194,24,91,0.2)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)", height: 3 }} />
              <div className="px-6 py-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="font-inter text-xs text-champagne/50 uppercase tracking-widest mb-1">Glam Maps Score</p>
                    <p className="font-playfair text-6xl font-bold" style={{ color: "#F9A825" }}>
                      {glamScore}<span className="text-2xl text-champagne/40">/100</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-inter font-semibold px-2 py-1 rounded-full border ${getDifficultyBg(route.difficulty)}`}>{route.difficulty}</span>
                    <p className="font-playfair text-sm font-bold text-cream mt-2">{route.emoji} {route.glamName}</p>
                    <p className="font-inter text-xs text-champagne/45">{route.personality}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <ScoreTile label="Makeup" value={`${makeupIntegrity}%`} color={integrityColor(makeupIntegrity)} />
                  <ScoreTile label="Potholes" value={`${route.stats.potholeCount}`} color="#ef4444" />
                  <ScoreTile label="Hazard Zones" value={`${route.stats.hazardZones}`} color="#f97316" />
                </div>

                <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #C2185B, ${integrityColor(makeupIntegrity)})` }} initial={{ width: 0 }} animate={{ width: `${makeupIntegrity}%` }} transition={{ delay: 0.6, duration: 1, ease: "easeOut" }} />
                </div>

                <div className="flex justify-between items-center">
                  <AuthenticityBadge text="Namma Pothole × Flipkart" size="sm" />
                  <button onClick={handleShare} className="font-inter text-xs text-cream/40 hover:text-cream/70 underline transition-colors">Share →</button>
                </div>
              </div>
              <div style={{ background: "linear-gradient(90deg, #F9A825, #FF4081, #C2185B)", height: 3 }} />
            </motion.div>

            {/* Road Reality Report */}
            <motion.div className="glass px-5 py-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <button className="w-full flex items-center justify-between" onClick={() => setShowReport(!showReport)}>
                <h3 className="font-playfair text-sm font-bold text-cream">Road Reality Report</h3>
                <span className="font-inter text-xs text-champagne/50">{showReport ? "▲" : "▼ show"}</span>
              </button>
              <AnimatePresence>
                {showReport && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                    <div className="pt-3 flex flex-col gap-2">
                      <ReportRow label="Pothole clusters" value={`${route.stats.potholeCount}`} />
                      <ReportRow label="Hazard zones crossed" value={`${route.stats.hazardZones}`} />
                      <ReportRow label="Community reports" value={`${route.stats.communityReports}`} />
                      <div className="pt-2 border-t border-champagne/10 text-xs font-inter leading-relaxed">
                        <p><span className="text-red-400/80">Worst:</span> <span className="text-cream/50">{route.stats.worstStretch}</span></p>
                        <p className="mt-0.5"><span className="text-green-400/80">Best:</span> <span className="text-cream/50">{route.stats.smoothestStretch}</span></p>
                      </div>
                      <a href="https://nammapothole.com" target="_blank" rel="noopener noreferrer" className="font-inter text-xs font-semibold text-electric-pink underline">See full map at nammapothole.com →</a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button
              className="w-full py-3 rounded-2xl font-inter font-semibold text-sm text-cream/45 border border-champagne/12 hover:border-champagne/25 transition-colors"
              onClick={onRestart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Try another route →
            </motion.button>
          </div>

          {/* ── RIGHT: Flipkart deals ── */}
          <div className="flex flex-col gap-5">
            {/* Deals header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-inter text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(249,168,37,0.15)", color: "#F9A825", border: "1px solid rgba(249,168,37,0.3)" }}>🛍️ Flipkart Glam Up</span>
                <span className="font-inter text-xs text-champagne/40">Exclusive deals for Glam Maps users</span>
              </div>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-cream mb-1">{deals.headline}</h2>
              <p className="font-inter text-sm text-cream/50">{deals.sub}</p>
            </motion.div>

            {/* Coupon */}
            <motion.div
              className="flex items-center gap-4 px-5 py-4 rounded-2xl"
              style={{ background: "linear-gradient(90deg, rgba(194,24,91,0.15), rgba(249,168,37,0.12))", border: "1px dashed rgba(249,168,37,0.4)" }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex-1">
                <p className="font-inter text-xs text-champagne/55">{deals.couponDesc}</p>
                <p className="font-inter text-2xl font-bold tracking-widest mt-0.5" style={{ color: "#F9A825" }}>{deals.coupon}</p>
              </div>
              <motion.button
                className="px-4 py-2.5 rounded-xl font-inter text-sm font-bold shrink-0"
                style={{ background: couponCopied ? "rgba(34,197,94,0.2)" : "rgba(249,168,37,0.2)", color: couponCopied ? "#22c55e" : "#F9A825", border: `1px solid ${couponCopied ? "rgba(34,197,94,0.4)" : "rgba(249,168,37,0.4)"}` }}
                whileTap={{ scale: 0.95 }}
                onClick={copyCoupon}
              >
                {couponCopied ? "✓ Copied!" : "Copy"}
              </motion.button>
            </motion.div>

            {/* Product grid — 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {deals.products.map((product, i) => (
                <motion.a
                  key={product.name}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass flex flex-col gap-2 p-3 rounded-2xl cursor-pointer hover:border-rose/30 transition-colors"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-full rounded-xl flex items-center justify-center text-3xl" style={{ height: 72, background: "linear-gradient(135deg, rgba(194,24,91,0.1), rgba(249,168,37,0.08))", border: "1px solid rgba(245,230,202,0.08)" }}>
                    {product.emoji}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs font-inter font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(194,24,91,0.2)", color: "#FF4081", fontSize: "10px" }}>{product.tag}</span>
                    <span className="text-xs font-inter font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: "10px" }}>{product.off}</span>
                  </div>
                  <p className="font-inter text-xs font-semibold text-cream leading-tight">{product.name}</p>
                  <p className="font-inter text-xs text-champagne/35">{product.brand}</p>
                  <div className="flex items-baseline gap-1.5 mt-auto">
                    <span className="font-inter font-bold text-sm text-cream">{product.price}</span>
                    <span className="font-inter text-xs text-cream/30 line-through">{product.original}</span>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Big Flipkart CTA */}
            <motion.a
              href={flipkartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl font-inter font-bold text-base text-white text-center relative overflow-hidden block"
              style={{ background: "linear-gradient(135deg, #F9A825 0%, #FF4081 50%, #C2185B 100%)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
              🛍️ Shop on Flipkart Glam Up →
            </motion.a>
          </div>
        </div>

        {/* ── Full-width: CircularGallery for New Arrivals ── */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="text-center mb-4">
            <p className="font-inter text-xs text-champagne/50 uppercase tracking-widest font-semibold">✨ New Arrivals on Flipkart Glam Up</p>
            <p className="font-inter text-xs text-cream/35 mt-1">Scroll or watch it rotate · Click any card to shop</p>
          </div>

          <div className="relative w-full" style={{ height: 380 }}>
            <CircularGallery
              items={GALLERY_ITEMS}
              radius={420}
              autoRotateSpeed={0.025}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div className="flex flex-col items-center gap-2 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <AuthenticityBadge variant="powered" />
          <p className="font-inter text-xs text-cream/20 text-center">Road data powered by Namma Pothole 🗺️</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ScoreTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center text-center py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
      <span className="font-inter font-bold text-2xl" style={{ color }}>{value}</span>
      <span className="font-inter text-xs text-champagne/45 leading-tight">{label}</span>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs font-inter">
      <span className="text-cream/50">{label}</span>
      <span className="font-bold text-cream">{value}</span>
    </div>
  );
}

function integrityColor(pct: number): string {
  if (pct > 70) return "#22c55e";
  if (pct > 40) return "#F9A825";
  return "#ef4444";
}
