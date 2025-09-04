import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      toast({ title: "Dates required", description: "Please select start and end dates." });
      return;
    }
    if (end < start) {
      toast({ title: "Invalid range", description: "End date must be after start date." });
      return;
    }
    const params = new URLSearchParams({ start, end }).toString();
    navigate(`/search?${params}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-primary">DriveEase</a>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.05),hsl(var(--accent)/0.1))]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Drive Your Dreams
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Discover premium cars for every journey. From city adventures to weekend getaways.
              </p>
            </div>

            {/* Enhanced Search Form */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={onSubmit} className="bg-card/90 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-[0_20px_40px_-10px_hsl(var(--primary)/0.1)] hover:shadow-[0_25px_50px_-10px_hsl(var(--primary)/0.15)] transition-all duration-300">
                <div className="grid gap-6 md:grid-cols-3 items-end">
                  <div className="space-y-2">
                    <label htmlFor="start" className="block text-sm font-medium text-foreground">Pickup Date</label>
                    <Input 
                      id="start" 
                      type="date" 
                      min={today} 
                      value={start} 
                      onChange={(e) => setStart(e.target.value)} 
                      aria-label="Start date"
                      className="h-12 text-base border-border/60 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="end" className="block text-sm font-medium text-foreground">Return Date</label>
                    <Input 
                      id="end" 
                      type="date" 
                      min={start || today} 
                      value={end} 
                      onChange={(e) => setEnd(e.target.value)} 
                      aria-label="End date"
                      className="h-12 text-base border-border/60 focus:border-primary transition-colors"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="h-12 text-base font-semibold px-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Find Your Car
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background/50">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-muted-foreground">Quick and hassle-free car reservations in just a few clicks</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
                <p className="text-muted-foreground">Wide selection of well-maintained, modern vehicles</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                <p className="text-muted-foreground">Competitive rates with transparent pricing and no hidden fees</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
