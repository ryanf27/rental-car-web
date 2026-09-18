import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Gauge, Settings2, Users, Waypoints } from "lucide-react";
import { fleet, findVehicle } from "@/data/fleet";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VehicleCard } from "@/components/site/VehicleCard";
import NotFound from "./NotFound";
import "@/portfolio.css";

export default function VehicleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const car = findVehicle(slug ?? "");
  if (!car) return <NotFound />;

  const related = fleet.filter((item) => item.slug !== car.slug && item.category === car.category).slice(0, 2);
  if (related.length < 2) {
    related.push(...fleet.filter((item) => item.slug !== car.slug && !related.includes(item)).slice(0, 2 - related.length));
  }

  return (
    <div className="portfolio-site">
      <SiteHeader />
      <main>
        <section className="detail-hero" aria-labelledby="vehicle-title">
          <img src={car.image} alt={car.imageAlt} fetchPriority="high" />
          <div className="detail-hero__shade" />
          <div className="page-shell detail-hero__content">
            <Link className="detail-back" to="/fleet"><ArrowLeft size={16} /> Back to the fleet</Link>
            <p className="eyebrow"><span className="gold-line" /> {car.category.toUpperCase()} / {car.year}</p>
            <h1 id="vehicle-title">{car.brand}<br /><em>{car.model}</em></h1>
            <p>From <strong>${car.dailyPrice.toLocaleString()}</strong> / day</p>
            <a className="button-gold" href="#reserve">Request this car <ArrowUpRight size={18} /></a>
          </div>
        </section>

        <div className="page-shell detail-specs" aria-label="Vehicle specifications">
          <div><Gauge size={20} /><span>POWER</span><strong>{car.horsepower} HP</strong></div>
          <div><Settings2 size={20} /><span>TRANSMISSION</span><strong>{car.transmission}</strong></div>
          <div><Waypoints size={20} /><span>DRIVETRAIN</span><strong>{car.drivetrain}</strong></div>
          <div><Users size={20} /><span>CAPACITY</span><strong>{car.seats} seats</strong></div>
        </div>

        <section className="page-shell detail-story">
          <div>
            <p className="eyebrow"><span className="gold-line" /> THE MACHINE</p>
            <h2>Made for <em>the moment.</em></h2>
          </div>
          <div>
            <p className="detail-story__lead">{car.description}</p>
            <div className="detail-features">
              <h3>THE RENTAL EXPERIENCE</h3>
              {car.features.map((feature) => <span key={feature}>{feature}</span>)}
            </div>
          </div>
        </section>

        <section className="detail-booking" id="reserve">
          <div className="page-shell detail-booking__inner">
            <div className="detail-booking__copy">
              <p className="eyebrow"><span className="gold-line" /> MAKE IT YOURS</p>
              <h2>The road<br />is <em>waiting.</em></h2>
              <p>Tell us when you want to drive. We'll take care of the details from there.</p>
              <img src={car.image} alt="" loading="lazy" decoding="async" />
            </div>
            <InquiryForm vehicle={car} />
          </div>
        </section>

        <section className="page-shell section related-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span className="gold-line" /> KEEP EXPLORING</p>
              <h2>More to <em>discover.</em></h2>
            </div>
            <Link className="text-link" to="/fleet">The full collection <ArrowUpRight size={17} /></Link>
          </div>
          <div className="fleet-grid">
            {related.map((item) => <VehicleCard key={item.slug} car={item} index={fleet.indexOf(item)} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
