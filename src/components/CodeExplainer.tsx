import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Terminal, Clock, GitFork, Copy, RotateCcw, Variable, TrendingUp, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import MonacoEditor from "./MonacoEditor";
import ExecutionTimeline, { type ExecutionStep } from "./ExecutionTimeline";
import FlowchartPanel from "./FlowchartPanel";
import ExampleSnippets from "./ExampleSnippets";
import VariableTracker from "./VariableTracker";
import ComplexityAnalysis from "./ComplexityAnalysis";
import LoadingAnalysis from "./LoadingAnalysis";

const LANGUAGES = ["Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Rust", "Ruby"];

const CATEGORY_ICONS: Record<string, string> = {
  initialization: "🔵",
  condition: "🟡",
  loop: "🟣",
  function: "🔷",
  output: "🟢",
  return: "🔴",
};

interface ComplexityData {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  suggestions: string[];
}

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [explanation, setExplanation] = useState("");
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [flowchart, setFlowchart] = useState("");
  const [complexity, setComplexity] = useState<ComplexityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("explanation");
  const [activeStep, setActiveStep] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("codelens-example");
    if (stored) {
      try {
        const { code: c, language: l } = JSON.parse(stored);
        setCode(c);
        setLanguage(l);
      } catch {}
      sessionStorage.removeItem("codelens-example");
    }
  }, []);

  const clearResults = () => {
    setExplanation("");
    setSteps([]);
    setFlowchart("");
    setComplexity(null);
    setError("");
    setHighlightedLines([]);
    setActiveStep(0);
    setRevealedSteps(0);
  };

  const handleExplain = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    clearResults();

    try {
      const { data, error: fnError } = await supabase.functions.invoke("explain-code", {
        body: { code, language },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setExplanation(data.explanation || "");
      setSteps(data.steps || []);
      setFlowchart(data.flowchart || "");
      setComplexity(data.complexity || null);

      // Animated step reveal
      if (data.steps?.length) {
        setActiveTab("timeline");
        let i = 0;
        const revealInterval = setInterval(() => {
          i++;
          setRevealedSteps(i);
          if (i >= data.steps.length) clearInterval(revealInterval);
        }, 150);
        // Highlight first step
        if (data.steps[0]?.lines) {
          setHighlightedLines(data.steps[0].lines);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to get explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHighlightLines = useCallback((lines: number[]) => {
    setHighlightedLines(lines);
  }, []);

  const handleStepChange = useCallback((stepIdx: number) => {
    setActiveStep(stepIdx);
  }, []);

  const handleCopy = useCallback(() => {
    const text = [
      explanation,
      "",
      ...steps.map((s) => `Step ${s.step}: ${s.title}\n${s.description}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }, [explanation, steps]);

  const handleDownloadPDF = useCallback(() => {
    const win = window.open("", "_blank");
    if (!win) { toast.error("Popup blocked"); return; }

    const sections: string[] = [];
    sections.push(`<h1 style="color:#60a5fa;">CodeLens Analysis</h1>`);
    sections.push(`<p style="color:#94a3b8;"><strong>Language:</strong> ${language}</p>`);
    sections.push(`<h2>Code</h2><pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;">${code.replace(/</g,"&lt;")}</pre>`);

    if (explanation) {
      sections.push(`<h2>Explanation</h2><p style="white-space:pre-wrap;">${explanation.replace(/</g,"&lt;")}</p>`);
    }

    if (steps.length > 0) {
      sections.push(`<h2>Execution Steps</h2>`);
      steps.forEach((s) => {
        const vars = s.variables ? Object.entries(s.variables).map(([k,v]) => `<code>${k} = ${v}</code>`).join(", ") : "";
        sections.push(`<div style="margin-bottom:12px;padding:12px;background:#1e293b;border-radius:8px;border-left:3px solid #60a5fa;">
          <strong style="color:#60a5fa;">Step ${s.step}:</strong> <strong>${s.title}</strong> <span style="color:#94a3b8;font-size:12px;">[Lines ${s.lines?.join(", ") ?? ""}]</span>
          <p style="margin:4px 0 0;color:#cbd5e1;">${s.description}</p>
          ${vars ? `<p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Variables: ${vars}</p>` : ""}
        </div>`);
      });
    }

    if (complexity) {
      sections.push(`<h2>Complexity Analysis</h2>
        <p><strong>Time:</strong> ${complexity.timeComplexity} &nbsp; <strong>Space:</strong> ${complexity.spaceComplexity}</p>
        <p>${complexity.explanation}</p>`);
      if (complexity.suggestions?.length) {
        sections.push(`<h3>Optimization Suggestions</h3><ul>${complexity.suggestions.map(s => `<li>${s}</li>`).join("")}</ul>`);
      }
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CodeLens Analysis</title>
      <style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:40px;background:#0f172a;color:#e2e8f0;}
      h1{border-bottom:2px solid #1e293b;padding-bottom:8px;}h2{color:#60a5fa;margin-top:24px;}
      code{background:#334155;padding:2px 6px;border-radius:4px;font-size:13px;}</style>
    </head><body>${sections.join("")}</body></html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  }, [code, language, explanation, steps, complexity]);

  const handleExampleSelect = (exCode: string, exLang: string) => {
    setCode(exCode);
    setLanguage(exLang);
    clearResults();
  };

  const hasResults = explanation || steps.length > 0 || flowchart;

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <ExampleSnippets onSelect={handleExampleSelect} />
        </div>
        <div className="flex items-center gap-2">
          {hasResults && (
            <>
              <Button size="sm" variant="ghost" onClick={handleCopy} className="gap-1.5 text-xs">
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDownloadPDF} className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" /> PDF
              </Button>
              <Button size="sm" variant="ghost" onClick={handleExplain} className="gap-1.5 text-xs">
                <RotateCcw className="w-3.5 h-3.5" /> Regenerate
              </Button>
            </>
          )}
          <Button
            onClick={handleExplain}
            disabled={isLoading || !code.trim()}
            size="sm"
            className="gap-1.5"
          >
            {isLoading ? (
              <motion.div className="flex items-center gap-1.5" animate={{ opacity: [0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing…
              </motion.div>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Explain Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Editor with subtle glow behind */}
        <div className="w-1/2 border-r border-border relative">
          <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
          <div className="relative z-10 h-full">
            <MonacoEditor
              code={code}
              language={language}
              onChange={(v) => { setCode(v); clearResults(); }}
              highlightedLines={highlightedLines}
            />
          </div>
        </div>

        {/* Right: Results */}
        <div className="w-1/2 flex flex-col min-h-0 relative">
          <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
          <div className="relative z-10 flex flex-col flex-1 min-h-0">
            {isLoading ? (
              <LoadingAnalysis />
            ) : !hasResults ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-3"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto"
                  >
                    <Terminal className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Paste code & click Explain
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Get step-by-step execution timeline, flowchart, variable tracking, and complexity analysis
                  </p>
                </motion.div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-card/50 backdrop-blur-sm px-2 h-auto flex-wrap">
                  <TabsTrigger value="explanation" className="gap-1.5 text-xs data-[state=active]:bg-background">
                    <Terminal className="w-3.5 h-3.5" /> Explanation
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="gap-1.5 text-xs data-[state=active]:bg-background">
                    <Clock className="w-3.5 h-3.5" /> Timeline
                  </TabsTrigger>
                  <TabsTrigger value="flowchart" className="gap-1.5 text-xs data-[state=active]:bg-background">
                    <GitFork className="w-3.5 h-3.5" /> Flowchart
                  </TabsTrigger>
                  <TabsTrigger value="variables" className="gap-1.5 text-xs data-[state=active]:bg-background">
                    <Variable className="w-3.5 h-3.5" /> Variables
                  </TabsTrigger>
                  <TabsTrigger value="complexity" className="gap-1.5 text-xs data-[state=active]:bg-background">
                    <TrendingUp className="w-3.5 h-3.5" /> Complexity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="explanation" className="flex-1 overflow-y-auto m-0">
                  <div className="p-6 space-y-5">
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    {explanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-xl p-5"
                      >
                        <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono">
                          {explanation}
                        </pre>
                      </motion.div>
                    )}
                    {steps.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Execution Steps
                        </h3>
                        <AnimatePresence>
                          {steps.map((s, i) => (
                            <motion.div
                              key={s.step}
                              initial={{ opacity: 0, x: -20, scale: 0.97 }}
                              animate={{
                                opacity: i < revealedSteps || revealedSteps >= steps.length ? 1 : 0,
                                x: 0,
                                scale: 1,
                              }}
                              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
                              className={`rounded-xl border p-4 cursor-pointer transition-all duration-300 step-indicator-${s.category} ${
                                i === activeStep
                                  ? "border-primary/40 bg-primary/5 step-active-pulse"
                                  : "border-border bg-card/30 hover:bg-card/60"
                              }`}
                              onClick={() => {
                                handleHighlightLines(s.lines);
                                setActiveStep(i);
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`w-2.5 h-2.5 rounded-full step-dot-${s.category}`} />
                                <span className="text-xs font-mono text-muted-foreground">Step {s.step}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium step-dot-${s.category} text-primary-foreground`}>
                                  {s.category}
                                </span>
                                <span className="text-xs font-semibold text-foreground">{s.title}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed pl-5">{s.description}</p>
                              {Object.keys(s.variables).length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 pl-5">
                                  {Object.entries(s.variables).map(([k, v]) => (
                                    <span key={k} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                                      {k} = {v}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="flex-1 overflow-hidden m-0">
                  <ExecutionTimeline
                    steps={steps}
                    onHighlightLines={handleHighlightLines}
                    onStepChange={handleStepChange}
                  />
                </TabsContent>

                <TabsContent value="flowchart" className="flex-1 overflow-hidden m-0">
                  <FlowchartPanel chart={flowchart} activeNodeIndex={activeStep} />
                </TabsContent>

                <TabsContent value="variables" className="flex-1 overflow-hidden m-0">
                  <VariableTracker steps={steps} activeStep={activeStep} />
                </TabsContent>

                <TabsContent value="complexity" className="flex-1 overflow-hidden m-0">
                  <ComplexityAnalysis data={complexity} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeExplainer;
