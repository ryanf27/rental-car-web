import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Check, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth-context";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";

interface BookingRecord {
  id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}
interface CarRecord {
  brand: string;
  model: string;
  images: string[] | { urls?: string[]; } | null;
}

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [car, setCar] = useState<CarRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!bookingId) { navigate("/profile"); return; }
    let active = true;
    async function load() {
      const { data: bookingData } = await supabase.from("bookings").select("id,car_id,start_date,end_date,total_price,status").eq("id", bookingId).eq("user_id", user!.id).single();
      if (!active) return;
      if (bookingData) {
        setBooking(bookingData as BookingRecord);
        const { data: carData } = await supabase.from("cars").select("brand,model,images").eq("id", bookingData.car_id).single();
        if (active && carData) setCar(carData as CarRecord);
      }
      if (active) setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [authLoading, bookingId, user, navigate]);

  const image = Array.isArray(car?.images) ? car.images[0] : car?.images?.urls?.[0];
  const confirmed = booking?.status === "confirmed";

  return <div className="portfolio-site">
    <SiteHeader />
    <main className="page-shell catalog-page confirmation-page">
      {loading ? <p className="catalog-status" role="status">Loading reservation…</p> : !booking ? <div className="catalog-status">
        <p>We could not find that reservation.</p>
        <Link className="text-link" to="/profile">View my bookings <ArrowUpRight size={16} />
        </Link>
      </div> : <>
        <div className="confirmation-heading">
          <span>
            <Check size={34} />
          </span>
          <p className="eyebrow">RESERVATION #{booking.id}</p>
          <h1>{confirmed ? "Your drive is" : "Reservation"} <em>{confirmed ? "confirmed." : "received."}</em>
          </h1>
          <p>Your reservation details are below. We look forward to welcoming you.</p>
        </div>
        <div className="confirmation-card">{image && <img src={image} alt={`${car?.brand ?? "Rental"} ${car?.model ?? "car"}`} />}<div>
          <p className="eyebrow">YOUR VEHICLE</p>
          <h2>{car ? `${car.brand} ${car.model}` : "Your vehicle"}</h2>
          <dl>
            <div>
              <dt>Pick up</dt>
              <dd>{new Date(`${booking.start_date}T12:00:00`).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Return</dt>
              <dd>{new Date(`${booking.end_date}T12:00:00`).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Estimated rental total</dt>
              <dd>${Number(booking.total_price).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
        </div>
        <div className="confirmation-actions">
          <Link className="button-gold" to="/profile">View my bookings <ArrowUpRight size={18} />
          </Link>
          <button className="button-outline" type="button" onClick={() => window.print()}>Print details <Printer size={17} />
          </button>
        </div>
      </>}
    </main>
    <SiteFooter />
  </div>;
}
