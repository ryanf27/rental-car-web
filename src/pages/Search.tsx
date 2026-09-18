import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";

interface InventoryCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  seats: number;
  price_per_day: number;
  images: string[] | { urls?: string[]; } | null;
  status: string;
}

function firstImage(images: InventoryCar["images"]): string | undefined {
  if (Array.isArray(images)) return images[0];
  return images?.urls?.[0];
}

export default function Search() {
  const [params] = useSearchParams();
  const [cars, setCars] = useState<InventoryCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Online reservations are temporarily unavailable.");
      setLoading(false);
      return;
    }
    let active = true;
    async function loadCars() {
      const { data, error: fetchError } = await supabase.from("cars").select("id,brand,model,year,transmission,seats,price_per_day,images,status").eq("status", "available");
      if (!active) return;
      if (fetchError) setError(fetchError.message);
      else setCars((data ?? []) as InventoryCar[]);
      setLoading(false);
    }
    void loadCars();
    return () => { active = false; };
  }, []);

  const visibleCars = useMemo(() => {
    const result = cars.filter((car) => `${car.brand} ${car.model}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === "price-low") result.sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day));
    if (sort === "price-high") result.sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day));
    return result;
  }, [cars, query, sort]);

  const dateNote = params.get("start") && params.get("end") ? `Your selected dates: ${params.get("start")} to ${params.get("end")}. Confirm dates during reservation.` : "Choose a vehicle, then select your dates during reservation.";

  return <div className="portfolio-site">
    <SiteHeader />
    <main className="page-shell catalog-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="gold-line" /> AVAILABLE TO RESERVE</p>
          <h1>The live <em>collection.</em>
          </h1>
        </div>
        <p>{dateNote}</p>
      </div>
      <div className="catalog-search">
        <input type="search" aria-label="Search vehicles" placeholder="Search make or model" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select aria-label="Sort vehicles" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Featured order</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>
      {loading && <p className="catalog-status" role="status">Loading available vehicles…</p>}
      {error && <div className="catalog-status catalog-error" role="alert">
        <p>We could not load live availability. {error}</p>
        <Link className="text-link" to="/">Return home <ArrowUpRight size={16} />
        </Link>
      </div>}
      {!loading && !error && visibleCars.length === 0 && <p className="catalog-status">No vehicles match your search. Try a different make or model.</p>}
      {!loading && !error && <div className="catalog-grid">{visibleCars.map((car) => <article className="catalog-card" key={car.id}>
        <img src={firstImage(car.images) ?? "/fleet/vehicle-placeholder.svg"} alt={`${car.brand} ${car.model}`} loading="lazy" decoding="async" />
        <div className="catalog-card__body">
          <p className="eyebrow">{car.brand.toUpperCase()}</p>
          <h2>{car.model}</h2>
          <div className="catalog-card__details">
            <span>{car.year}</span>
            <span>{car.transmission}</span>
            <span>{car.seats} seats</span>
          </div>
          <div className="catalog-card__bottom">
            <div>
              <strong>${Number(car.price_per_day).toLocaleString()}</strong>
              <span> / day</span>
            </div>
            <Link to={`/booking/${car.id}`}>Reserve <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </article>)}</div>}
    </main>
    <SiteFooter />
  </div>;
}
