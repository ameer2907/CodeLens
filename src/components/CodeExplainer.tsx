import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Terminal, Clock, GitFork, Copy, RotateCcw, Variable, TrendingUp, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MonacoEditor from "./MonacoEditor";
import ExecutionTimeline, { type ExecutionStep } from "./ExecutionTimeline";
import FlowchartPanel from "./FlowchartPanel";
import ExampleSnippets from "./ExampleSnippets";
import VariableTracker from "./VariableTracker";
import ComplexityAnalysis from "./ComplexityAnalysis";

const LANGUAGES = ["Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Rust", "Ruby"];

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

  const clearResults = () => {
    setExplanation("");
    setSteps([]);
    setFlowchart("");
    setComplexity(null);
    setError("");
    setHighlightedLines([]);
    setActiveStep(0);
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

      if (data.steps?.length) {
        setActiveTab("timeline");
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
          <strong style="color:#60a5fa;">Step ${s.step}:</strong> <strong>${s.title}</strong> <span style="color:#94a3b8;font-size:12px;">[Line ${s.line}]</span>
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
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
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
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing…
              </>
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
        {/* Left: Editor */}
        <div className="w-1/2 border-r border-border">
          <MonacoEditor
            code={code}
            language={language}
            onChange={(v) => { setCode(v); clearResults(); }}
            highlightedLines={highlightedLines}
          />
        </div>

        {/* Right: Results */}
        <div className="w-1/2 flex flex-col min-h-0">
          {!hasResults && !isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Terminal className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Paste code & click Explain</h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Get step-by-step execution timeline, flowchart, variable tracking, and complexity analysis
                </p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-card/30 px-2 h-auto flex-wrap">
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
                <div className="p-6">
                  {isLoading && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm">Analyzing your code…</span>
                    </div>
                  )}
                  {error && <p className="text-destructive text-sm">{error}</p>}
                  {explanation && (
                    <div className="terminal-panel rounded-xl p-5">
                      <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono">
                        {explanation}
                      </pre>
                    </div>
                  )}
                  {steps.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Detailed Steps</h3>
                      {steps.map((s) => (
                        <div key={s.step} className="terminal-panel rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-primary">Step {s.step}</span>
                            <span className="text-xs font-medium text-foreground">{s.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="flex-1 overflow-hidden m-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">Building execution timeline…</span>
                  </div>
                ) : (
                  <ExecutionTimeline
                    steps={steps}
                    onHighlightLines={handleHighlightLines}
                    onStepChange={handleStepChange}
                  />
                )}
              </TabsContent>

              <TabsContent value="flowchart" className="flex-1 overflow-hidden m-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">Generating flowchart…</span>
                  </div>
                ) : (
                  <FlowchartPanel chart={flowchart} />
                )}
              </TabsContent>

              <TabsContent value="variables" className="flex-1 overflow-hidden m-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">Tracking variables…</span>
                  </div>
                ) : (
                  <VariableTracker steps={steps} activeStep={activeStep} />
                )}
              </TabsContent>

              <TabsContent value="complexity" className="flex-1 overflow-hidden m-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">Analyzing complexity…</span>
                  </div>
                ) : (
                  <ComplexityAnalysis data={complexity} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeExplainer;
