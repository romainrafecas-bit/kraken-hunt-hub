import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface TentacleProps {
  side: "left" | "right";
  top: string;
  color?: string;
  delay?: number;
  size?: number;
}

const Tentacle = ({ side, top, color = "174 72% 46%", delay = 0, size = 300 }: TentacleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    side === "left" ? [-size * 0.6, 0, -size * 0.3] : [size * 0.6, 0, size * 0.3]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    side === "left" ? [-15, 5, -10] : [15, -5, 10]
  );

  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none z-0"
      style={{
        [side]: 0,
        top,
        x,
        opacity,
        rotate,
        width: size,
        height: size * 1.8,
        transformOrigin: side === "left" ? "left center" : "right center",
      }}
    >
      <svg
        viewBox="0 0 200 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{
          transform: side === "right" ? "scaleX(-1)" : undefined,
          filter: `drop-shadow(0 0 20px hsl(${color} / 0.3))`,
        }}
      >
        <motion.path
          d="M0,180 Q60,80 40,20 Q35,0 50,10 Q65,20 55,50 Q80,100 70,180 Q60,260 80,320 Q85,340 70,335 Q55,330 65,300 Q50,240 0,180Z"
          fill={`hsl(${color} / 0.08)`}
          stroke={`hsl(${color} / 0.2)`}
          strokeWidth="1"
          animate={{
            d: [
              "M0,180 Q60,80 40,20 Q35,0 50,10 Q65,20 55,50 Q80,100 70,180 Q60,260 80,320 Q85,340 70,335 Q55,330 65,300 Q50,240 0,180Z",
              "M0,180 Q70,90 45,25 Q38,5 53,15 Q68,25 52,55 Q75,110 65,180 Q55,250 75,315 Q80,335 65,330 Q50,325 60,295 Q45,235 0,180Z",
              "M0,180 Q55,75 38,18 Q32,-2 48,8 Q62,18 58,48 Q85,95 75,180 Q65,265 85,325 Q90,345 75,338 Q60,332 70,305 Q55,245 0,180Z",
              "M0,180 Q60,80 40,20 Q35,0 50,10 Q65,20 55,50 Q80,100 70,180 Q60,260 80,320 Q85,340 70,335 Q55,330 65,300 Q50,240 0,180Z",
            ],
          }}
          transition={{
            duration: 8 + delay * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((t, i) => (
          <motion.circle
            key={i}
            cx={40 + Math.sin(t * 4) * 15}
            cy={t * 340 + 10}
            r={3 - i * 0.3}
            fill={`hsl(${color} / 0.4)`}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              r: [2 - i * 0.2, 3.5 - i * 0.3, 2 - i * 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay + i * 0.3,
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

// === DEEP SEA KRAKEN — menacing silhouette ===
const DeepKraken = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bodyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bodyRotate = useTransform(scrollYProgress, [0, 1], [0, -3]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ y: bodyY, rotate: bodyRotate }}
    >
      <svg
        viewBox="0 0 1200 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-[140%] h-[140%] -left-[20%] -top-[15%]"
        style={{ opacity: 0.35 }}
      >
        {/* Kraken body — massive dome */}
        <motion.ellipse
          cx="600" cy="320" rx="220" ry="180"
          fill="url(#krakenBodyGrad)"
          animate={{
            ry: [180, 190, 175, 185, 180],
            rx: [220, 215, 225, 218, 220],
            cy: [320, 315, 325, 318, 320],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Eye left */}
        <motion.ellipse
          cx="540" cy="310" rx="18" ry="22"
          fill="hsl(174 72% 46% / 0.7)"
          style={{ filter: 'blur(1px)' }}
          animate={{
            opacity: [0.5, 1, 0.5],
            ry: [22, 18, 22],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="540" cy="310" rx="8" ry="14"
          fill="hsl(174 72% 80% / 0.9)"
          animate={{
            opacity: [0.6, 1, 0.6],
            ry: [14, 10, 14],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Eye right */}
        <motion.ellipse
          cx="660" cy="310" rx="18" ry="22"
          fill="hsl(174 72% 46% / 0.7)"
          style={{ filter: 'blur(1px)' }}
          animate={{
            opacity: [0.5, 1, 0.5],
            ry: [22, 18, 22],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.ellipse
          cx="660" cy="310" rx="8" ry="14"
          fill="hsl(174 72% 80% / 0.9)"
          animate={{
            opacity: [0.6, 1, 0.6],
            ry: [14, 10, 14],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Tentacle 1 — left sweep */}
        <motion.path
          stroke="hsl(174 72% 46% / 0.3)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M480,480 Q350,550 200,620 Q120,660 80,750 Q60,800 100,820",
              "M480,480 Q330,570 180,640 Q100,680 50,770 Q30,830 80,840",
              "M480,480 Q370,540 220,600 Q140,640 110,730 Q90,790 120,800",
              "M480,480 Q350,550 200,620 Q120,660 80,750 Q60,800 100,820",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tentacle 2 — right sweep */}
        <motion.path
          stroke="hsl(262 52% 58% / 0.25)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M720,480 Q850,550 1000,620 Q1080,660 1120,750 Q1140,800 1100,820",
              "M720,480 Q870,570 1020,640 Q1100,680 1150,770 Q1170,830 1120,840",
              "M720,480 Q830,540 980,600 Q1060,640 1090,730 Q1110,790 1080,800",
              "M720,480 Q850,550 1000,620 Q1080,660 1120,750 Q1140,800 1100,820",
            ],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Tentacle 3 — center left */}
        <motion.path
          stroke="hsl(188 78% 52% / 0.2)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M530,490 Q480,600 420,720 Q390,790 370,850 Q360,880 380,890",
              "M530,490 Q460,610 400,740 Q370,810 340,870 Q330,900 360,900",
              "M530,490 Q500,590 440,700 Q410,770 400,830 Q390,860 400,870",
              "M530,490 Q480,600 420,720 Q390,790 370,850 Q360,880 380,890",
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Tentacle 4 — center right */}
        <motion.path
          stroke="hsl(174 72% 46% / 0.2)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M670,490 Q720,600 780,720 Q810,790 830,850 Q840,880 820,890",
              "M670,490 Q740,610 800,740 Q830,810 860,870 Q870,900 840,900",
              "M670,490 Q700,590 760,700 Q790,770 800,830 Q810,860 800,870",
              "M670,490 Q720,600 780,720 Q810,790 830,850 Q840,880 820,890",
            ],
          }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Tentacle 5 — far left reaching */}
        <motion.path
          stroke="hsl(262 52% 58% / 0.15)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M440,470 Q300,500 150,560 Q50,610 -20,700 Q-40,740 0,760",
              "M440,470 Q280,520 130,580 Q30,630 -40,720 Q-60,760 -20,780",
              "M440,470 Q320,490 170,540 Q70,590 0,680 Q-20,720 20,740",
              "M440,470 Q300,500 150,560 Q50,610 -20,700 Q-40,740 0,760",
            ],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Tentacle 6 — far right reaching */}
        <motion.path
          stroke="hsl(188 78% 52% / 0.15)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M760,470 Q900,500 1050,560 Q1150,610 1220,700 Q1240,740 1200,760",
              "M760,470 Q920,520 1070,580 Q1170,630 1240,720 Q1260,760 1220,780",
              "M760,470 Q880,490 1030,540 Q1130,590 1200,680 Q1220,720 1180,740",
              "M760,470 Q900,500 1050,560 Q1150,610 1220,700 Q1240,740 1200,760",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Central short tentacles */}
        <motion.path
          stroke="hsl(174 72% 46% / 0.18)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M580,500 Q570,580 550,680 Q540,730 530,770",
              "M580,500 Q560,590 540,700 Q530,750 510,790",
              "M580,500 Q575,570 560,660 Q550,710 545,750",
              "M580,500 Q570,580 550,680 Q540,730 530,770",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.path
          stroke="hsl(262 52% 58% / 0.18)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M620,500 Q630,580 650,680 Q660,730 670,770",
              "M620,500 Q640,590 660,700 Q670,750 690,790",
              "M620,500 Q625,570 640,660 Q650,710 655,750",
              "M620,500 Q630,580 650,680 Q660,730 670,770",
            ],
          }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        <defs>
          <radialGradient id="krakenBodyGrad" cx="0.5" cy="0.4">
            <stop offset="0%" stopColor="hsl(174 72% 46% / 0.5)" />
            <stop offset="50%" stopColor="hsl(228 42% 10% / 0.7)" />
            <stop offset="100%" stopColor="hsl(228 42% 3% / 0)" />
          </radialGradient>
        </defs>
      </svg>

      {/* Eye glow pulses */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180, height: 180,
          left: 'calc(38% - 90px)', top: 'calc(28% - 90px)',
          background: 'radial-gradient(circle, hsl(174 72% 46% / 0.25) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180, height: 180,
          left: 'calc(48% - 90px)', top: 'calc(28% - 90px)',
          background: 'radial-gradient(circle, hsl(174 72% 46% / 0.25) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
    </motion.div>
  );
};

// Floating particles — enhanced
const Particles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3.5,
    duration: 3 + Math.random() * 7,
    delay: Math.random() * 5,
    color: i % 4 === 0 ? "174 72% 46%" : i % 4 === 1 ? "262 52% 58%" : i % 4 === 2 ? "188 78% 52%" : "174 72% 60%",
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: `hsl(${p.color} / 0.5)`,
            boxShadow: `0 0 ${p.size * 4}px hsl(${p.color} / 0.35)`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

// Ink cloud effect
const InkClouds = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { x: '15%', y: '30%', size: 500, color: '174 72% 46%', delay: 0 },
        { x: '75%', y: '60%', size: 400, color: '262 52% 58%', delay: 3 },
        { x: '50%', y: '80%', size: 600, color: '188 78% 52%', delay: 6 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: cloud.x, top: cloud.y,
            width: cloud.size, height: cloud.size,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, hsl(${cloud.color} / 0.04) 0%, transparent 60%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [-30, 30, -30],
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cloud.delay,
          }}
        />
      ))}
    </div>
  );
};

export { Tentacle, DeepKraken, Particles, InkClouds };
