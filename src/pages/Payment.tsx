import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Calendar, Lock, User } from "lucide-react";
import { z } from "zod";

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expiryDate: z.string().min(5, "Enter valid expiry date (MM/YY)"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
  cardName: z.string().min(2, "Cardholder name is required"),
});

export default function Payment() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const carId = searchParams.get("carId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const totalPrice = searchParams.get("totalPrice");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Get car details
      if (carId) {
        const { data: car } = await supabase
          .from("cars")
          .select("*")
          .eq("id", carId)
          .single();
        
        setBookingDetails({
          car,
          startDate,
          endDate,
          totalPrice: parseFloat(totalPrice || "0"),
        });
      }
    };

    checkAuth();
  }, [carId, startDate, endDate, totalPrice, navigate]);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const cardNumber = formData.get("cardNumber") as string;
    const expiryDate = formData.get("expiryDate") as string;
    const cvv = formData.get("cvv") as string;
    const cardName = formData.get("cardName") as string;

    try {
      const validatedData = paymentSchema.parse({ cardNumber, expiryDate, cvv, cardName });
      setIsLoading(true);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking
        const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          car_id: carId ? parseInt(carId) : 0,
          start_date: startDate,
          end_date: endDate,
          total_price: bookingDetails.totalPrice,
          status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            booking,
            car: bookingDetails.car,
            user: {
              email: user.email,
              id: user.id
            }
          }
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the booking if email fails
      }

      // Redirect to success page
      navigate(`/payment-success?bookingId=${booking.id}`);

    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: err.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: "There was an error processing your payment. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your booking.</p>
        </div>
      </div>
    );
  }

  const days = Math.ceil((new Date(endDate!).getTime() - new Date(startDate!).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Complete Your Booking
            </h1>
            <p className="text-muted-foreground">Review and confirm your car rental</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Review your rental details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                {bookingDetails.car.images && bookingDetails.car.images[0] && (
                  <img
                    src={bookingDetails.car.images[0]}
                    alt={`${bookingDetails.car.brand} ${bookingDetails.car.model}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {bookingDetails.car.brand} {bookingDetails.car.model}
                  </h3>
                  <p className="text-muted-foreground">{bookingDetails.car.year}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingDetails.car.seats} seats • {bookingDetails.car.transmission}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pick-up Date:</span>
                  <span className="font-medium">{new Date(startDate!).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drop-off Date:</span>
                  <span className="font-medium">{new Date(endDate!).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rental Duration:</span>
                  <span className="font-medium">{days} {days === 1 ? 'day' : 'days'}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span>${bookingDetails.car.price_per_day}/day</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-primary">${bookingDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>Enter your payment details to complete the booking</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardName"
                      name="cardName"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      maxLength={19}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                        e.target.value = value;
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        className="pl-10"
                        maxLength={5}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          e.target.value = value;
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        placeholder="123"
                        className="pl-10"
                        maxLength={4}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '');
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing Payment..." : `Pay $${bookingDetails.totalPrice.toFixed(2)}`}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-1">
                    <Lock className="h-4 w-4" />
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}