import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Variable, GitBranch, Repeat, Zap, Monitor, ArrowLeftRight, Gauge } from "lucide-react";
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

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  initialization: { icon: Variable, label: "Init" },
  condition: { icon: GitBranch, label: "Cond" },
  loop: { icon: Repeat, label: "Loop" },
  function: { icon: Zap, label: "Func" },
  output: { icon: Monitor, label: "Out" },
  return: { icon: ArrowLeftRight, label: "Ret" },
};

const SPEED_OPTIONS = [
  { label: "0.5×", value: 3200 },
  { label: "1×", value: 1800 },
  { label: "1.5×", value: 1200 },
  { label: "2×", value: 800 },
];

const ExecutionTimeline = ({ steps, onHighlightLines, onStepChange }: ExecutionTimelineProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(1);
  const [speedIdx, setSpeedIdx] = useState(1);

  const speed = SPEED_OPTIONS[speedIdx].value;

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
    const timer = setTimeout(() => goToStep(activeStep + 1), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, steps.length, goToStep, speed]);

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

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Controls */}
        <div className="flex items-center gap-1.5 p-3 border-b border-border bg-card/50">
          <Button size="sm" variant="ghost" onClick={() => goToStep(activeStep - 1)} disabled={activeStep <= 0} className="gap-1 text-xs px-2">
            <SkipBack className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant={isPlaying ? "default" : "ghost"} onClick={() => setIsPlaying(!isPlaying)} className="gap-1.5 text-xs px-3">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => goToStep(activeStep + 1)} disabled={activeStep >= steps.length - 1} className="gap-1 text-xs px-2">
            <SkipForward className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} className="text-xs px-2">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          {/* Speed control */}
          <div className="ml-auto flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-muted-foreground" />
            {SPEED_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => setSpeedIdx(i)}
                className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                  i === speedIdx
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Smooth progress bar */}
        <div className="h-1 bg-muted relative overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step counter */}
        <div className="px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground border-b border-border">
          <span>Step {activeStep + 1} of {steps.length}</span>
          <div className="flex gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
              const count = steps.filter(s => s.category === cat).length;
              if (!count) return null;
              return (
                <span key={cat} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full step-dot-${cat}`} />
                  {count}
                </span>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <AnimatePresence>
            {steps.slice(0, visibleSteps).map((step, idx) => {
              const config = CATEGORY_CONFIG[step.category] || CATEGORY_CONFIG.initialization;
              const Icon = config.icon;
              const isActive = idx === activeStep;

              return (
                <Tooltip key={step.step}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, delay: idx === visibleSteps - 1 ? 0.1 : 0, ease: "easeOut" }}
                      onClick={() => goToStep(idx)}
                      className={`rounded-xl border p-4 cursor-pointer transition-all duration-300 step-indicator-${step.category} ${
                        isActive
                          ? "border-primary/40 bg-primary/5 step-active-pulse"
                          : "border-border bg-card/30 hover:bg-card/60 hover:border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                          className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                            isActive ? `step-dot-${step.category} bg-opacity-20` : "bg-muted"
                          }`}
                          style={isActive ? { background: `hsl(var(--step-${step.category === "initialization" ? "init" : step.category}) / 0.15)` } : undefined}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">#{step.step}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded step-dot-${step.category} text-primary-foreground font-medium`}>
                              {config.label}
                            </span>
                            {step.lines.length > 0 && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                L{step.lines[0]}{step.lines.length > 1 ? `–${step.lines[step.lines.length - 1]}` : ""}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-foreground mb-0.5">{step.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

                          {Object.keys(step.variables).length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2 flex flex-wrap gap-1.5"
                            >
                              {Object.entries(step.variables).map(([k, v]) => (
                                <span key={k} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                                  {k} = {v}
                                </span>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p className="text-xs">{step.description}</p>
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
