import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const AmbientBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Floating gradient orbs */}
      <motion.div
        className="ambient-orb w-[500px] h-[500px] -top-32 -left-32"
        style={{ background: `hsl(var(--primary) / 0.12)` }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-orb w-[400px] h-[400px] top-1/2 -right-24"
        style={{ background: `hsl(var(--accent) / 0.08)` }}
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 20, -10, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="ambient-orb w-[350px] h-[350px] -bottom-20 left-1/3"
        style={{ background: theme === "dark" ? `hsl(270 70% 30% / 0.1)` : `hsl(217 91% 85% / 0.3)` }}
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -15, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

export default AmbientBackground;
