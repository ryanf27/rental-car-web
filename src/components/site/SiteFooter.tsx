import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-shell footer-main">
        <div>
          <Link className="brand" to="/" aria-label="Noir Motor Club home">
            <span className="brand__mark" aria-hidden="true">N</span>
            <span className="brand__name">NOIR <span>MOTOR CLUB</span>
            </span>
          </Link>
          <p>Extraordinary cars. Effortless escapes.</p>
        </div>
        <div className="footer-links">
          <span>EXPLORE</span>
          <Link to="/search">Our fleet</Link>
          <Link to="/#experience">The experience</Link>
          <Link to="/profile">My bookings</Link>
        </div>
        <div className="footer-links">
          <span>RESERVATIONS</span>
          <Link to="/search">Find your next drive <ArrowUpRight size={14} /></Link>
          <p>Browse live inventory and choose your dates.</p>
        </div>
      </div>
      <div className="page-shell footer-bottom">
        <span>© {new Date().getFullYear()} Noir Motor Club</span>
        <span>Crafted for the drive.</span>
      </div>
    </footer>
  );
}
