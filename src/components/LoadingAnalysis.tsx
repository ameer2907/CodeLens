import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Brain, GitFork, BarChart3, Cpu, Sparkles } from "lucide-react";

const LOADING_PHASES = [
  { icon: Code2, label: "Parsing code structure…", detail: "Tokenizing and building AST" },
  { icon: Brain, label: "Analyzing execution flow…", detail: "Tracing variable mutations" },
  { icon: Cpu, label: "Building execution model…", detail: "Mapping control flow paths" },
  { icon: GitFork, label: "Generating flowchart…", detail: "Creating visual diagram" },
  { icon: BarChart3, label: "Computing complexity…", detail: "Evaluating Big-O bounds" },
  { icon: Sparkles, label: "Preparing visualization…", detail: "Rendering step animations" },
];

const LoadingAnalysis = () => {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((p) => (p < LOADING_PHASES.length - 1 ? p + 1 : p));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
          >
            <Brain className="w-6 h-6 text-primary" />
          </motion.div>
          <p className="text-sm font-medium text-foreground">Analyzing your code</p>
        </motion.div>

        {/* Phase steps */}
        {LOADING_PHASES.map((phase, i) => {
          const isActive = i === activePhase;
          const isDone = i < activePhase;

          return (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{
                opacity: isDone || isActive ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive ? "bg-primary/5 border border-primary/20" : "border border-transparent"
              }`}
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isDone ? "bg-accent/10" : isActive ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <phase.icon className={`w-4 h-4 ${
                  isDone ? "text-accent" : isActive ? "text-primary" : "text-muted-foreground"
                }`} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${isActive ? "text-foreground font-medium" : isDone ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                  {phase.label}
                </p>
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-muted-foreground"
                    >
                      {phase.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              {isDone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center"
                >
                  <span className="text-accent text-[10px]">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((activePhase + 1) / LOADING_PHASES.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnalysis;
