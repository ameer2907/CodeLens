import Navbar from "@/components/Navbar";
import CodeExplainer from "@/components/CodeExplainer";

const Playground = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      <CodeExplainer />
    </div>
  );
};

export default Playground;
