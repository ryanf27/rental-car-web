import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { fleet, type Category } from "@/data/fleet";
import { VehicleCard } from "@/components/site/VehicleCard";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";

const categories: Array<Category | "All"> = ["All", "Supercar", "Sports", "Luxury", "SUV"];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const category = categories.find((item) => item === params.get("category")) ?? "All";
  const sort = params.get("sort") === "price-low" || params.get("sort") === "price-high" || params.get("sort") === "newest"
    ? params.get("sort")!
    : "featured";

  const cars = useMemo(() => {
    const filtered = fleet.filter((car) => category === "All" || car.category === category);
    if (sort === "price-low") filtered.sort((a, b) => a.dailyPrice - b.dailyPrice);
    if (sort === "price-high") filtered.sort((a, b) => b.dailyPrice - a.dailyPrice);
    if (sort === "newest") filtered.sort((a, b) => b.year - a.year);
    return filtered;
  }, [category, sort]);

  function updateParam(name: string, value: string) {
    const next = new URLSearchParams(params);
    if (value === "All" || value === "featured") next.delete(name);
    else next.set(name, value);
    setParams(next);
  }

  return (
    <div className="portfolio-site">
      <SiteHeader />
      <main className="page-shell catalog-page">
        <div className="section-heading catalog-heading">
          <div>
            <p className="eyebrow"><span className="gold-line" /> THE COLLECTION</p>
            <h1>Choose your <em>next drive.</em></h1>
          </div>
          <p>Six distinctive machines. One unforgettable way to arrive.</p>
        </div>
        <div className="fleet-toolbar catalog-toolbar">
          <div className="category-tabs" role="group" aria-label="Filter by vehicle category">
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => updateParam("category", item)}>{item}</button>
            ))}
          </div>
          <label className="fleet-sort">SORT BY
            <select value={sort} onChange={(event) => updateParam("sort", event.target.value)} aria-label="Sort vehicles">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>
        <div className="fleet-grid catalog-fleet">
          {cars.map((car) => <VehicleCard key={car.slug} car={car} index={fleet.indexOf(car)} />)}
        </div>
        <div className="catalog-outro"><p>Every journey begins with the right car.</p><a href="/#experience">Discover the Noir experience <ArrowUpRight size={17} /></a></div>
      </main>
      <SiteFooter />
    </div>
  );
}
