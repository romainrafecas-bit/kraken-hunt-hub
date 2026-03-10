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
        className="absolute w-[180%] h-[180%] -left-[40%] -top-[25%]"
        style={{ opacity: 0.55 }}
      >
        {/* Kraken body — massive dome */}
        <motion.ellipse
          cx="600" cy="300" rx="280" ry="230"
          fill="url(#krakenBodyGrad)"
          animate={{
            ry: [230, 242, 222, 236, 230],
            rx: [280, 272, 288, 276, 280],
            cy: [300, 293, 308, 296, 300],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Body inner texture */}
        <motion.ellipse
          cx="600" cy="290" rx="180" ry="140"
          fill="url(#krakenInnerGrad)"
          animate={{
            ry: [140, 150, 135, 145, 140],
            rx: [180, 174, 186, 178, 180],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Eye left — larger */}
        <motion.ellipse
          cx="520" cy="285" rx="28" ry="35"
          fill="hsl(174 72% 46% / 0.8)"
          style={{ filter: 'blur(2px)' }}
          animate={{
            opacity: [0.5, 1, 0.5],
            ry: [35, 28, 35],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="520" cy="285" rx="12" ry="22"
          fill="hsl(174 72% 85% / 1)"
          animate={{
            opacity: [0.7, 1, 0.7],
            ry: [22, 16, 22],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <ellipse cx="520" cy="280" rx="4" ry="6" fill="hsl(180 90% 95% / 0.9)" />

        {/* Eye right — larger */}
        <motion.ellipse
          cx="680" cy="285" rx="28" ry="35"
          fill="hsl(174 72% 46% / 0.8)"
          style={{ filter: 'blur(2px)' }}
          animate={{
            opacity: [0.5, 1, 0.5],
            ry: [35, 28, 35],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.ellipse
          cx="680" cy="285" rx="12" ry="22"
          fill="hsl(174 72% 85% / 1)"
          animate={{
            opacity: [0.7, 1, 0.7],
            ry: [22, 16, 22],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <ellipse cx="680" cy="280" rx="4" ry="6" fill="hsl(180 90% 95% / 0.9)" />

        {/* Tentacle 1 — left major sweep — THICK with fill */}
        <motion.path
          stroke="hsl(174 72% 46% / 0.4)"
          strokeWidth="22"
          strokeLinecap="round"
          fill="hsl(174 72% 46% / 0.06)"
          animate={{
            d: [
              "M440,500 Q300,580 140,670 Q40,730 -30,830 Q-60,890 -10,900",
              "M440,500 Q270,600 100,700 Q0,760 -60,860 Q-90,920 -40,920",
              "M440,500 Q330,560 180,640 Q80,700 20,800 Q-10,860 30,880",
              "M440,500 Q300,580 140,670 Q40,730 -30,830 Q-60,890 -10,900",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tentacle 2 — right major sweep */}
        <motion.path
          stroke="hsl(262 52% 58% / 0.35)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="hsl(262 52% 58% / 0.05)"
          animate={{
            d: [
              "M760,500 Q900,580 1060,670 Q1160,730 1230,830 Q1260,890 1210,900",
              "M760,500 Q930,600 1100,700 Q1200,760 1260,860 Q1290,920 1240,920",
              "M760,500 Q870,560 1020,640 Q1120,700 1180,800 Q1210,860 1170,880",
              "M760,500 Q900,580 1060,670 Q1160,730 1230,830 Q1260,890 1210,900",
            ],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Tentacle 3 — center-left descending */}
        <motion.path
          stroke="hsl(188 78% 52% / 0.3)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="hsl(188 78% 52% / 0.04)"
          animate={{
            d: [
              "M520,510 Q460,640 380,780 Q340,860 310,920",
              "M520,510 Q440,660 350,800 Q310,880 270,940",
              "M520,510 Q480,620 410,750 Q370,830 350,900",
              "M520,510 Q460,640 380,780 Q340,860 310,920",
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Tentacle 4 — center-right descending */}
        <motion.path
          stroke="hsl(174 72% 46% / 0.3)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="hsl(174 72% 46% / 0.04)"
          animate={{
            d: [
              "M680,510 Q740,640 820,780 Q860,860 890,920",
              "M680,510 Q760,660 850,800 Q890,880 930,940",
              "M680,510 Q720,620 790,750 Q830,830 850,900",
              "M680,510 Q740,640 820,780 Q860,860 890,920",
            ],
          }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Tentacle 5 — far left reaching up and out */}
        <motion.path
          stroke="hsl(262 52% 58% / 0.25)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="hsl(262 52% 58% / 0.03)"
          animate={{
            d: [
              "M400,460 Q250,480 80,540 Q-40,590 -120,700 Q-160,760 -100,790",
              "M400,460 Q220,500 50,570 Q-60,620 -140,730 Q-180,800 -120,820",
              "M400,460 Q280,470 120,520 Q0,570 -80,670 Q-120,730 -60,760",
              "M400,460 Q250,480 80,540 Q-40,590 -120,700 Q-160,760 -100,790",
            ],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Tentacle 6 — far right reaching up and out */}
        <motion.path
          stroke="hsl(188 78% 52% / 0.25)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="hsl(188 78% 52% / 0.03)"
          animate={{
            d: [
              "M800,460 Q950,480 1120,540 Q1240,590 1320,700 Q1360,760 1300,790",
              "M800,460 Q980,500 1150,570 Q1260,620 1340,730 Q1380,800 1320,820",
              "M800,460 Q920,470 1080,520 Q1200,570 1280,670 Q1320,730 1260,760",
              "M800,460 Q950,480 1120,540 Q1240,590 1320,700 Q1360,760 1300,790",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Tentacle 7 — center short left */}
        <motion.path
          stroke="hsl(174 72% 46% / 0.25)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M560,520 Q540,620 510,740 Q500,800 480,850",
              "M560,520 Q530,630 490,760 Q480,820 450,870",
              "M560,520 Q550,610 530,720 Q520,780 510,830",
              "M560,520 Q540,620 510,740 Q500,800 480,850",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />

        {/* Tentacle 8 — center short right */}
        <motion.path
          stroke="hsl(262 52% 58% / 0.25)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M640,520 Q660,620 690,740 Q700,800 720,850",
              "M640,520 Q670,630 710,760 Q720,820 750,870",
              "M640,520 Q650,610 670,720 Q680,780 690,830",
              "M640,520 Q660,620 690,740 Q700,800 720,850",
            ],
          }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        {/* Suction cups along major tentacles */}
        {[0.3, 0.45, 0.6, 0.75].map((t, i) => (
          <motion.circle
            key={`sl-${i}`}
            cx={440 - t * 400}
            cy={500 + t * 350}
            r={5 - i * 0.8}
            fill="hsl(174 72% 46% / 0.5)"
            animate={{ opacity: [0.2, 0.7, 0.2], r: [3, 5 - i * 0.5, 3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
        {[0.3, 0.45, 0.6, 0.75].map((t, i) => (
          <motion.circle
            key={`sr-${i}`}
            cx={760 + t * 400}
            cy={500 + t * 350}
            r={5 - i * 0.8}
            fill="hsl(262 52% 58% / 0.5)"
            animate={{ opacity: [0.2, 0.7, 0.2], r: [3, 5 - i * 0.5, 3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 + i * 0.4 }}
          />
        ))}

        <defs>
          <radialGradient id="krakenBodyGrad" cx="0.5" cy="0.35">
            <stop offset="0%" stopColor="hsl(174 72% 30% / 0.6)" />
            <stop offset="40%" stopColor="hsl(228 42% 12% / 0.7)" />
            <stop offset="100%" stopColor="hsl(228 42% 3% / 0)" />
          </radialGradient>
          <radialGradient id="krakenInnerGrad" cx="0.5" cy="0.4">
            <stop offset="0%" stopColor="hsl(174 72% 20% / 0.3)" />
            <stop offset="100%" stopColor="hsl(228 42% 5% / 0)" />
          </radialGradient>
        </defs>
      </svg>

      {/* Eye glow pulses — large and bright */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 250, height: 250,
          left: 'calc(33% - 125px)', top: 'calc(22% - 125px)',
          background: 'radial-gradient(circle, hsl(174 72% 50% / 0.35) 0%, hsl(174 72% 46% / 0.1) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 250, height: 250,
          left: 'calc(47% - 125px)', top: 'calc(22% - 125px)',
          background: 'radial-gradient(circle, hsl(174 72% 50% / 0.35) 0%, hsl(174 72% 46% / 0.1) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.5, 1, 0.5],
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
