import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const AmbientBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient layer */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isDark
            ? "linear-gradient(145deg, hsl(222 50% 4%) 0%, hsl(225 45% 7%) 30%, hsl(230 40% 9%) 55%, hsl(222 47% 5%) 100%)"
            : "linear-gradient(145deg, hsl(220 35% 97%) 0%, hsl(215 45% 95%) 30%, hsl(210 50% 96%) 55%, hsl(225 25% 98%) 100%)",
        }}
      />

      {/* Grid pattern — subtle secondary layer */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />

      {/* ═══════ DARK MODE ORBS ═══════ */}
      {isDark && (
        <>
          {/* Primary blue orb — top left */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 800,
              height: 800,
              top: "-20%",
              left: "-12%",
              background: "radial-gradient(circle, hsl(217 91% 35% / 0.18) 0%, hsl(217 91% 35% / 0.05) 50%, transparent 72%)",
              filter: "blur(80px)",
            }}
            animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.06, 0.96, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Purple orb — center right */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 600,
              height: 600,
              top: "25%",
              right: "-8%",
              background: "radial-gradient(circle, hsl(270 65% 30% / 0.14) 0%, hsl(270 65% 30% / 0.04) 50%, transparent 70%)",
              filter: "blur(70px)",
            }}
            animate={{ x: [0, -25, 18, 0], y: [0, 20, -15, 0], scale: [1, 0.95, 1.04, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />

          {/* Teal accent orb — bottom left */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              bottom: "-10%",
              left: "15%",
              background: "radial-gradient(circle, hsl(190 80% 30% / 0.10) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
            animate={{ x: [0, 18, -12, 0], y: [0, -15, 22, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          />

          {/* Green micro-orb — bottom right */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 350,
              height: 350,
              bottom: "5%",
              right: "10%",
              background: "radial-gradient(circle, hsl(142 60% 28% / 0.08) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
            animate={{ x: [0, -10, 14, 0], y: [0, 10, -8, 0], scale: [1, 1.08, 0.94, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 9 }}
          />

          {/* Horizontal neon sweep lines */}
          <motion.div
            className="absolute"
            style={{
              width: 400,
              height: 1,
              top: "35%",
              left: "15%",
              background: "linear-gradient(90deg, transparent, hsl(217 91% 60% / 0.15), hsl(270 70% 60% / 0.10), transparent)",
              filter: "blur(0.5px)",
            }}
            animate={{ opacity: [0.2, 0.5, 0.2], x: [0, 60, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute"
            style={{
              width: 250,
              height: 1,
              top: "65%",
              right: "20%",
              background: "linear-gradient(90deg, transparent, hsl(190 80% 55% / 0.12), transparent)",
              filter: "blur(0.5px)",
            }}
            animate={{ opacity: [0.15, 0.4, 0.15], x: [0, -40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />

          {/* Floating particle dots */}
          {[
            { top: "20%", left: "70%", delay: 0, size: 3 },
            { top: "55%", left: "25%", delay: 2, size: 2 },
            { top: "75%", left: "60%", delay: 4, size: 2.5 },
            { top: "15%", left: "40%", delay: 6, size: 2 },
            { top: "85%", left: "80%", delay: 1, size: 1.5 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
              animate={{ opacity: [0, 0.6, 0], y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}
        </>
      )}

      {/* ═══════ LIGHT MODE ORBS ═══════ */}
      {!isDark && (
        <>
          {/* Soft blue wash — top left */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 900,
              height: 900,
              top: "-25%",
              left: "-15%",
              background: "radial-gradient(circle, hsl(217 85% 88% / 0.5) 0%, hsl(217 85% 90% / 0.15) 50%, transparent 72%)",
              filter: "blur(80px)",
            }}
            animate={{ x: [0, 25, -18, 0], y: [0, -20, 12, 0], scale: [1, 1.04, 0.97, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Lavender orb — right side */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 650,
              height: 650,
              top: "20%",
              right: "-10%",
              background: "radial-gradient(circle, hsl(250 70% 90% / 0.4) 0%, hsl(250 70% 92% / 0.1) 50%, transparent 70%)",
              filter: "blur(70px)",
            }}
            animate={{ x: [0, -22, 15, 0], y: [0, 18, -12, 0], scale: [1, 0.96, 1.03, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />

          {/* Mint accent — bottom */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 550,
              height: 550,
              bottom: "-12%",
              left: "25%",
              background: "radial-gradient(circle, hsl(190 70% 88% / 0.35) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
            animate={{ x: [0, 15, -10, 0], y: [0, -12, 18, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          />

          {/* Warm peach micro-orb — top right */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              top: "5%",
              right: "15%",
              background: "radial-gradient(circle, hsl(30 80% 92% / 0.3) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
            animate={{ x: [0, -12, 10, 0], y: [0, 10, -8, 0], scale: [1, 1.06, 0.95, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 9 }}
          />
        </>
      )}

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, hsl(222 47% 4% / 0.5) 100%)"
            : "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, hsl(220 20% 95% / 0.4) 100%)",
        }}
      />
    </div>
  );
};

export default AmbientBackground;
