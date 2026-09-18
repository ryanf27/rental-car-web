import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const home = pathname === "/";

  const close = () => setOpen(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header ${scrolled || !home || open ? "site-header--solid" : ""}`}>
      <div className="site-header__inner page-shell">
        <Link className="brand" to="/" onClick={close} aria-label="Noir Motor Club home">
          <span className="brand__mark" aria-hidden="true">N</span>
          <span className="brand__name">NOIR <span>MOTOR CLUB</span>
          </span>
        </Link>

        <nav className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Main navigation">
          <Link to="/fleet" onClick={close}>Fleet</Link>
          <Link to={home ? "#experience" : "/#experience"} onClick={close}>Experience</Link>
          <Link to={home ? "#about" : "/#about"} onClick={close}>About</Link>
          <Link to={home ? "#contact" : "/#contact"} onClick={close}>Contact</Link>
          <Link className="site-nav__mobile-cta" to="/fleet" onClick={close}>Book now <ArrowUpRight size={16} />
          </Link>
        </nav>

        <Link className="header-cta" to="/fleet">Book now <ArrowUpRight size={16} strokeWidth={1.7} />
        </Link>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  );
}
