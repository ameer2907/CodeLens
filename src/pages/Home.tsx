import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Zap, GitFork, BarChart3, Code2, ArrowRight, Braces, Terminal, Hash, Bot, Sparkles, ChevronRight, Variable, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";

const FEATURES = [
  { icon: Play, title: "Step-by-Step Execution", desc: "Walk through code line by line with animated highlights and variable tracking." },
  { icon: GitFork, title: "Logic Flowcharts", desc: "Auto-generated diagrams visualize your program's control flow." },
  { icon: BarChart3, title: "Complexity Analysis", desc: "Instant Big-O time and space analysis with optimization suggestions." },
  { icon: Zap, title: "Intelligent Explanations", desc: "Conversational walkthroughs that break down any algorithm into digestible steps." },
];

const FLOATING_SYMBOLS = [
  { char: "{", x: "6%", y: "18%", delay: 0, size: 22, rotate: -12 },
  { char: "=>", x: "88%", y: "15%", delay: 1.5, size: 16, rotate: 8 },
  { char: "//", x: "10%", y: "75%", delay: 3, size: 14, rotate: -5 },
  { char: "[]", x: "82%", y: "68%", delay: 2, size: 15, rotate: 10 },
  { char: "()", x: "92%", y: "42%", delay: 4, size: 13, rotate: -8 },
  { char: "&&", x: "4%", y: "50%", delay: 1, size: 12, rotate: 6 },
];

const CODE_LINES = [
  { text: "def binary_search(arr, target):", delay: 0.8 },
  { text: "    low, high = 0, len(arr) - 1", delay: 1.0, indent: 1 },
  { text: "    while low <= high:", delay: 1.2, indent: 1 },
  { text: "        mid = (low + high) // 2", delay: 1.4, indent: 2 },
  { text: "        if arr[mid] == target:", delay: 1.6, indent: 2 },
  { text: "            return mid", delay: 1.8, indent: 3 },
  { text: "        elif arr[mid] < target:", delay: 2.0, indent: 2 },
  { text: "            low = mid + 1", delay: 2.2, indent: 3 },
];

