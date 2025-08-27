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
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-semibold text-lg">DriveEase</a>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Rent a Car Easily with DriveEase
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find the perfect car for your dates in just a few clicks.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-4 items-end bg-card border border-border p-4 rounded-lg shadow-sm">
            <div className="md:col-span-1">
              <label htmlFor="start" className="block text-sm mb-2">Start date</label>
              <Input id="start" type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} aria-label="Start date" />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="end" className="block text-sm mb-2">End date</label>
              <Input id="end" type="date" min={start || today} value={end} onChange={(e) => setEnd(e.target.value)} aria-label="End date" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full md:w-auto">Find Cars</Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Index;
