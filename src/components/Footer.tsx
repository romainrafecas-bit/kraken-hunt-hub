import { Link } from "react-router-dom";
import krakkenLogo from "@/assets/krakken-logo.png";

const Footer = () => {
  return (
    <footer
      className="py-8 px-6 md:px-8"
      style={{
        borderTop: "1px solid hsl(225 20% 5%)",
        background: "hsl(230 50% 3%)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src={krakkenLogo}
            alt=""
            className="w-5 h-5 object-contain"
            style={{ opacity: 0.25, filter: "drop-shadow(0 0 4px hsl(174 72% 46% / 0.3))" }}
          />
          <span className="text-[11px] text-foreground/40">© {new Date().getFullYear()} Krakken</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-foreground/50">
          <Link to="/cgv" className="hover:text-primary transition-colors">CGV</Link>
          <span className="text-foreground/15">·</span>
          <Link to="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
          <span className="text-foreground/15">·</span>
          <Link to="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link>
          <span className="text-foreground/15">·</span>
          <a href="mailto:contact@krakken.io" className="hover:text-primary transition-colors">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
