import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import krakenBg from "@/assets/kraken-bg.jpg";

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
    side === "left" ? [-size * 0.8, -size * 0.1, -size * 0.5] : [size * 0.8, size * 0.1, size * 0.5]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    side === "left" ? [-20, 3, -12] : [20, -3, 12]
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
        height: size * 2,
        transformOrigin: side === "left" ? "left center" : "right center",
      }}
    >
      <svg
        viewBox="0 0 120 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{
          transform: side === "right" ? "scaleX(-1)" : undefined,
          filter: `drop-shadow(0 0 30px hsl(${color} / 0.15))`,
        }}
      >
        {/* Main tentacle body — organic curve */}
        <motion.path
          d="M0,200 C15,160 35,100 28,50 C26,35 32,25 38,35 C44,45 40,65 35,90 C30,130 50,170 45,200 C40,235 55,280 50,320 C48,340 42,355 35,345 C28,335 35,310 40,285 C45,255 25,230 0,200Z"
          fill={`hsl(${color} / 0.05)`}
          stroke={`hsl(${color} / 0.12)`}
          strokeWidth="0.5"
          animate={{
            d: [
              "M0,200 C15,160 35,100 28,50 C26,35 32,25 38,35 C44,45 40,65 35,90 C30,130 50,170 45,200 C40,235 55,280 50,320 C48,340 42,355 35,345 C28,335 35,310 40,285 C45,255 25,230 0,200Z",
              "M0,200 C20,155 40,95 32,45 C30,28 36,20 42,30 C48,42 42,68 38,95 C33,135 52,175 48,205 C43,240 58,285 52,325 C50,345 44,358 37,348 C30,338 38,315 42,290 C47,258 28,232 0,200Z",
              "M0,200 C12,165 32,105 25,55 C23,38 29,28 35,38 C41,48 37,62 33,88 C28,128 48,168 42,198 C38,232 52,275 48,315 C46,335 40,350 33,340 C26,330 33,308 38,282 C43,252 22,228 0,200Z",
              "M0,200 C15,160 35,100 28,50 C26,35 32,25 38,35 C44,45 40,65 35,90 C30,130 50,170 45,200 C40,235 55,280 50,320 C48,340 42,355 35,345 C28,335 35,310 40,285 C45,255 25,230 0,200Z",
            ],
          }}
          transition={{
            duration: 12 + delay * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
        {/* Inner highlight stroke */}
        <motion.path
          d="M5,200 C18,165 33,110 27,60 C25,45 30,38 35,48 C40,58 38,75 34,100 C30,140 45,175 42,200 C39,230 50,270 47,305"
          fill="none"
          stroke={`hsl(${color} / 0.08)`}
          strokeWidth="0.8"
          strokeLinecap="round"
          animate={{
            strokeOpacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 1,
          }}
        />
        {/* Suction cups — small subtle dots along the tentacle */}
        {[0.25, 0.4, 0.55, 0.7, 0.85].map((t, i) => (
          <motion.circle
            key={i}
            cx={30 + Math.sin(t * 3) * 8}
            cy={t * 350 + 25}
            r={1.5 - i * 0.15}
            fill={`hsl(${color} / 0.2)`}
            animate={{
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay + i * 0.5,
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

// === DEEP SEA KRAKEN — Real image with animations ===
const DeepKraken = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <motion.img
          src={krakenBg}
          alt=""
          className="absolute w-full h-full left-0 object-cover object-center"
          style={{ opacity: 0.45, top: '5%' }}
          animate={{
            y: [0, -15, 0, 10, 0],
            x: [0, 5, 0, -5, 0],
            scale: [1, 1.02, 1, 0.99, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Pulsing eye glow overlay — left eye */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          left: 'calc(40% - 100px)', top: 'calc(28% - 100px)',
          background: 'radial-gradient(circle, hsl(174 80% 55% / 0.3) 0%, hsl(174 72% 46% / 0.08) 40%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing eye glow overlay — right eye */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          left: 'calc(52% - 100px)', top: 'calc(28% - 100px)',
          background: 'radial-gradient(circle, hsl(174 80% 55% / 0.3) 0%, hsl(174 72% 46% / 0.08) 40%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </motion.div>
  );
};

// Floating particles
const Particles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    duration: 5 + Math.random() * 7,
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
            willChange: 'transform, opacity',
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
