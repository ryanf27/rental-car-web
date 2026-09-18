import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { showcaseFleet, type Category } from "@/data/fleet";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VehicleCard } from "@/components/site/VehicleCard";
import "@/portfolio.css";

const categories: Array<Category | "All"> = ["All", "Supercar", "Luxury", "Sport", "SUV"];
const categoryDetails = [
  ["01", "Supercar", "Unfiltered exhilaration."],
  ["02", "Luxury", "Quiet confidence, everywhere."],
  ["03", "Sport", "Built for the open road."],
  ["04", "SUV", "Room to move differently."],
] as const;

export default function Index() {
  const { hash } = useLocation();
  const [category, setCategory] = useState<Category | "All">("All");
  const visibleCars = category === "All" ? showcaseFleet : showcaseFleet.filter((car) => car.category === category);

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <div className="portfolio-site">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero__image" src="/fleet/hero-showroom.webp" alt="Black exotic supercar in a cinematic showroom" fetchPriority="high" />
          <div className="hero__shade" />
          <div className="page-shell hero__content">
            <p className="eyebrow hero__eyebrow">
              <span className="gold-line" /> THE ART OF ARRIVING</p>
            <h1 id="hero-title">Luxury without limits.<br />
              <em>Drive the extraordinary.</em>
            </h1>
            <p className="hero__intro">Exceptional machines. Impeccable service. Every journey deserves to feel unforgettable.</p>
            <div className="hero__actions">
              <a className="button-gold" href="#fleet">Explore the fleet <ArrowUpRight size={18} />
              </a>
              <Link className="button-outline" to="/search">Book a car <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="page-shell hero__bottom">
            <a href="#fleet" aria-label="Scroll to featured fleet">SCROLL TO EXPLORE <ArrowDown size={15} />
            </a>
            <div>
              <span>01 / 04</span>
              <span className="hero__progress" />
            </div>
            <p>CURATED FOR THE UNFORGETTABLE</p>
          </div>
        </section>

        <section className="intro-strip" aria-label="Our promise">
          <div className="page-shell intro-strip__inner">
            <span>DRIVE BEYOND ORDINARY</span>
            <span className="intro-strip__divider" />
            <p>From the first glance to the final mile, every detail is considered.</p>
            <span className="intro-strip__star">✳</span>
          </div>
        </section>

        <section className="section fleet-section page-shell" id="fleet" aria-labelledby="fleet-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="gold-line" /> THE FLEET</p>
              <h2 id="fleet-title">Machines worth <em>the moment.</em>
              </h2>
            </div>
            <p>From raw performance to refined comfort, discover a drive made for your next chapter.</p>
          </div>
          <div className="fleet-toolbar">
            <div className="category-tabs" role="group" aria-label="Filter by vehicle category">{categories.map((item) => <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <Link to="/search" className="text-link">View live inventory <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="fleet-grid">{visibleCars.map((car) => <VehicleCard key={car.name} car={car} index={showcaseFleet.indexOf(car)} />)}</div>
          <p className="fleet-note">Showcase models and rates are illustrative. Live availability and final pricing are shown during reservation.</p>
        </section>

        <section className="categories-section" aria-labelledby="categories-title">
          <div className="page-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span className="gold-line" /> FIND YOUR DRIVE</p>
                <h2 id="categories-title">Every mood has <em>a machine.</em>
                </h2>
              </div>
              <p>Choose the character of your journey.</p>
            </div>
            <div className="category-grid">
              {categoryDetails.map(([number, name, copy]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setCategory(name);
                    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    document.getElementById("fleet")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                  }}
                >
                  <span>{number}</span>
                  <div><h3>{name}</h3><p>{copy}</p></div>
                  <ArrowUpRight size={21} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section experience-section page-shell" id="experience" aria-labelledby="experience-title">
          <div className="experience-image">
            <img src="/fleet/graphite-gt.webp" alt="Graphite sports coupe under showroom lighting" loading="lazy" decoding="async" />
            <span>THE NOIR STANDARD / 001</span>
          </div>
          <div className="experience-content">
            <p className="eyebrow">
              <span className="gold-line" /> WHY DRIVE WITH US</p>
            <h2 id="experience-title">Beyond the keys.<br />
              <em>Beyond expectation.</em>
            </h2>
            <p className="experience-lead">The best drives begin long before the engine starts. We make every detail feel effortless.</p>
            <div className="experience-benefits">
              <div>
                <Sparkles size={20} />
                <div>
                  <h3>Curated collection</h3>
                  <p>Distinctive vehicles, selected for the feeling they leave behind.</p>
                </div>
              </div>
              <div>
                <ShieldCheck size={20} />
                <div>
                  <h3>Confidence included</h3>
                  <p>Every vehicle is prepared and inspected before your journey.</p>
                </div>
              </div>
              <div>
                <Clock3 size={20} />
                <div>
                  <h3>On your schedule</h3>
                  <p>Flexible reservations and a personal handover experience.</p>
                </div>
              </div>
            </div>
            <Link className="text-link" to="/search">Find your next drive <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

        <section className="process-section" aria-labelledby="process-title">
          <div className="page-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span className="gold-line" /> THE EXPERIENCE</p>
                <h2 id="process-title">The road is yours <em>in three steps.</em>
                </h2>
              </div>
            </div>
            <div className="process-grid">
              <article>
                <span>01</span>
                <KeyRound size={27} />
                <h3>Choose your car</h3>
                <p>Explore the collection and find the machine that fits your moment.</p>
              </article>
              <article>
                <span>02</span>
                <Check size={27} />
                <h3>Reserve with ease</h3>
                <p>Select your dates and review the details before confirming.</p>
              </article>
              <article>
                <span>03</span>
                <ArrowRight size={27} />
                <h3>Take the wheel</h3>
                <p>Arrive, collect your keys, and make the road your own.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="feature-section" aria-labelledby="feature-title">
          <div className="feature-section__image" />
          <div className="page-shell feature-section__inner">
            <div className="feature-section__copy">
              <p className="eyebrow">
                <span className="gold-line" /> THE SIGNATURE DRIVE</p>
              <h2 id="feature-title">A presence<br />you can <em>feel.</em>
              </h2>
              <p>Meet the Apex V12: sculpted to turn every arrival into an occasion. A commanding silhouette and uncompromising performance define the collection’s most exhilarating statement.</p>
              <div className="feature-specs">
                <div>
                  <strong>720</strong>
                  <span>HORSEPOWER</span>
                </div>
                <div>
                  <strong>2</strong>
                  <span>SEATS</span>
                </div>
                <div>
                  <strong>V12</strong>
                  <span>ENGINE</span>
                </div>
              </div>
              <Link className="button-outline" to="/search">Explore availability <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="booking-cta page-shell" aria-labelledby="booking-title">
          <p className="eyebrow">THE NEXT CHAPTER IS YOURS</p>
          <h2 id="booking-title">Make the journey <em>the destination.</em>
          </h2>
          <p>Reserve your next extraordinary drive.</p>
          <Link className="button-gold" to="/search">Explore live availability <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
