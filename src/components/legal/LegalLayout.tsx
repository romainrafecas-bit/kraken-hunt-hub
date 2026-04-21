import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import krakkenLogo from "@/assets/krakken-logo.png";

interface Props {
  title: string;
  updated?: string;
  children: React.ReactNode;
}

const LegalLayout = ({ title, updated, children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(230 50% 3%)" }}>
      <header
        className="px-6 md:px-8 h-16 flex items-center justify-between"
        style={{ borderBottom: "1px solid hsl(225 20% 7%)" }}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src={krakkenLogo}
            alt="Krakken"
            className="w-8 h-8 object-contain"
            style={{ filter: "drop-shadow(0 0 10px hsl(174 72% 46% / 0.5))" }}
          />
          <span className="kraken-title text-base font-black tracking-wider">KRAKKEN</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Accueil
        </Link>
      </header>

      <main className="flex-1 px-6 md:px-8 py-12 md:py-16">
        <article className="max-w-3xl mx-auto">
          <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-2">{title}</h1>
          {updated && (
            <p className="text-xs text-foreground/40 mb-10">Dernière mise à jour : {updated}</p>
          )}
          <div className="prose prose-invert max-w-none text-sm text-foreground/70 leading-relaxed space-y-6 [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-foreground/90 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-primary [&_a]:hover:underline [&_strong]:text-foreground/90">
            {children}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default LegalLayout;
