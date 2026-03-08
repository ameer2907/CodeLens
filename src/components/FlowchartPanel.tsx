import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import mermaid from "mermaid";
import { useTheme } from "@/hooks/use-theme";

interface FlowchartPanelProps {
  chart: string;
  activeNodeIndex?: number;
}

const FlowchartPanel = ({ chart, activeNodeIndex }: FlowchartPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      themeVariables: theme === "dark"
        ? {
            primaryColor: "#1e3a5f",
            primaryTextColor: "#e2e8f0",
            primaryBorderColor: "#334155",
            lineColor: "#475569",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
          }
        : {
            primaryColor: "#dbeafe",
            primaryTextColor: "#1e293b",
            primaryBorderColor: "#93c5fd",
            lineColor: "#94a3b8",
            secondaryColor: "#f0f9ff",
            tertiaryColor: "#f8fafc",
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
          },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 16,
      },
    });
  }, [theme]);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const sanitized = sanitizeChart(chart);

    const render = async () => {
      try {
        setError("");
        containerRef.current!.innerHTML = "";
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, sanitized);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
          // Animate nodes appearing
          highlightNodes(containerRef.current, activeNodeIndex);
        }
      } catch (e: any) {
        console.error("Mermaid render error:", e);
        document.querySelectorAll('[id^="dmermaid-"]').forEach(el => el.remove());
        try {
          const fallbackId = `mermaid-fb-${Date.now()}`;
          const fallback = `graph TD\n    A([Start]) --> B([End])`;
          const { svg } = await mermaid.render(fallbackId, fallback);
          if (containerRef.current) containerRef.current.innerHTML = svg;
          setError("Flowchart was simplified due to syntax issues.");
        } catch {
          setError("Could not render flowchart. Try regenerating.");
        }
      }
    };

    render();
  }, [chart, theme]);

  // Highlight active node when step changes
  useEffect(() => {
    if (containerRef.current && activeNodeIndex !== undefined) {
      highlightNodes(containerRef.current, activeNodeIndex);
    }
  }, [activeNodeIndex]);

  if (!chart) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Run an explanation to see the flowchart
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6 flex flex-col items-center justify-center gap-4">
      {error && <p className="text-destructive text-xs text-center">{error}</p>}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center [&_.node]:transition-all [&_.node]:duration-500"
      />
    </div>
  );
};

function sanitizeChart(raw: string): string {
  let s = raw;
  s = s.replace(/\\n/g, "\n");
  s = s.replace(/```mermaid\s*/gi, "").replace(/```\s*/g, "");
  s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
  s = s.replace(/`/g, "'");
  return s.trim();
}

function highlightNodes(container: HTMLDivElement, activeIdx?: number) {
  const nodes = container.querySelectorAll(".node");
  nodes.forEach((node, i) => {
    const el = node as HTMLElement;
    if (i === activeIdx) {
      el.style.filter = "drop-shadow(0 0 12px hsl(217 91% 60% / 0.6))";
      el.style.transform = "scale(1.04)";
    } else {
      el.style.filter = "";
      el.style.transform = "";
    }
  });
}

export default FlowchartPanel;
