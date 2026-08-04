import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoTileProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  glow?: "teal" | "violet" | "none";
  interactive?: boolean;
  onClick?: () => void;
}

const BentoTile = ({ className, children, delay = 0, glow = "none", interactive, onClick }: BentoTileProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    onClick={onClick}
    className={cn(
      "bento-tile",
      glow === "teal" && "bento-glow-teal",
      glow === "violet" && "bento-glow-violet",
      interactive && "bento-interactive",
      className,
    )}
  >
    {children}
  </motion.div>
);

export default BentoTile;
