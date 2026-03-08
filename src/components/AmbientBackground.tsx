import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const AmbientBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient layer */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(135deg, hsl(222 47% 5%) 0%, hsl(220 40% 8%) 40%, hsl(230 35% 10%) 70%, hsl(222 47% 6%) 100%)"
            : "linear-gradient(135deg, hsl(220 30% 97%) 0%, hsl(215 40% 95%) 40%, hsl(225 30% 96%) 70%, hsl(220 20% 97%) 100%)",
        }}
      />

      {/* Grid pattern — reduced opacity */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.12]" />

      {/* Large blurred radial glow — top left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: "-15%",
          left: "-10%",
          background: isDark
            ? "radial-gradient(circle, hsl(217 91% 40% / 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(217 80% 80% / 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 25, -15, 0], y: [0, -20, 10, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Medium glow — center right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          top: "30%",
          right: "-5%",
          background: isDark
            ? "radial-gradient(circle, hsl(270 60% 35% / 0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(250 70% 85% / 0.3) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -20, 12, 0], y: [0, 15, -10, 0], scale: [1, 0.96, 1.03, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Small accent glow — bottom center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          bottom: "-8%",
          left: "35%",
          background: isDark
            ? "radial-gradient(circle, hsl(142 60% 30% / 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(200 70% 85% / 0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 15, -10, 0], y: [0, -12, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />

      {/* Neon accent line — dark mode only */}
      {isDark && (
        <motion.div
          className="absolute"
          style={{
            width: 300,
            height: 2,
            top: "45%",
            left: "20%",
            background: "linear-gradient(90deg, transparent, hsl(217 91% 60% / 0.2), transparent)",
            filter: "blur(1px)",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

export default AmbientBackground;
