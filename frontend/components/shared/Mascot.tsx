"use client";

import { motion } from "framer-motion";

interface MascotProps {
  className?: string;
  animate?: boolean;
  size?: number;
}

export default function Mascot({ className = "", animate = true, size = 120 }: MascotProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={animate ? { opacity: 0, scale: 0.8, y: 20 } : undefined}
      animate={animate ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ type: "spring", damping: 12, stiffness: 100 }}
    >
      <svg
        viewBox="0 0 120 160"
        width={size}
        height={size * 1.33}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hair */}
        <ellipse cx="60" cy="42" rx="28" ry="30" fill="#1A1A2E" />
        <path d="M32 50 Q28 80 35 110 Q40 130 60 135 Q80 130 85 110 Q92 80 88 50" fill="#1A1A2E" />
        {/* Hair highlights */}
        <path d="M38 45 Q36 60 40 75" stroke="#C2185B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M82 45 Q84 60 80 75" stroke="#C2185B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Face */}
        <ellipse cx="60" cy="65" rx="20" ry="24" fill="#F5DEB3" />

        {/* Bold eyeliner — left */}
        <path d="M44 59 Q50 56 56 57 Q50 60 44 59Z" fill="#1A1A2E" />
        <path d="M44 59 Q40 55 39 52" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
        {/* Bold eyeliner — right */}
        <path d="M76 59 Q70 56 64 57 Q70 60 76 59Z" fill="#1A1A2E" />
        <path d="M76 59 Q80 55 81 52" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />

        {/* Eyes */}
        <ellipse cx="50" cy="60" rx="4.5" ry="5" fill="#1A1A2E" />
        <ellipse cx="70" cy="60" rx="4.5" ry="5" fill="#1A1A2E" />
        <ellipse cx="51.5" cy="58.5" rx="1.5" ry="1.5" fill="white" />
        <ellipse cx="71.5" cy="58.5" rx="1.5" ry="1.5" fill="white" />

        {/* Nose */}
        <path d="M58 68 Q60 71 62 68" stroke="#C8A882" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Lips — bold, rose */}
        <path d="M52 78 Q56 74 60 75 Q64 74 68 78 Q64 83 60 83 Q56 83 52 78Z" fill="#C2185B" />
        <path d="M52 78 Q56 76 60 75 Q64 76 68 78" stroke="#9C1048" strokeWidth="0.5" fill="none" />

        {/* Neck */}
        <rect x="53" y="87" width="14" height="16" rx="4" fill="#F0C896" />

        {/* Outfit — elegant deep rose dress top */}
        <path d="M35 103 Q40 95 53 100 L55 140 L65 140 L67 100 Q80 95 85 103 Q90 130 85 155 L35 155 Q30 130 35 103Z" fill="#C2185B" />
        {/* Gold accent trim */}
        <path d="M35 103 Q60 108 85 103" stroke="#F9A825" strokeWidth="1.5" fill="none" />

        {/* Compact mirror in right hand */}
        <rect x="78" y="110" width="18" height="16" rx="3" fill="#F9A825" />
        <ellipse cx="87" cy="118" rx="5" ry="5" fill="#E8E8E8" />
        <ellipse cx="87" cy="118" rx="3" ry="3" fill="#B8C4D0" opacity="0.6" />
        {/* Compact mirror hinge */}
        <rect x="78" y="117" width="18" height="1" fill="#E09000" />

        {/* Left arm pose — hand on hip */}
        <path d="M35 108 Q25 118 28 130" stroke="#F0C896" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="131" r="5" fill="#F0C896" />

        {/* Right arm holding mirror */}
        <path d="M85 108 Q90 112 82 115" stroke="#F0C896" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Gold earrings */}
        <circle cx="40" cy="67" r="3" fill="#F9A825" />
        <circle cx="80" cy="67" r="3" fill="#F9A825" />

        {/* Sparkle accents around mascot */}
        <motion.g
          animate={animate ? { opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] } : undefined}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        >
          <path d="M90 35 L92 28 L94 35 L101 37 L94 39 L92 46 L90 39 L83 37Z" fill="#F9A825" opacity="0.9" />
        </motion.g>
        <motion.g
          animate={animate ? { opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.1, 0.8] } : undefined}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        >
          <path d="M22 55 L23.5 50 L25 55 L30 56.5 L25 58 L23.5 63 L22 58 L17 56.5Z" fill="#FF4081" opacity="0.8" />
        </motion.g>
        <motion.g
          animate={animate ? { opacity: [0.5, 1, 0.5] } : undefined}
          transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }}
        >
          <path d="M100 60 L101 57 L102 60 L105 61 L102 62 L101 65 L100 62 L97 61Z" fill="#F9A825" opacity="0.7" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
