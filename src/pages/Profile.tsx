import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User as UserIcon,
  Car as CarIcon,
  Calendar,
  Receipt,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";

interface Car {
  id: string;
  brand: string;
  model: string;
  images?: string[] | { urls?: string[] };
}

interface Booking {
  id: number;
  user_id: string;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status:
    | "pending_payment"
    | "confirmed"
    | "ongoing"
    | "completed"
    | "cancelled";
  created_at: string;
  cars: Car | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserDataAndHistory = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          user_id,
          car_id,
          start_date,
          end_date,
          total_price,
          status,
          created_at,
          cars (
            id,
            brand,
            model,
            images
          )
        `,
        )
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error Details:", error);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Could not load your booking history.",
        });
      } else if (bookingsData) {
        setBookings(bookingsData as unknown as Booking[]);
      }

      setIsLoading(false);
    };

    fetchUserDataAndHistory();
  }, [navigate, toast]);

  const canCancelBooking = (startDateStr: string, status: Booking["status"]): boolean => {
    if (status !== "confirmed" && status !== "pending_payment") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(startDateStr);
    return startDate > today;
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Cancel this reservation?"))
      return;

    setActionLoadingId(bookingId);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );

      toast({
        title: "Pemesanan Dibatalkan",
        description: "Reservasi kendaraan Anda telah berhasil dibatalkan.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        variant: "destructive",
        title: "Cancellation failed",
        description:
          message || "We could not cancel this reservation.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    const styles = {
      pending_payment: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      ongoing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      completed: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    };

    const labels = {
      pending_payment: "Pending Confirmation",
      confirmed: "Confirmed",
      ongoing: "Active Rental",
      completed: "Completed",
      cancelled: "Canceled",
    };

    return (
      <Badge
        variant="outline"
        className={`${styles[status]} font-medium py-1 px-2.5 rounded-md`}
      >
        {labels[status]}
      </Badge>
    );
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="portfolio-site"><SiteHeader /><main className="page-shell catalog-page">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My bookings
          </h1>
          <p className="text-muted-foreground">
            Your reservations and account details in one place.
          </p>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="bg-muted/60 backdrop-blur-sm p-1 border rounded-xl">
            <TabsTrigger value="history" className="rounded-lg px-4 py-2">
              Trip History
            </TabsTrigger>
            <TabsTrigger value="account" className="rounded-lg px-4 py-2">
              Profile Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {bookings.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-dashed p-12 text-center">
                <CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold">No bookings yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-1">
                  Your next memorable drive starts with the fleet.
                </p>
                <Button onClick={() => navigate("/")} className="mt-4">
                  Explore the fleet
                </Button>
              </Card>
            ) : (
              bookings.map((booking) => {
                const carImage =
                  Array.isArray(booking.cars?.images) ? booking.cars.images[0] : booking.cars?.images?.urls?.[0];

                return (
                  <Card
                    key={booking.id}
                    className="bg-card/60 backdrop-blur-sm border-border/40 overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      <div className="md:col-span-1 flex items-center gap-4">
                        <div className="h-16 w-16 bg-secondary/40 rounded-xl flex items-center justify-center border text-muted-foreground shrink-0 overflow-hidden">
                          {carImage ? (
                            <img
                              src={carImage}
                              alt="Car"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CarIcon className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base line-clamp-1">
                            {booking.cars?.brand || "Unknown"}{" "}
                            {booking.cars?.model || "Vehicle"}
                          </h4>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            ID: #{String(booking.id).substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">
                            Rental Duration
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          {new Date(booking.start_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}{" "}
                          - <br />
                          {new Date(booking.end_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Receipt className="h-4 w-4 text-primary" />
                          <span className="font-bold text-foreground text-base">
                            ${Number(booking.total_price).toFixed(2)}
                          </span>
                        </div>
                        <div>{getStatusBadge(booking.status)}</div>
                      </div>

                      <div className="flex flex-col md:items-end justify-center gap-2">
                        {booking.status === "pending_payment" && (
                          <Button
                            size="sm"
                            className="w-full md:w-32 bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={() =>
                              navigate(`/payment/${booking.id}`)
                            }
                          >
                            Review reservation
                          </Button>
                        )}

                        {canCancelBooking(
                          booking.start_date,
                          booking.status,
                        ) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoadingId === booking.id}
                            className="w-full md:w-32 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            {actionLoadingId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Cancel Booking"
                            )}
                          </Button>
                        ) : (
                          booking.status !== "cancelled" &&
                          booking.status !== "completed" && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1.5 rounded-lg border">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                              <span>Non-modifiable</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="account">
            <Card className="bg-card/60 backdrop-blur-sm border-border/40 max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" /> Account details
                </CardTitle>
                <CardDescription>
                  Your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    Account ID
                  </span>
                  <span className="text-sm font-mono col-span-2 text-foreground">
                    {user.id}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </span>
                  <span className="text-sm col-span-2 text-foreground">
                    {user.email}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Sign In
                  </span>
                  <span className="text-sm col-span-2 text-foreground">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main><SiteFooter /></div>
  );
}
