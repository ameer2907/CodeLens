import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Zap, GitFork, BarChart3, Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";

const FEATURES = [
  { icon: Play, title: "Step-by-Step Execution", desc: "Walk through code line by line with animated highlights and variable tracking." },
  { icon: GitFork, title: "Logic Flowcharts", desc: "Auto-generated diagrams visualize your program's control flow." },
  { icon: BarChart3, title: "Complexity Analysis", desc: "Instant Big-O time and space analysis with optimization suggestions." },
  { icon: Zap, title: "Intelligent Explanations", desc: "Conversational walkthroughs that break down any algorithm into digestible steps." },
];

const FLOATING_CODE = [
  { text: "for i in range(n):", x: "8%", y: "18%", delay: 0 },
  { text: "if x > pivot:", x: "72%", y: "25%", delay: 1.5 },
  { text: "return result", x: "15%", y: "72%", delay: 3 },
  { text: "while left < right:", x: "65%", y: "68%", delay: 2 },
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
            {FLOATING_CODE.map((frag, i) => (
              <motion.div
                key={i}
                className="absolute hidden lg:block text-[11px] font-mono text-muted-foreground/20 pointer-events-none select-none"
                style={{ left: frag.x, top: frag.y }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{ delay: frag.delay, duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {frag.text}
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
                  <Button size="lg" className="gap-2 text-base px-6">
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

            {/* Code preview mockup */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-16 mx-auto max-w-3xl rounded-xl border border-border bg-card/80 backdrop-blur-md shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">playground.py</span>
              </div>
              <div className="p-5 text-left font-mono text-sm text-foreground/80 leading-relaxed">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                  <span className="text-primary">def</span> <span className="text-accent">binary_search</span>(arr, target):
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="pl-4">
                  low, high = <span className="text-primary/70">0</span>, len(arr) - <span className="text-primary/70">1</span>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="pl-4">
                  <span className="text-primary">while</span> low &lt;= high:
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} className="pl-8">
                  mid = (low + high) // <span className="text-primary/70">2</span>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} className="pl-8">
                  <span className="text-primary">if</span> arr[mid] == target:
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} className="pl-12">
                  <span className="text-primary">return</span> mid
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="pl-8 text-muted-foreground">
                  ...
                </motion.div>
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
