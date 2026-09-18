import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/auth-context";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const home = pathname === "/";

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Link className="brand" to="/" onClick={close} aria-label="Noir Motor Club home">
          <span className="brand__mark" aria-hidden="true">N</span>
          <span className="brand__name">NOIR <span>MOTOR CLUB</span>
          </span>
        </Link>

        <nav className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Main navigation">
          <Link to="/" onClick={close}>Home</Link>
          <Link to="/search" onClick={close}>The fleet</Link>
          <Link to={home ? "#experience" : "/#experience"} onClick={close}>Experience</Link>
          <Link to={home ? "#contact" : "/#contact"} onClick={close}>Contact</Link>
          {user ? <Link to="/profile" onClick={close}>My bookings</Link> : <Link to="/auth" onClick={close}>Sign in</Link>}
          {user && <button type="button" onClick={() => { void signOut(); close(); }}>Sign out</button>}
          <Link className="site-nav__mobile-cta" to="/search" onClick={close}>Reserve a car <ArrowUpRight size={16} />
          </Link>
        </nav>

        <Link className="header-cta" to="/search">Reserve a car <ArrowUpRight size={16} strokeWidth={1.7} />
        </Link>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  );
}
