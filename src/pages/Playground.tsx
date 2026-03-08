import Navbar from "@/components/Navbar";
import CodeExplainer from "@/components/CodeExplainer";
import AmbientBackground from "@/components/AmbientBackground";

const Playground = () => {
  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <AmbientBackground />
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        <CodeExplainer />
      </div>
    </div>
  );
};

export default Playground;
