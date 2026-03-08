import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mermaid from "mermaid";
import { useTheme } from "@/hooks/use-theme";
import { GitFork, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlowchartPanelProps {
  chart: string;
  activeNodeIndex?: number;
}

const FlowchartPanel = ({ chart, activeNodeIndex }: FlowchartPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const [rendered, setRendered] = useState(false);
  const { theme } = useTheme();
  const renderIdRef = useRef(0);

  // Theme-aware mermaid config
  useEffect(() => {
    const isDark = theme === "dark";
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      themeVariables: isDark
        ? {
            primaryColor: "#1e3a5f",
            primaryTextColor: "#e2e8f0",
            primaryBorderColor: "#3b82f6",
            lineColor: "#64748b",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            fontSize: "13px",
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            nodeBorder: "#3b82f6",
            mainBkg: "#1e293b",
            clusterBkg: "#0f172a",
          }
        : {
            primaryColor: "#dbeafe",
            primaryTextColor: "#1e293b",
            primaryBorderColor: "#60a5fa",
            lineColor: "#94a3b8",
            secondaryColor: "#f0f9ff",
            tertiaryColor: "#f8fafc",
            fontSize: "13px",
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            nodeBorder: "#60a5fa",
            mainBkg: "#eff6ff",
            clusterBkg: "#f8fafc",
          },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 20,
        nodeSpacing: 40,
        rankSpacing: 50,
        useMaxWidth: true,
      },
    });
  }, [theme]);

  // Build a safe chart from steps data if the raw chart fails
  const sanitized = useMemo(() => sanitizeChart(chart), [chart]);

  useEffect(() => {
    if (!sanitized || !containerRef.current) return;

    renderIdRef.current++;
    const currentRender = renderIdRef.current;

    const render = async () => {
      try {
        setError("");
        setRendered(false);

        // Clear previous
        if (containerRef.current) containerRef.current.innerHTML = "";

        // Clean up orphaned mermaid elements
        document.querySelectorAll('[id^="dmermaid-"]').forEach((el) => el.remove());

        const id = `mermaid-${Date.now()}-${currentRender}`;

        // Validate first
        const isValid = await mermaid.parse(sanitized).catch(() => false);

        let chartToRender = sanitized;
        if (!isValid) {
          // Try to build a fallback from the raw chart
          chartToRender = buildFallbackChart(sanitized);
        }

        const { svg } = await mermaid.render(id, chartToRender);

        if (containerRef.current && currentRender === renderIdRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
            svgEl.style.transition = "all 0.3s ease";
          }

          // Add CSS classes for animated styling
          styleNodes(containerRef.current, theme === "dark");
          highlightNodes(containerRef.current, activeNodeIndex);
          setRendered(true);
        }
      } catch (e: any) {
        console.error("Mermaid render error:", e);
        document.querySelectorAll('[id^="dmermaid-"]').forEach((el) => el.remove());

        try {
          const fallbackId = `mermaid-fb-${Date.now()}`;
          const fallback = `graph TD\n    A([Start]) --> B([End])`;
          const { svg } = await mermaid.render(fallbackId, fallback);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            styleNodes(containerRef.current, theme === "dark");
          }
          setError("Flowchart was simplified. Click Regenerate for a better diagram.");
        } catch {
          setError("Could not render flowchart. Try regenerating.");
        }
        setRendered(true);
      }
    };

    render();
  }, [sanitized, theme]);

  // Highlight active node when step changes
  useEffect(() => {
    if (containerRef.current && rendered && activeNodeIndex !== undefined) {
      highlightNodes(containerRef.current, activeNodeIndex);
    }
  }, [activeNodeIndex, rendered]);

  const handleZoom = (delta: number) => {
    setZoom((z) => Math.max(0.5, Math.min(2, z + delta)));
  };

  const handleResetZoom = () => setZoom(1);

  if (!chart) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <GitFork className="w-8 h-8 text-primary" />
        </motion.div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground mb-1">No flowchart yet</p>
          <p className="text-xs text-muted-foreground">Run an explanation to see the logic flow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-1">
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleZoom(-0.15)}>
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <button
          onClick={handleResetZoom}
          className="text-[10px] text-muted-foreground px-1.5 hover:text-foreground transition-colors min-w-[36px] text-center"
        >
          {Math.round(zoom * 100)}%
        </button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleZoom(0.15)}>
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleResetZoom}>
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-3 z-20 text-[11px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-1.5 max-w-[250px]"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node index legend */}
      {rendered && activeNodeIndex !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-3 left-3 z-20 text-[10px] text-muted-foreground bg-card/80 backdrop-blur-sm border border-border rounded-lg px-2.5 py-1.5"
        >
          Active node: <span className="text-primary font-medium">{activeNodeIndex + 1}</span>
        </motion.div>
      )}

      {/* Flowchart container */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          className={`w-full flex justify-center transition-transform duration-300 flowchart-container ${
            theme === "dark" ? "flowchart-dark" : "flowchart-light"
          }`}
        />
      </div>
    </div>
  );
};

/**
 * Aggressively sanitize mermaid chart to prevent syntax errors
 */
