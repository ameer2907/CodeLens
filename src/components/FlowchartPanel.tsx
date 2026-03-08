import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface FlowchartPanelProps {
  chart: string;
}

const initMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    themeVariables: {
      primaryColor: "#1e3a5f",
      primaryTextColor: "#e2e8f0",
      primaryBorderColor: "#334155",
      lineColor: "#475569",
      secondaryColor: "#1e293b",
      tertiaryColor: "#0f172a",
      fontSize: "14px",
      fontFamily: "'Inter', sans-serif",
    },
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 16,
    },
  });
};

initMermaid();

/** Sanitize AI-generated mermaid syntax */
function sanitizeChart(raw: string): string {
  let s = raw;
  // Unescape literal \n to newlines
  s = s.replace(/\\n/g, "\n");
  // Remove markdown code fences
  s = s.replace(/```mermaid\s*/gi, "").replace(/```\s*/g, "");
  // Remove problematic characters inside node labels
  // Replace smart quotes with normal quotes
  s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
  // Remove backticks inside labels
  s = s.replace(/`/g, "'");
  return s.trim();
}

let renderCounter = 0;

const FlowchartPanel = ({ chart }: FlowchartPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [rawChart, setRawChart] = useState("");

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const sanitized = sanitizeChart(chart);
    setRawChart(sanitized);

    const render = async () => {
      try {
        setError("");
        containerRef.current!.innerHTML = "";
        // Re-init to clear any error state from previous failed renders
        initMermaid();
        
        renderCounter++;
        const id = `mermaid-${renderCounter}`;
        const { svg } = await mermaid.render(id, sanitized);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        }
      } catch (e: any) {
        console.error("Mermaid render error:", e, "\nChart:\n", sanitized);
        // Clean up any orphaned mermaid error elements
        document.querySelectorAll('[id^="dmermaid-"]').forEach(el => el.remove());
        
        // Try a fallback simple chart
        try {
          initMermaid();
          renderCounter++;
          const fallbackId = `mermaid-fb-${renderCounter}`;
          // Build a simple fallback from the sanitized text
          const lines = sanitized.split("\n").filter(l => l.trim());
          const header = lines[0] || "graph TD";
          const fallback = `${header}\n    A([Start]) --> B([End])`;
          const { svg } = await mermaid.render(fallbackId, fallback);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
          setError("Flowchart was simplified due to syntax issues in AI output.");
        } catch {
          setError("Could not render flowchart. Try regenerating the explanation.");
        }
      }
    };

    render();
  }, [chart]);

  if (!chart) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Run an explanation to see the flowchart
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6 flex flex-col items-center justify-center gap-4">
      {error && (
        <p className="text-amber-400 text-xs text-center">{error}</p>
      )}
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
};

export default FlowchartPanel;
