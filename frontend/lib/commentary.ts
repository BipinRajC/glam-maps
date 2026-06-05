export type HazardType =
  | "smooth"
  | "flyover"
  | "pothole-light"
  | "pothole-cluster"
  | "pothole-severe"
  | "construction"
  | "speed-hump"
  | "water-logging"
  | "gravel-stretch";

const COMMENTARY: Record<HazardType, string[]> = {
  smooth: [
    "Makeup intact. Rare Bengaluru sighting ✨",
    "Smooth road? In Bengaluru? Savor this moment 💅",
    "Your highlighter just thanked the road gods 🌟",
  ],
  flyover: [
    "No lipstick zone up here ⬆️",
    "Elevated and elevated. Confidence at peak 🏔️",
    "Flyover energy. Your contour is safe above ground 🌉",
  ],
  "pothole-light": [
    "Slight wobble. Hold your brushes 💄",
    "Minor pothole. Your concealer can handle this 💪",
    "Small bump. Your setting spray is working overtime 🌬️",
  ],
  "pothole-cluster": [
    "Foundation has left the chat 😭",
    "Pothole cluster! Your blush just scattered 💥",
    "Multiple hits. Even waterproof mascara is questioning life choices 💧",
  ],
  "pothole-severe": [
    "RIP contour. No survivors 💀",
    "Severe pothole! Your face just went off-road 🏜️",
    "That pothole ate your glam for breakfast 🍽️",
  ],
  construction: [
    "Road work? More like face work 🚧",
    "Construction zone. Your foundation is under construction too 🔨",
    "Under repair. Just like your makeup right now 🩹",
  ],
  "speed-hump": [
    "Lipstick exit: confirmed 💋",
    "Speed hump ahead — your lipstick didn't make it 💄",
    "Hump detected. Foundation shifted by 2cm 📏",
  ],
  "water-logging": [
    "Water logging! Your base is literally melting 🌊",
    "Puddle ahead. Say goodbye to that base 💧",
    "Standing water. Your powder just became paste 🧴",
  ],
  "gravel-stretch": [
    "Gravel road. Your blush just went off-road 🪨",
    "Unpaved stretch. Setting spray vs gravel — gravel wins 🏆",
    "Gravel zone. Every stone is a makeup hazard ⚡",
  ],
};

export function getCommentary(hazardType: HazardType): string {
  const messages = COMMENTARY[hazardType] ?? ["Something happened to your glam 💄"];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getCheckpointBanner(checkpointIndex: number, hazardType: HazardType): string {
  const commentary = getCommentary(hazardType);
  return `Checkpoint ${checkpointIndex + 1} — ${commentary}`;
}