const AI_MESSAGES = [
  { text: "This function searches a sorted array…", delay: 2.8, icon: Bot },
  { text: "It compares the middle element each time", delay: 3.6, icon: Sparkles },
  { text: "Time complexity: O(log n) ✓", delay: 4.4, icon: Zap },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AmbientBackground />
      <div className="relative z-10">
        <Navbar />

        {/* Hero — split layout */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 pt-20 pb-20 relative">
            {/* Floating code symbols */}
            {FLOATING_SYMBOLS.map((item, i) => (
              <motion.span
                key={i}
                className="absolute hidden lg:block pointer-events-none font-mono text-primary/[0.08] select-none"
                style={{ left: item.x, top: item.y, fontSize: item.size, rotate: `${item.rotate}deg` }}
                animate={{ y: [0, -14, 0], opacity: [0.06, 0.12, 0.06] }}
                transition={{ delay: item.delay, duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                {item.char}
              </motion.span>
            ))}

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left — copy */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-accent"
                  />
                  <span className="text-xs font-medium text-primary">AI-Powered Code Tutor</span>
                </motion.div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-foreground block"
                  >
                    Understand code,
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"
                  >
                    step by step
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-5 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed"
                >
                  Paste any algorithm and watch it come alive with animated walkthroughs, flowcharts, variable tracking, and complexity analysis.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 flex items-center gap-3 flex-wrap"
                >
                  <Link to="/playground">
                    <Button size="lg" className="gap-2 text-base px-7 hero-cta-btn">
                      <Code2 className="w-4 h-4" /> Open Playground
                    </Button>
                  </Link>
                  <Link to="/examples">
                    <Button size="lg" variant="outline" className="gap-2 text-base px-6 group">
                      Browse Examples
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-8 flex items-center gap-4 text-[11px] text-muted-foreground/70"
                >
                  {["8 Languages", "AI Walkthrough", "Instant Analysis"].map((label, i) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-accent/50" />
                      {label}
                    </span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right — interactive visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative"
              >
                {/* Glow behind the entire right panel */}
                <div
                  className="absolute -inset-8 -z-10"
                  style={{
                    background: "radial-gradient(ellipse at 50% 40%, hsl(var(--primary) / 0.08) 0%, transparent 65%)",
                    filter: "blur(30px)",
                  }}
                />

                {/* AI Avatar — floating above the code card */}
                <motion.div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    animate={{ boxShadow: [
                      "0 0 20px hsl(var(--primary) / 0.15)",
                      "0 0 35px hsl(var(--primary) / 0.3)",
                      "0 0 20px hsl(var(--primary) / 0.15)",
                    ]}}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-md flex items-center justify-center"
                  >
                    <Bot className="w-7 h-7 text-primary" />
                  </motion.div>
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-primary/20"
                    animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  />
                </motion.div>

                {/* Code editor card */}
                <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md shadow-2xl overflow-hidden relative mt-6">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
                    <span className="ml-2 text-[11px] text-muted-foreground font-mono">binary_search.py</span>
                    <span className="ml-auto text-[10px] text-muted-foreground/50 font-mono">Python</span>
                  </div>

                  <div className="p-4 text-left font-mono text-[13px] text-foreground/80 leading-[1.7] relative">
                    {/* Line numbers */}
                    <div className="absolute left-0 top-4 bottom-4 w-8 flex flex-col text-right text-[11px] text-muted-foreground/30 font-mono leading-[1.7] select-none pr-2">
                      {CODE_LINES.map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>

                    <div className="pl-8">
                      {CODE_LINES.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: line.delay, duration: 0.35 }}
                          style={{ paddingLeft: (line.indent || 0) * 16 }}
                        >
                          {/* Highlight active line */}
                          <motion.span
                            initial={{ backgroundColor: "transparent" }}
                            animate={i === 4 ? {
                              backgroundColor: ["hsla(var(--primary) / 0)", "hsla(var(--primary) / 0.08)", "hsla(var(--primary) / 0)"],
                            } : {}}
                            transition={{ delay: 3.2, duration: 2, repeat: Infinity }}
                            className="inline-block -mx-1 px-1 rounded-sm"
                          >
                            {colorizeCode(line.text)}
                          </motion.span>
                        </motion.div>
                      ))}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: 2.4, duration: 1, repeat: Infinity }}
                        className="inline-block w-[7px] h-[15px] bg-primary/50 ml-0.5 mt-0.5 rounded-[1px]"
                      />
                    </div>
                  </div>
                </div>

                {/* AI explanation bubbles — appearing beside the code */}
                <div className="absolute -right-2 sm:right-0 top-[60%] space-y-2 z-10 w-[220px]">
                  {AI_MESSAGES.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: msg.delay, duration: 0.5, ease: "easeOut" }}
                      className="flex items-start gap-2 bg-card/90 backdrop-blur-sm border border-border/60 rounded-xl rounded-tr-sm px-3 py-2 shadow-lg"
                    >
                      <div className="w-5 h-5 rounded-md bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                        <msg.icon className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-[11px] text-foreground/80 leading-snug">{msg.text}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Connection line from avatar to code */}
                <motion.div
                  className="absolute top-14 left-1/2 w-[1px] h-6 -translate-x-1/2 z-10"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  style={{
                    background: "linear-gradient(to bottom, hsl(var(--primary) / 0.3), transparent)",
                    transformOrigin: "top",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Everything you need to learn code visually
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              A complete toolkit for understanding algorithms through visual, interactive explanations.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          Built with AI · CodeLens © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

/** Syntax highlight helper */
function colorizeCode(text: string) {
  const keywords = /\b(def|while|if|elif|else|return|for|in|import|from|class|and|or|not)\b/g;
  const numbers = /\b(\d+)\b/g;
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const comments = /(#.*)$/g;

  const parts: { text: string; type: "keyword" | "number" | "string" | "comment" | "normal" }[] = [];
  let lastIndex = 0;

  // Simple split by keywords for coloring
  const segments = text.split(keywords);
  return segments.map((segment, i) => {
    if (keywords.test(segment)) {
      return <span key={i} className="text-primary font-medium">{segment}</span>;
    }
    // Color numbers
    const withNumbers = segment.split(numbers);
    return withNumbers.map((part, j) => {
      if (/^\d+$/.test(part)) {
        return <span key={`${i}-${j}`} className="text-[hsl(var(--step-condition))]">{part}</span>;
      }
      return <span key={`${i}-${j}`}>{part}</span>;
    });
  });
}

export default Home;
