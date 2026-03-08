import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Terminal, Clock, GitFork, Copy, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MonacoEditor from "./MonacoEditor";
import ExecutionTimeline, { type ExecutionStep } from "./ExecutionTimeline";
import FlowchartPanel from "./FlowchartPanel";
import ExampleSnippets from "./ExampleSnippets";

const LANGUAGES = ["Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Rust", "Ruby"];

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [explanation, setExplanation] = useState("");
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [flowchart, setFlowchart] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("explanation");

  const clearResults = () => {
    setExplanation("");
    setSteps([]);
    setFlowchart("");
    setError("");
    setHighlightedLines([]);
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

      if (data.steps?.length) {
        setActiveTab("timeline");
      }
    } catch (err: any) {
      setError(err.message || "Failed to get explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    const text = [
      explanation,
      "",
      ...steps.map((s) => `Step ${s.step}: ${s.title}\n${s.description}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Explanation copied to clipboard");
  }, [explanation, steps]);

  const handleExampleSelect = (exCode: string, exLang: string) => {
    setCode(exCode);
    setLanguage(exLang);
    clearResults();
  };

  const hasResults = explanation || steps.length > 0 || flowchart;

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
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
                  Get a step-by-step execution timeline and automatic flowchart visualization
                </p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-card/30 px-2">
                <TabsTrigger value="explanation" className="gap-1.5 text-xs data-[state=active]:bg-background">
                  <Terminal className="w-3.5 h-3.5" /> Explanation
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-1.5 text-xs data-[state=active]:bg-background">
                  <Clock className="w-3.5 h-3.5" /> Timeline
                </TabsTrigger>
                <TabsTrigger value="flowchart" className="gap-1.5 text-xs data-[state=active]:bg-background">
                  <GitFork className="w-3.5 h-3.5" /> Flowchart
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
                  <ExecutionTimeline steps={steps} onHighlightLines={setHighlightedLines} />
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
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeExplainer;
