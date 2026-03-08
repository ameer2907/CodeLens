import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Variable, GitBranch, Repeat, Zap, Monitor, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ExecutionStep {
  step: number;
  title: string;
  lines: number[];
  description: string;
  variables: Record<string, string>;
  category: string;
}

interface ExecutionTimelineProps {
  steps: ExecutionStep[];
  onHighlightLines: (lines: number[]) => void;
  onStepChange?: (stepIdx: number) => void;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  initialization: { icon: Variable, color: "text-blue-400", bg: "bg-blue-400/10" },
  condition: { icon: GitBranch, color: "text-amber-400", bg: "bg-amber-400/10" },
  loop: { icon: Repeat, color: "text-purple-400", bg: "bg-purple-400/10" },
  function: { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  output: { icon: Monitor, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  return: { icon: ArrowLeftRight, color: "text-rose-400", bg: "bg-rose-400/10" },
};

const ExecutionTimeline = ({ steps, onHighlightLines, onStepChange }: ExecutionTimelineProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(1);

  const goToStep = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, steps.length - 1));
      setActiveStep(clamped);
      setVisibleSteps(clamped + 1);
      onHighlightLines(steps[clamped]?.lines ?? []);
      onStepChange?.(clamped);
    },
    [steps, onHighlightLines, onStepChange]
  );

  useEffect(() => {
    if (!isPlaying) return;
    if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => goToStep(activeStep + 1), 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, steps.length, goToStep]);

  useEffect(() => {
    if (steps.length > 0) {
      setActiveStep(0);
      setVisibleSteps(1);
      onHighlightLines(steps[0]?.lines ?? []);
      onStepChange?.(0);
    }
  }, [steps]);

  const reset = () => {
    setIsPlaying(false);
    goToStep(0);
    setVisibleSteps(1);
  };

  if (!steps.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Run an explanation to see the execution timeline
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Controls */}
        <div className="flex items-center gap-2 p-3 border-b border-border bg-card/50">
          <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)} className="gap-1.5 text-xs">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => goToStep(activeStep + 1)} disabled={activeStep >= steps.length - 1} className="gap-1.5 text-xs">
            <SkipForward className="w-3.5 h-3.5" /> Next
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} className="gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            Step {activeStep + 1} / {steps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div className="h-full bg-primary" animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {steps.slice(0, visibleSteps).map((step, idx) => {
              const config = CATEGORY_CONFIG[step.category] || CATEGORY_CONFIG.initialization;
              const Icon = config.icon;
              const isActive = idx === activeStep;

              return (
                <Tooltip key={step.step}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx === visibleSteps - 1 ? 0.1 : 0 }}
                      onClick={() => goToStep(idx)}
                      className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
                          : "border-border bg-card/30 hover:bg-card/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${isActive ? config.bg : "bg-muted"}`}>
                          <Icon className={`w-4 h-4 ${isActive ? config.color : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">Step {step.step}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{step.category}</span>
                            {step.lines.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                L{step.lines[0]}{step.lines.length > 1 ? `-${step.lines[step.lines.length - 1]}` : ""}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-foreground mb-1">{step.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

                          {Object.keys(step.variables).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {Object.entries(step.variables).map(([k, v]) => (
                                <span key={k} className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                                  {k} = {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p className="text-xs">{step.description}</p>
                    {step.lines.length > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1">Lines {step.lines.join(", ")}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ExecutionTimeline;
