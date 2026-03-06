import logo from "@/assets/logo.png";

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="CodeLens logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-foreground">
            Code<span className="text-primary">Lens</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Home", "How It Works", "About", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
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
