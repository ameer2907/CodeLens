import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Terminal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LANGUAGES = ["Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Rust", "Ruby"];

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExplain = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError("");
    setExplanation("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("explain-code", {
        body: { code, language },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message || "Failed to get explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Code<span className="text-primary">Lens</span> AI Code Explainer
        </h1>
        <p className="text-muted-foreground text-lg">
          Paste your code and understand it instantly
        </p>
      </div>

      {/* Editor */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Your Code</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => { setCode(e.target.value); setExplanation(""); setError(""); }}
          placeholder={`# Paste your ${language} code here...\nfor i in range(5):\n    print(i)`}
          className="code-editor w-full h-56 bg-card border border-border rounded-xl p-4 text-foreground text-sm resize-none focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/40 transition-shadow"
        />

        <Button
          onClick={handleExplain}
          disabled={isLoading || !code.trim()}
          className="w-full h-12 text-base font-semibold gap-2 transition-all hover:shadow-[0_0_20px_hsl(var(--glow)/0.4)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Explain Code
            </>
          )}
        </Button>
      </div>

      {/* Output */}
      {(explanation || error || isLoading) && (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Explanation</span>
          </div>
          <div className="terminal-panel rounded-xl p-6 min-h-[120px]">
            {isLoading && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm">Processing your code...</span>
              </div>
            )}
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            {explanation && (
              <pre className="text-sm text-terminal whitespace-pre-wrap leading-relaxed">
                {explanation}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExplainer;
