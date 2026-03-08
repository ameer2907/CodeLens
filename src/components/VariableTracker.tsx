import { motion, AnimatePresence } from "framer-motion";
import { Variable, ArrowRight, TrendingUp } from "lucide-react";
import type { ExecutionStep } from "./ExecutionTimeline";

interface VariableTrackerProps {
  steps: ExecutionStep[];
  activeStep: number;
}

const VariableTracker = ({ steps, activeStep }: VariableTrackerProps) => {
  if (!steps.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Run an explanation to see variable states
      </div>
    );
  }

  const history: { step: number; title: string; vars: Record<string, string> }[] = [];
  const cumulative: Record<string, string> = {};
  const prevValues: Record<string, string> = {};

  for (let i = 0; i <= Math.min(activeStep, steps.length - 1); i++) {
    const s = steps[i];
    if (Object.keys(s.variables).length > 0) {
      // Track which values changed
      const changes: Record<string, string> = {};
      for (const [k, v] of Object.entries(s.variables)) {
        if (cumulative[k] !== v) changes[k] = v;
      }
      Object.assign(prevValues, cumulative);
      Object.assign(cumulative, s.variables);
      history.push({ step: s.step, title: s.title, vars: { ...s.variables } });
    }
  }

  const currentVars = Object.entries(cumulative);

  return (
    <div className="flex flex-col h-full">
      {/* Current state */}
      <div className="p-4 border-b border-border bg-card/30">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Variable className="w-3.5 h-3.5" />
          Current State — Step {Math.min(activeStep + 1, steps.length)}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence mode="popLayout">
            {currentVars.length === 0 ? (
              <p className="col-span-2 text-xs text-muted-foreground">No variables yet</p>
            ) : (
              currentVars.map(([k, v]) => {
                const changed = prevValues[k] !== undefined && prevValues[k] !== v;
                return (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-300 ${
                      changed
                        ? "bg-primary/5 border-primary/30 shadow-[0_0_8px_hsl(var(--primary)/0.1)]"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <span className="text-xs font-mono text-primary font-medium">{k}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    <motion.span
                      key={`${k}-${v}`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono text-foreground truncate"
                    >
                      {v}
                    </motion.span>
                    {changed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <TrendingUp className="w-3 h-3 text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Change history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Change History
        </h3>
        <AnimatePresence>
          {history.map((h, idx) => (
            <motion.div
              key={`${h.step}-${idx}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`rounded-lg border p-3 transition-all ${
                idx === history.length - 1
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Step {h.step}
                </span>
                <span className="text-xs text-foreground font-medium truncate">{h.title}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(h.vars).map(([k, v]) => (
                  <span key={k} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {k} = {v}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VariableTracker;
