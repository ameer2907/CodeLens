import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Zap, GitFork, BarChart3, Code2, ArrowRight, Braces, Terminal, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";

const FEATURES = [
  { icon: Play, title: "Step-by-Step Execution", desc: "Walk through code line by line with animated highlights and variable tracking." },
  { icon: GitFork, title: "Logic Flowcharts", desc: "Auto-generated diagrams visualize your program's control flow." },
  { icon: BarChart3, title: "Complexity Analysis", desc: "Instant Big-O time and space analysis with optimization suggestions." },
  { icon: Zap, title: "Intelligent Explanations", desc: "Conversational walkthroughs that break down any algorithm into digestible steps." },
];

const FLOATING_ICONS = [
  { Icon: Braces, x: "8%", y: "22%", delay: 0, size: 18 },
  { Icon: Terminal, x: "85%", y: "18%", delay: 1.2, size: 16 },
  { Icon: Hash, x: "12%", y: "70%", delay: 2.5, size: 14 },
  { Icon: Code2, x: "78%", y: "72%", delay: 1.8, size: 16 },
];

const CODE_LINES = [
  { text: "def binary_search(arr, target):", delay: 1.3 },
  { text: "    low, high = 0, len(arr) - 1", delay: 1.5, indent: true },
  { text: "    while low <= high:", delay: 1.7, indent: true },
  { text: "        mid = (low + high) // 2", delay: 1.9, indent: true, deep: true },
  { text: "        if arr[mid] == target:", delay: 2.1, indent: true, deep: true },
  { text: "            return mid", delay: 2.3, indent: true, deepest: true },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AmbientBackground />
      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 pt-28 pb-24 text-center relative">
            {/* Floating code icons */}
            {FLOATING_ICONS.map((item, i) => (
              <motion.div
                key={i}
                className="absolute hidden lg:block pointer-events-none"
                style={{ left: item.x, top: item.y }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15, y: [0, -10, 0] }}
                transition={{ delay: item.delay, duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <item.Icon className="text-primary" style={{ width: item.size, height: item.size }} />
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-foreground inline-block"
                >
                  Understand code,{" "}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                >
                  step by step
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                Paste any algorithm and watch it come alive with animated walkthroughs, flowcharts, variable tracking, and complexity analysis.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex items-center justify-center gap-3"
              >
                <Link to="/playground">
                  <Button size="lg" className="gap-2 text-base px-6 hero-cta-btn">
                    <Code2 className="w-4 h-4" /> Open Playground
                  </Button>
                </Link>
                <Link to="/examples">
                  <Button size="lg" variant="outline" className="gap-2 text-base px-6">
                    Browse Examples <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Code preview mockup with typing animation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-16 mx-auto max-w-3xl rounded-xl border border-border bg-card/80 backdrop-blur-md shadow-2xl overflow-hidden relative"
            >
              {/* Glow behind editor card */}
              <div
                className="absolute -inset-4 rounded-2xl -z-10"
                style={{
                  background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">playground.py</span>
              </div>
              <div className="p-5 text-left font-mono text-sm text-foreground/80 leading-relaxed">
                {CODE_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: line.delay, duration: 0.4 }}
                    className={line.deepest ? "pl-12" : line.deep ? "pl-8" : line.indent ? "pl-4" : ""}
                  >
                    {line.text.split(/(\b(?:def|while|if|return)\b)/g).map((part, j) =>
                      /^(def|while|if|return)$/.test(part) ? (
                        <span key={j} className="text-primary">{part}</span>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </motion.div>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 2.6, duration: 1, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-primary/60 ml-1 mt-1"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-foreground text-center mb-12"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything you need to learn code visually
          </motion.h2>
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
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
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

export default Home;
