import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface FlowchartPanelProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
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

const FlowchartPanel = ({ chart }: FlowchartPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const render = async () => {
      try {
        setError("");
        containerRef.current!.innerHTML = "";
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Style the SVG to fit
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        }
      } catch (e: any) {
        console.error("Mermaid render error:", e);
        setError("Could not render flowchart. The AI may have produced invalid syntax.");
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
    <div className="h-full overflow-auto p-6 flex items-center justify-center">
      {error ? (
        <p className="text-destructive text-sm text-center">{error}</p>
      ) : (
        <div ref={containerRef} className="w-full flex justify-center" />
      )}
    </div>
  );
};

export default FlowchartPanel;