function sanitizeChart(raw: string): string {
  let s = raw;

  // Unescape newlines
  s = s.replace(/\\n/g, "\n");

  // Remove code fences
  s = s.replace(/```mermaid\s*/gi, "").replace(/```\s*/g, "");

  // Normalize quotes
  s = s.replace(/[\u201C\u201D\u201E\u201F]/g, '"');
  s = s.replace(/[\u2018\u2019\u201A\u201B]/g, "'");

  // Remove backticks from labels
  s = s.replace(/`/g, "'");

  // Process line by line to fix common issues
  const lines = s.split("\n").map((line) => {
    let l = line;

    // Remove semicolons at end of lines (Mermaid doesn't like them in some contexts)
    l = l.replace(/;+\s*$/, "");

    // Fix labels inside square brackets: remove problematic chars
    l = l.replace(/\[([^\]]*)\]/g, (_, label) => {
      let cleaned = label;
      // Remove parentheses inside square brackets (causes parse errors)
      cleaned = cleaned.replace(/[()]/g, "");
      // Remove colons and semicolons inside labels
      cleaned = cleaned.replace(/[:;]/g, " ");
      // Remove quotes inside labels
      cleaned = cleaned.replace(/["']/g, "");
      // Trim and limit length
      cleaned = cleaned.trim().slice(0, 40);
      return `[${cleaned}]`;
    });

    // Fix labels inside curly braces (diamond/condition nodes)
    l = l.replace(/\{([^}]*)\}/g, (_, label) => {
      let cleaned = label;
      cleaned = cleaned.replace(/[()[\]:;"']/g, " ");
      cleaned = cleaned.trim().slice(0, 35);
      return `{${cleaned}}`;
    });

    // Fix labels inside rounded brackets (stadium/start-end nodes)
    l = l.replace(/\(\[([^\]]*)\]\)/g, (_, label) => {
      let cleaned = label;
      cleaned = cleaned.replace(/[[\]{}:;"']/g, " ");
      cleaned = cleaned.trim().slice(0, 30);
      return `([${cleaned}])`;
    });

    return l;
  });

  s = lines.join("\n").trim();

  // Ensure it starts with graph or flowchart directive
  if (!/^(graph|flowchart)\s+(TD|TB|LR|RL|BT)/i.test(s)) {
    s = "graph TD\n" + s;
  }

  return s;
}

/**
 * Build a basic fallback flowchart from partially valid syntax
 */
function buildFallbackChart(raw: string): string {
  // Try to extract node labels from the broken chart
  const labelPattern = /([A-Z])\[([^\]]+)\]/g;
  const labels: { id: string; label: string }[] = [];
  let match;
  while ((match = labelPattern.exec(raw)) !== null) {
    labels.push({ id: match[1], label: match[2].replace(/[^a-zA-Z0-9 ]/g, "").trim().slice(0, 25) });
  }

  if (labels.length >= 2) {
    let chart = "graph TD\n";
    for (let i = 0; i < labels.length; i++) {
      const node = `    ${labels[i].id}[${labels[i].label}]`;
      if (i < labels.length - 1) {
        chart += `${node} --> ${labels[i + 1].id}\n`;
      } else {
        chart += `${node}\n`;
      }
    }
    return chart.trim();
  }

  return "graph TD\n    A([Start]) --> B[Process] --> C([End])";
}

/**
 * Apply visual styling to rendered SVG nodes
 */
function styleNodes(container: HTMLDivElement, isDark: boolean) {
  const nodes = container.querySelectorAll(".node");
  nodes.forEach((node) => {
    const el = node as HTMLElement;
    el.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.cursor = "pointer";

    // Add subtle hover effect
    el.addEventListener("mouseenter", () => {
      if (!el.dataset.active) {
        el.style.filter = isDark
          ? "drop-shadow(0 0 8px hsl(217 91% 60% / 0.3))"
          : "drop-shadow(0 0 8px hsl(217 91% 60% / 0.2))";
        el.style.transform = "scale(1.03)";
      }
    });
    el.addEventListener("mouseleave", () => {
      if (!el.dataset.active) {
        el.style.filter = "";
        el.style.transform = "";
      }
    });
  });

  // Style edges
  const edges = container.querySelectorAll(".edgePath path");
  edges.forEach((edge) => {
    const el = edge as SVGPathElement;
    el.style.transition = "stroke 0.4s ease, stroke-width 0.4s ease";
  });
}

/**
 * Highlight the active node with glow animation
 */
function highlightNodes(container: HTMLDivElement, activeIdx?: number) {
  const nodes = container.querySelectorAll(".node");
  const edges = container.querySelectorAll(".edgePath path");

  nodes.forEach((node, i) => {
    const el = node as HTMLElement;
    if (i === activeIdx) {
      el.dataset.active = "true";
      el.style.filter = "drop-shadow(0 0 16px hsl(217 91% 60% / 0.6)) drop-shadow(0 0 6px hsl(217 91% 60% / 0.3))";
      el.style.transform = "scale(1.06)";

      // Pulse animation via class
      el.classList.add("flowchart-node-active");
    } else {
      delete el.dataset.active;
      el.style.filter = "";
      el.style.transform = "";
      el.classList.remove("flowchart-node-active");

      // Dim non-active nodes slightly
      if (activeIdx !== undefined) {
        el.style.opacity = "0.55";
      } else {
        el.style.opacity = "1";
      }
    }
  });

  // Highlight edges leading to active node
  edges.forEach((edge, i) => {
    const el = edge as SVGPathElement;
    if (activeIdx !== undefined && i < activeIdx) {
      el.style.stroke = "hsl(217 91% 60%)";
      el.style.strokeWidth = "2.5";
    } else {
      el.style.stroke = "";
      el.style.strokeWidth = "";
    }
  });
}

export default FlowchartPanel;
