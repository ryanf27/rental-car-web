import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";

export default function NotFound() {
  return <div className="portfolio-site">
    <SiteHeader />
    <main className="page-shell not-found">
      <p className="eyebrow">
        <span className="gold-line" /> OFF ROUTE</p>
      <h1>Road <em>not found.</em>
      </h1>
      <p>That page isn't on the map. The collection is just a turn away.</p>
      <Link className="button-gold" to="/">Return home <ArrowUpRight size={18} />
      </Link>
    </main>
    <SiteFooter />
  </div>;
}
