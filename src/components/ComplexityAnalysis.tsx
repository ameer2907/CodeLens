import { motion } from "framer-motion";
import { Clock, HardDrive, Lightbulb, TrendingUp, Zap } from "lucide-react";

interface ComplexityData {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  suggestions: string[];
}

interface ComplexityAnalysisProps {
  data: ComplexityData | null;
}

const COMPLEXITY_COLORS: Record<string, string> = {
  "O(1)": "text-emerald-400",
  "O(log n)": "text-emerald-400",
  "O(n)": "text-blue-400",
  "O(n log n)": "text-amber-400",
  "O(n²)": "text-orange-400",
  "O(n^2)": "text-orange-400",
  "O(2^n)": "text-rose-400",
  "O(n!)": "text-rose-400",
};

function getColor(complexity: string) {
  for (const [key, color] of Object.entries(COMPLEXITY_COLORS)) {
    if (complexity.includes(key)) return color;
  }
  return "text-primary";
}

const ComplexityAnalysis = ({ data }: ComplexityAnalysisProps) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Run an explanation to see complexity analysis
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Complexity cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card/50 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</span>
          </div>
          <p className={`text-2xl font-mono font-bold ${getColor(data.timeComplexity)}`}>
            {data.timeComplexity}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card/50 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Space</span>
          </div>
          <p className={`text-2xl font-mono font-bold ${getColor(data.spaceComplexity)}`}>
            {data.spaceComplexity}
          </p>
        </motion.div>
      </div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card/30 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Analysis</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{data.explanation}</p>
      </motion.div>

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card/30 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              AI Suggestions
            </span>
          </div>
          <ul className="space-y-2">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default ComplexityAnalysis;
