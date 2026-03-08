import { motion } from "framer-motion";
import { Brain, Code2, GitFork, BarChart3 } from "lucide-react";

const LOADING_STEPS = [
  { icon: Code2, label: "Parsing code structure…" },
  { icon: Brain, label: "Analyzing execution flow…" },
  { icon: GitFork, label: "Generating flowchart…" },
  { icon: BarChart3, label: "Computing complexity…" },
];

const LoadingAnalysis = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="space-y-4 w-full max-w-xs">
        {LOADING_STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: i * 0.4 + 0.2, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
            >
              <step.icon className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-muted-foreground">{step.label}</span>
          </motion.div>
        ))}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-1 bg-primary/30 rounded-full mt-4 origin-left"
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingAnalysis;
