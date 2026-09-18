import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/auth-context";
import { useToast } from "@/hooks/use-toast";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";
import {
  Calendar as CalendarIcon,
  Car as CarIcon,
  ArrowLeft,
  Loader2,
  Info,
} from "lucide-react";

interface Car {
  id: string;
  brand: string;
  model: string;
  price_per_day: number;
  created_at?: string;
}

export default function Booking() {
  const { carId } = useParams<{ carId: string }>();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState<string>(params.get("start") ?? "");
  const [endDate, setEndDate] = useState<string>(params.get("end") ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState(false);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) return;

      const { data } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .eq("status", "available")
        .single();

      if (data) setCar(data as Car);
      else setLoadError(true);
    };

    fetchCar();
  }, [carId]);

  const calculateDays = (): number => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();
  const totalPrice = days * (car?.price_per_day || 0);

  const handleConfirm = async () => {
    if (!car) return;
    if (!user) {
      const returnPath = `/booking/${carId}?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
      navigate(`/auth?returnTo=${encodeURIComponent(returnPath)}`);
      return;
    }

    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Please select both start and end dates.",
      });
      return;
    }

    if (startDate < today || new Date(endDate) <= new Date(startDate)) {
      toast({
        variant: "destructive",
        title: "Invalid Dates",
        description: "Choose a future rental period with an end date after the start date.",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: "pending_payment",
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message,
      });
      return;
    }

    if (data) {
      toast({
        title: "Success",
        description:
          "Review your reservation details to confirm.",
      });

      navigate(`/payment/${data.id}`);
    }
  };

  if (loadError) return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3"><p>Vehicle details are unavailable.</p><Button onClick={() => navigate("/search")}>Back to the fleet</Button></div>;

  if (!car) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          Loading vehicle information...
        </p>
      </div>
    );
  }

  return (
    <div className="portfolio-site"><SiteHeader /><main className="page-shell catalog-page booking-page">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/search")}
          className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Booking Form Card */}
        <Card className="overflow-hidden bg-card/60 backdrop-blur-md border-border/40 rounded-2xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <CarIcon className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Choose Your Dates
              </CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground">
              Reserve the {car.brand} {car.model} for your next drive.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            {/* Start Date Input */}
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                min={today}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value >= endDate) {
                    setEndDate("");
                  }
                }}
              />
            </div>

            {/* End Date Input */}
            <div className="space-y-2">
              <label htmlFor="end-date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                min={startDate || today}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!startDate}
              />
            </div>

            <Separator className="my-2" />

            {/* Pricing Breakdown */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rental Duration:</span>
                <span className="font-medium text-foreground">
                  {days} {days <= 1 ? "Day" : "Days"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per Day:</span>
                <span className="font-medium text-foreground">
                  ${car.price_per_day}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="text-base font-semibold">Estimated Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${totalPrice}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p>
                Please review your dates before confirming the reservation. No payment is collected online.
              </p>
            </div>
          </CardContent>

          <CardFooter className="pb-6 pt-2">
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full h-11 text-base font-medium rounded-xl shadow-md transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Booking...
                </>
              ) : (
                "Review Reservation"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main><SiteFooter /></div>
  );
}
