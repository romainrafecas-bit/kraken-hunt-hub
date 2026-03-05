import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
        {/* Suction cups / bioluminescent dots */}
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

const FloatingKraken = () => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        y: [0, -15, 0, 10, 0],
        x: [0, 8, 0, -5, 0],
        scale: [1, 1.02, 1, 0.99, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          rotate: [0, 1, 0, -0.5, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* This wraps the hero image to make it float */}
      </motion.div>
    </motion.div>
  );
};

// Floating particles
const Particles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 3,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 4,
    color: i % 3 === 0 ? "174 72% 46%" : i % 3 === 1 ? "262 52% 58%" : "188 78% 52%",
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
            boxShadow: `0 0 ${p.size * 3}px hsl(${p.color} / 0.3)`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.8, 0],
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

export { Tentacle, FloatingKraken, Particles };
