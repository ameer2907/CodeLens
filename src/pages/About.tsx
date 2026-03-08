import { motion } from "framer-motion";
import { Brain, Code2, GitFork, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";

const About = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AmbientBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              About CodeLens AI
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              CodeLens AI is an interactive code learning platform that transforms static code into visual, animated walkthroughs. Whether you're a beginner learning algorithms or an experienced developer reviewing unfamiliar code, CodeLens makes understanding code intuitive and engaging.
            </p>

            <div className="space-y-6">
              {[
                { icon: Brain, title: "AI-Powered Analysis", desc: "Our AI engine breaks down any code snippet into logical execution steps, identifying loops, conditions, function calls, and variable mutations with precision." },
                { icon: Code2, title: "Interactive Playground", desc: "Paste code in any supported language and watch it come alive with synchronized line highlighting, animated step cards, and real-time variable tracking." },
                { icon: GitFork, title: "Visual Flowcharts", desc: "Auto-generated Mermaid.js diagrams map your code's control flow, making it easy to understand branching logic and loop structures." },
                { icon: BarChart3, title: "Complexity Insights", desc: "Instant Big-O analysis with actionable optimization suggestions helps you write more efficient code." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex gap-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:border-primary/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Supported languages: Python, JavaScript, TypeScript, Java, C++, Go, Rust, Ruby
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
