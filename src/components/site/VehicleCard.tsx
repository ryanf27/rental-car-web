import { Link } from "react-router-dom";
import { ArrowUpRight, Gauge, Settings2, Users } from "lucide-react";
import type { ShowcaseVehicle } from "@/data/fleet";

export function VehicleCard({ car, index }: { car: ShowcaseVehicle; index: number; }) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card__image">
        <img src={car.image} alt={car.imageAlt} loading="lazy" decoding="async" />
        <span>0{index + 1} / {car.category}</span>
      </div>
      <div className="vehicle-card__content">
        <div className="vehicle-card__heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h3>{car.name}</h3>
          </div>
          <p className="vehicle-card__price">From <strong>${car.price.toLocaleString()}</strong>
            <span> / day</span>
          </p>
        </div>
        <div className="vehicle-card__specs">
          <span>
            <Gauge size={16} /> {car.horsepower} HP</span>
          <span>
            <Settings2 size={16} /> {car.transmission}</span>
          <span>
            <Users size={16} /> {car.seats} seats</span>
        </div>
        <Link className="vehicle-card__link" to="/search">Explore availability <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
