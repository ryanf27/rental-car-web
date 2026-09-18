import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth-context";
import { useToast } from "@/hooks/use-toast";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";

interface BookingRecord {
  id: number;
  user_id: string;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

interface CarRecord {
  id: number;
  brand: string;
  model: string;
  year: number;
  seats: number;
  transmission: string;
  price_per_day: number;
  images: string[] | { urls?: string[]; } | null;
}

export default function Payment() {
  const { bookingId } = useParams<{ bookingId: string; }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [car, setCar] = useState<CarRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!bookingId) { navigate("/search"); return; }
    let active = true;
    async function load() {
      const { data: bookingData, error: bookingError } = await supabase.from("bookings").select("id,user_id,car_id,start_date,end_date,total_price,status").eq("id", bookingId).eq("user_id", user!.id).single();
      if (!active) return;
      if (bookingError || !bookingData) { setError("We could not find this reservation."); setLoading(false); return; }
      const { data: carData, error: carError } = await supabase.from("cars").select("id,brand,model,year,seats,transmission,price_per_day,images").eq("id", bookingData.car_id).single();
      if (!active) return;
      if (carError || !carData) setError("Vehicle details are unavailable right now.");
      else { setBooking(bookingData as BookingRecord); setCar(carData as CarRecord); }
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [authLoading, user, bookingId, navigate]);

  async function confirm() {
    if (!booking || !car || !user || submitting) return;
    setSubmitting(true);
    const { error: updateError } = await supabase.from("bookings").update({ status: "confirmed" }).eq("id", booking.id).eq("user_id", user.id).eq("status", "pending_payment").select("id").single();
    if (updateError) {
      toast({ variant: "destructive", title: "Could not confirm", description: updateError.message });
      setSubmitting(false);
      return;
    }
    try {
      await supabase.functions.invoke("send-booking-confirmation", { body: { booking: { ...booking, status: "confirmed" }, car, user: { email: user.email, id: user.id } } });
    } catch (emailError) {
      console.error("Confirmation email could not be sent:", emailError);
    }
    navigate(`/payment-success?bookingId=${booking.id}`);
  }

  const image = Array.isArray(car?.images) ? car.images[0] : car?.images?.urls?.[0];
  const days = booking ? Math.max(1, Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 86400000)) : 0;

  return <div className="portfolio-site">
    <SiteHeader />
    <main className="page-shell catalog-page reservation-page">
      <Link to="/search" className="text-link">
        <ArrowLeft size={16} /> Back to the fleet</Link>
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="gold-line" /> YOUR RESERVATION</p>
          <h1>Review the <em>details.</em>
          </h1>
        </div>
      </div>
      {loading && <p className="catalog-status" role="status">
        <Loader2 className="inline mr-2 animate-spin" size={18} /> Loading reservation…</p>}
      {error && <p className="catalog-status catalog-error" role="alert">{error}</p>}
      {!loading && booking && car && <div className="reservation-layout">
        <div className="reservation-vehicle">
          <img src={image ?? "/fleet/vehicle-placeholder.svg"} alt={`${car.brand} ${car.model}`} />
          <div>
            <p className="eyebrow">YOUR DRIVE</p>
            <h2>{car.brand} {car.model}</h2>
            <p>{car.year} · {car.transmission} · {car.seats} seats</p>
          </div>
        </div>
        <div className="reservation-summary">
          <h2>Reservation summary</h2>
          <div>
            <span>
              <CalendarDays size={17} /> Pick up</span>
            <strong>{new Date(`${booking.start_date}T12:00:00`).toLocaleDateString()}</strong>
          </div>
          <div>
            <span>
              <CalendarDays size={17} /> Return</span>
            <strong>{new Date(`${booking.end_date}T12:00:00`).toLocaleDateString()}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{days} {days === 1 ? "day" : "days"}</strong>
          </div>
          <div className="reservation-summary__total">
            <span>Estimated rental total</span>
            <strong>${Number(booking.total_price).toLocaleString()}</strong>
          </div>
          <p>Confirming this reservation does not charge a payment method. Your booking will appear in your account.</p>
          <button className="button-gold" type="button" onClick={() => void confirm()} disabled={submitting || booking.status !== "pending_payment"}>{submitting ? "Confirming…" : booking.status === "confirmed" ? "Already confirmed" : "Confirm reservation"} <Check size={17} />
          </button>
        </div>
      </div>}
    </main>
    <SiteFooter />
  </div>;
}
