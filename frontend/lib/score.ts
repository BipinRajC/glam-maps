export function computeGlamScore(makeupIntegrity: number): number {
  return Math.round(makeupIntegrity * 0.7 + Math.min(makeupIntegrity, 100) * 0.3);
}

export function getArrivalMessage(integrity: number): { headline: string; sub: string } {
  if (integrity > 80) {
    return {
      headline: "Flawless arrival. Bengaluru respects the slay. 👑",
      sub: "Your makeup survived what 41 community reports said was impossible.",
    };
  }
  if (integrity >= 50) {
    return {
      headline: "You made it. Barely. Touch up time. 💄",
      sub: "Bengaluru tried its best. So did your concealer.",
    };
  }
  return {
    headline: "Bengaluru won this round. But Flipkart has you covered. 💀",
    sub: "No foundation survives Koramangala. That's just science.",
  };
}

export function getDifficultyColor(difficulty: string): string {
  if (difficulty === "Easy") return "text-green-400";
  if (difficulty === "Medium") return "text-gold";
  return "text-red-400";
}

export function getDifficultyBg(difficulty: string): string {
  if (difficulty === "Easy") return "bg-green-500/20 text-green-400 border-green-500/30";
  if (difficulty === "Medium") return "bg-gold/20 text-gold border-gold/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
}
