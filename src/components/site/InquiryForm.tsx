import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Vehicle } from "@/data/fleet";

interface InquiryResponse {
  reference?: string;
  error?: string;
}

function localToday(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function nextDay(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function InquiryForm({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate();
  const requestId = useRef(crypto.randomUUID());
  const sending = useRef(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const today = localToday();
  const days = startDate && endDate
    ? Math.round((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86_400_000)
    : 0;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (startDate < today || days < 1 || days > 30) {
      setError("Choose a future rental period of 1 to 30 days.");
      return;
    }
    const form = new FormData(event.currentTarget);
    sending.current = true;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.current,
          carSlug: vehicle.slug,
          startDate,
          endDate,
          customerName: form.get("customerName"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message") || "",
          website: form.get("website") || "",
        }),
      });
      const result = await response.json() as InquiryResponse;
      if (!response.ok || !result.reference) throw new Error(result.error || "We could not send your request.");
      navigate(`/confirmation/${result.reference}`, {
        state: { vehicleName: vehicle.name, startDate, endDate, estimatedTotal: vehicle.dailyPrice * days },
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send your request. Please try again.");
      sending.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form className="inquiry-form" onSubmit={(event) => void submit(event)}>
      <div className="inquiry-form__heading"><p className="eyebrow">YOUR NEXT DRIVE</p><h3>Request this car.</h3><p>No payment is collected. We'll review your dates and respond with the next steps.</p></div>
      <div className="inquiry-form__vehicle"><span>SELECTED VEHICLE</span><strong>{vehicle.name}</strong><span>FROM ${vehicle.dailyPrice.toLocaleString()} / DAY</span></div>
      <div className="form-row">
        <label>Pick-up date<input name="startDate" type="date" value={startDate} min={today} onChange={(event) => { setStartDate(event.target.value); setEndDate(""); }} required /></label>
        <label>Return date<input name="endDate" type="date" value={endDate} min={startDate ? nextDay(startDate) : today} onChange={(event) => setEndDate(event.target.value)} disabled={!startDate} required /></label>
      </div>
      <label>Full name<input name="customerName" type="text" autoComplete="name" minLength={2} maxLength={100} placeholder="Your name" required /></label>
      <div className="form-row">
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="tel" minLength={7} maxLength={30} placeholder="+1 555 010 0000" required /></label>
      </div>
      <label>Anything we should know? <span>(optional)</span><textarea name="message" rows={3} maxLength={1000} placeholder="Tell us about your plans" /></label>
      <label className="form-honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      {days > 0 && days <= 30 && <div className="inquiry-estimate"><span>Estimated rental · {days} {days === 1 ? "day" : "days"}</span><strong>${(vehicle.dailyPrice * days).toLocaleString()}</strong></div>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button-gold" type="submit" disabled={submitting}>{submitting ? "Sending request…" : "Send inquiry"}<ArrowUpRight size={18} /></button>
      <p className="form-footnote">Portfolio demonstration. Please use sample contact details; this request is stored for demonstration only.</p>
    </form>
  );
}
