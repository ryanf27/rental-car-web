import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  seats: number;
  price_per_day: string | number;
  images?: any;
}

const Search = () => {
  const [params] = useSearchParams();
  const start = params.get("start") || "";
  const end = params.get("end") || "";

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchCars = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
      if (ignore) return;
      if (error) {
        setError(error.message);
      } else {
        setCars(data || []);
      }
      setLoading(false);
    };
    fetchCars();
    return () => { ignore = true; };
  }, [start, end]);

  const periodText = useMemo(() => {
    if (!start || !end) return "";
    return ` for ${start} to ${end}`;
  }, [start, end]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">DriveEase</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Cars{periodText}</h1>
          <p className="text-muted-foreground mb-8">Showing available models. Availability by date will be refined during checkout.</p>
        </section>

        {loading && (
          <p className="text-muted-foreground">Loading cars...</p>
        )}
        {error && (
          <p className="text-destructive">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.length === 0 ? (
              <p className="text-muted-foreground">No cars found.</p>
            ) : (
              cars.map((car) => {
                const imgs: string[] = Array.isArray(car.images)
                  ? car.images
                  : Array.isArray(car.images?.urls)
                    ? car.images.urls
                    : [];
                const imgSrc = imgs[0] || "/placeholder.svg";
                return (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img src={imgSrc} alt={`${car.brand} ${car.model} rental car`} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{car.brand} {car.model}</span>
                        <span className="text-sm text-muted-foreground">{car.year}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span>{car.transmission} • {car.seats} seats</span>
                        <span className="font-semibold">${typeof car.price_per_day === 'string' ? car.price_per_day : car.price_per_day.toFixed?.(2)}/day</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
