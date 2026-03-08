import Navbar from "@/components/Navbar";
import CodeExplainer from "@/components/CodeExplainer";
import { useTheme } from "@/hooks/use-theme";

const Playground = () => {
  const { theme } = useTheme();

  return (
    <div className="h-screen flex flex-col bg-background relative">
      {/* Subtle ambient glow behind editor area */}
      <div className={`absolute inset-0 pointer-events-none ${theme === "dark" ? "bg-ambient-dark" : "bg-ambient-light"}`} />
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        <CodeExplainer />
      </div>
    </div>
  );
};

export default Playground;
