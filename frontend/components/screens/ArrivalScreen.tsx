"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import { computeGlamScore, getArrivalMessage } from "@/lib/score";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface ArrivalScreenProps {
  route: GlamRoute;
  makeupIntegrity: number;
  onRestart: () => void;
}

type Step = "arrival" | "selfie-capture" | "selfie-preview" | "share";

function getDeals(integrity: number, routeId: string) {
  if (routeId === "survival" || routeId === "ecity" || routeId === "yelahanka" || routeId === "mysore_road" || routeId === "bommanahalli" || routeId === "kr_puram" || integrity < 50) {
    return { code: "GLAMSOS30", title: "Touch-Up Pro", copy: "Damage-control essentials." };
  }
  if (integrity < 80) {
    return { code: "GLAMBRUNCH25", title: "Brunch Rescue", copy: "Touch-up picks for rough roads." };
  }
  return { code: "GLAMQUEEN20", title: "Glow Upgrade", copy: "Premium beauty picks unlocked." };
}

const HASHTAGS = ["#GlamMaps", "#FlipkartGlamUp", "#NammaPothole", "#BengaluruRoads", "#MakeupSurvival"];

export default function ArrivalScreen({ route, makeupIntegrity, onRestart }: ArrivalScreenProps) {
  const confettiFiredRef = useRef(false);
  const [step, setStep] = useState<Step>("arrival");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(["#GlamMaps"]);

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

  useEffect(() => {
    setCaption(`Survived ${route.glamName} with ${makeupIntegrity}% makeup integrity! 💄✨`);
  }, [route.glamName, makeupIntegrity]);

  const startSelfieCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" }, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStep("selfie-capture");
    } catch {
      setStep("share");
    }
  }, []);

  const captureSelfie = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/png");
    setSelfieDataUrl(dataUrl);
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setStep("selfie-preview");
  }, [cameraStream]);

  const retakeSelfie = useCallback(() => {
    setSelfieDataUrl(null);
    startSelfieCamera();
  }, [startSelfieCamera]);

  const skipToShare = useCallback(() => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setStep("share");
  }, [cameraStream]);

  const toggleHashtag = useCallback((tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleShare = useCallback(async () => {
    const fullCaption = `${caption} ${selectedHashtags.join(" ")}`;

    if (selfieDataUrl && navigator.share) {
      try {
        const blob = await (await fetch(selfieDataUrl)).blob();
        const file = new File([blob], "glam-maps-selfie.png", { type: "image/png" });
        await navigator.share({
          text: fullCaption,
          files: [file],
        });
        return;
      } catch {}
    }

    if (navigator.share && !selfieDataUrl) {
      try {
        await navigator.share({ text: fullCaption });
        return;
      } catch {}
    }

    if (selfieDataUrl) {
      const link = document.createElement("a");
      link.href = selfieDataUrl;
      link.download = "glam-maps-selfie.png";
      link.click();
    }

    try {
      await navigator.clipboard.writeText(fullCaption);
    } catch {}
  }, [caption, selectedHashtags, selfieDataUrl]);

  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex items-center justify-center px-5 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          {step === "arrival" && (
            <motion.div
              key="arrival"
              className="glass-dark w-full rounded-3xl p-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="text-center mb-5">
                <div className="text-4xl mb-2">💄</div>
                <h1 className="font-playfair text-3xl font-bold leading-tight mb-2" style={{ color: "#1e1b4b" }}>
                  {headline}
                </h1>
                <p className="font-inter text-sm" style={{ color: "#4c4876" }}>{sub}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <StatTile label="Glam Score" value={`${glamScore}`} />
                <StatTile label="Integrity" value={`${makeupIntegrity}%`} />
                <StatTile label="Route" value={route.difficulty === "Survival Mode" ? "Hard" : route.difficulty === "Medium" ? "Mid" : "Easy"} />
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

              <motion.button
                className="w-full py-3.5 rounded-2xl font-inter font-semibold text-base mb-2"
                style={{ background: "linear-gradient(135deg, #C2185B, #FF4081)", color: "white" }}
                whileTap={{ scale: 0.98 }}
                onClick={startSelfieCamera}
              >
                Capture the moment 📸
              </motion.button>

              <button
                className="w-full py-3 rounded-2xl font-inter font-semibold text-base"
                style={{ border: "1px solid rgba(99,102,241,0.2)", color: "#2f2957", background: "rgba(255,255,255,0.55)" }}
                onClick={() => setStep("share")}
              >
                Skip selfie
              </button>

              <button
                className="w-full py-3 mt-2 rounded-2xl font-inter font-semibold text-sm"
                style={{ color: "#8480aa" }}
                onClick={onRestart}
              >
                Try another route
              </button>
            </motion.div>
          )}

          {step === "selfie-capture" && (
            <motion.div
              key="selfie-capture"
              className="fixed inset-0 z-50 bg-black flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                muted
                autoPlay
                playsInline
              />

              <div className="absolute inset-0 pointer-events-none" style={{ border: "8px solid rgba(194,24,91,0.4)", borderRadius: 24 }} />

              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <button
                  className="glass-dark px-4 py-2 rounded-xl font-inter text-sm font-semibold text-cream"
                  onClick={skipToShare}
                >
                  Skip
                </button>
                <span className="glass-dark px-3 py-1.5 rounded-xl font-inter text-xs text-cream/70">📸 Glam Frame</span>
              </div>

              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                <motion.button
                  className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
                  style={{ background: "rgba(194,24,91,0.6)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={captureSelfie}
                >
                  <div className="w-14 h-14 rounded-full bg-white/90" />
                </motion.button>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          )}

          {step === "selfie-preview" && (
            <motion.div
              key="selfie-preview"
              className="glass-dark w-full rounded-3xl p-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <h3 className="font-playfair text-xl font-bold mb-4 text-center" style={{ color: "#1e1b4b" }}>
                How gorgeous! ✨
              </h3>
              {selfieDataUrl && (
                <div className="rounded-2xl overflow-hidden mb-4" style={{ border: "3px solid rgba(194,24,91,0.3)" }}>
                  <img src={selfieDataUrl} alt="Selfie" className="w-full" />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3.5 rounded-2xl font-inter font-semibold text-base"
                  style={{ border: "1px solid rgba(99,102,241,0.2)", color: "#2f2957", background: "rgba(255,255,255,0.55)" }}
                  onClick={retakeSelfie}
                >
                  Retake
                </button>
                <motion.button
                  className="flex-1 py-3.5 rounded-2xl font-inter font-bold text-base text-white"
                  style={{ background: "linear-gradient(135deg, #C2185B, #FF4081)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("share")}
                >
                  Share ✨
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === "share" && (
            <motion.div
              key="share"
              className="glass-dark w-full rounded-3xl p-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <h3 className="font-playfair text-xl font-bold mb-4 text-center" style={{ color: "#1e1b4b" }}>
                Share your glam survival 📤
              </h3>

              {selfieDataUrl && (
                <div className="rounded-2xl overflow-hidden mb-4" style={{ border: "3px solid rgba(194,24,91,0.3)" }}>
                  <img src={selfieDataUrl} alt="Selfie" className="w-full" />
                </div>
              )}

              <textarea
                className="w-full px-4 py-3 rounded-2xl font-inter text-sm mb-3 resize-none"
                style={{ border: "1px solid rgba(99,102,241,0.2)", color: "#1e1b4b", background: "rgba(255,255,255,0.6)", minHeight: 80 }}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              <div className="flex flex-wrap gap-2 mb-4">
                {HASHTAGS.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 rounded-full font-inter text-xs font-semibold"
                    style={{
                      background: selectedHashtags.includes(tag) ? "rgba(194,24,91,0.15)" : "rgba(99,102,241,0.06)",
                      border: selectedHashtags.includes(tag) ? "1px solid rgba(194,24,91,0.3)" : "1px solid rgba(99,102,241,0.12)",
                      color: selectedHashtags.includes(tag) ? "#C2185B" : "#4c4876",
                    }}
                    onClick={() => toggleHashtag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <motion.button
                className="w-full py-4 rounded-2xl font-inter font-bold text-lg text-white mb-3"
                style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 55%, #6366f1 100%)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
              >
                Share Now ✨
              </motion.button>

              {!selfieDataUrl && (
                <motion.button
                  className="w-full py-3.5 rounded-2xl font-inter font-semibold text-base mb-2"
                  style={{ background: "linear-gradient(135deg, #C2185B, #FF4081)", color: "white" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startSelfieCamera}
                >
                  Add a selfie first 📸
                </motion.button>
              )}

              <button
                className="w-full py-3 rounded-2xl font-inter font-semibold text-sm"
                style={{ color: "#8480aa" }}
                onClick={onRestart}
              >
                Try another route
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
