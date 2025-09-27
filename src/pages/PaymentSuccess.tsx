import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Calendar, Car, MapPin, Mail, Download } from "lucide-react";

export default function PaymentSuccess() {
  const [booking, setBooking] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        navigate("/");
        return;
      }

      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate("/auth");
          return;
        }
        setUser(session.user);

        // Get booking details
        const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId ? parseInt(bookingId) : 0)
          .eq("user_id", session.user.id)
          .single();

        if (bookingError) {
          throw bookingError;
        }

        setBooking(bookingData);

        // Get car details
        const { data: carData, error: carError } = await supabase
          .from("cars")
          .select("*")
          .eq("id", bookingData.car_id)
          .single();

        if (carError) {
          throw carError;
        }

        setCar(carData);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Fetching your booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">We couldn't find your booking details.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const days = Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500/20 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-primary bg-clip-text text-transparent mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your car rental has been confirmed. We've sent the details to your email.
          </p>
        </div>

        {/* Booking Confirmation Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6 animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Booking Confirmation
            </CardTitle>
            <CardDescription>Booking ID: #{booking.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Car Details */}
            <div className="flex gap-4">
              {car.images && car.images[0] && (
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {car.brand} {car.model}
                </h3>
                <p className="text-muted-foreground">{car.year}</p>
                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                  <span>{car.seats} seats</span>
                  <span>•</span>
                  <span>{car.transmission}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Rental Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pick-up Date</p>
                    <p className="font-medium">{new Date(booking.start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Drop-off Date</p>
                    <p className="font-medium">{new Date(booking.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{days} {days === 1 ? 'day' : 'days'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Rate:</span>
                <span>${car.price_per_day}/day</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{days} {days === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total Paid:</span>
                <span className="text-green-500">${parseFloat(booking.total_price).toFixed(2)}</span>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-500">Booking Confirmed</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your rental is confirmed and ready for pickup on {new Date(booking.start_date).toLocaleDateString()}.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 animate-slide-in-right">
          <Button
            size="lg"
            className="w-full"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />
            Print Confirmation
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="bg-secondary/30 border border-border/50 rounded-lg p-4 mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@carrental.com" className="text-primary hover:underline">
              support@carrental.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}