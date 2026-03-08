import logo from "@/assets/logo.png";

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="CodeLens logo" className="w-7 h-7" />
          <span className="text-base font-bold text-foreground tracking-tight">
            Code<span className="text-primary">Lens</span>
          </span>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-1">
            AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {["Home", "How It Works", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
