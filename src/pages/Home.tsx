import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Zap, GitFork, BarChart3, Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const FEATURES = [
  { icon: Play, title: "Step-by-Step Execution", desc: "Walk through code line by line with animated highlights and variable tracking." },
  { icon: GitFork, title: "Logic Flowcharts", desc: "Auto-generated diagrams visualize your program's control flow." },
  { icon: BarChart3, title: "Complexity Analysis", desc: "Instant Big-O time and space analysis with optimization suggestions." },
  { icon: Zap, title: "AI-Powered", desc: "Intelligent explanations that break down any algorithm into digestible steps." },
];

const EXAMPLE_ALGORITHMS = [
  { name: "Bubble Sort", lang: "Python", difficulty: "Easy" },
  { name: "Binary Search", lang: "Python", difficulty: "Easy" },
  { name: "Fibonacci", lang: "JavaScript", difficulty: "Easy" },
  { name: "Two Sum", lang: "JavaScript", difficulty: "Medium" },
  { name: "FizzBuzz", lang: "Python", difficulty: "Easy" },
  { name: "Factorial", lang: "JavaScript", difficulty: "Easy" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-accent",
  Medium: "text-primary",
  Hard: "text-destructive",
};

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Zap className="w-3 h-3" /> AI-Powered Code Learning
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Understand code,{" "}
              <span className="text-primary">step by step</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Paste any algorithm and watch it come alive. CodeLens AI breaks down your code with animated walkthroughs, flowcharts, variable tracking, and complexity analysis.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
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
            </div>
          </motion.div>

          {/* Code preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-14 mx-auto max-w-3xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">playground.py</span>
            </div>
            <div className="p-5 text-left font-mono text-sm text-foreground/80 leading-relaxed">
              <div><span className="text-primary">def</span> <span className="text-accent">binary_search</span>(arr, target):</div>
              <div className="pl-4">low, high = <span className="text-amber-400">0</span>, len(arr) - <span className="text-amber-400">1</span></div>
              <div className="pl-4"><span className="text-primary">while</span> low &lt;= high:</div>
              <div className="pl-8">mid = (low + high) // <span className="text-amber-400">2</span></div>
              <div className="pl-8"><span className="text-primary">if</span> arr[mid] == target:</div>
              <div className="pl-12"><span className="text-primary">return</span> mid</div>
              <div className="pl-8 text-muted-foreground">...</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Everything you need to learn code visually
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick examples */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground text-center mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Start with an example
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">Popular algorithms ready to explore</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {EXAMPLE_ALGORITHMS.map((ex) => (
            <Link
              key={ex.name}
              to="/playground"
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 hover:bg-card/80 transition-all group"
            >
              <div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{ex.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{ex.lang}</span>
              </div>
              <span className={`text-xs font-medium ${DIFFICULTY_COLORS[ex.difficulty]}`}>{ex.difficulty}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Built with AI · CodeLens © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Home;
