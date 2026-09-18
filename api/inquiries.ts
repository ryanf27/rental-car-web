import { z } from "zod";
import { findVehicle } from "../src/data/fleet.ts";
import { getDatabase } from "../server/db.ts";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const inquirySchema = z.object({
  requestId: z.string().uuid(),
  carSlug: z.string().min(1).max(80),
  startDate: dateString,
  endDate: dateString,
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30).regex(/^[+\d()\s.-]+$/),
  message: z.string().trim().max(1000).default(""),
  website: z.string().max(200).default(""),
});

function json(data: unknown, status: number): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function validDate(value: string): Date | null {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response(null, { status: 405, headers: { Allow: "POST" } });
    }
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return json({ error: "Send JSON to submit an inquiry." }, 415);
    }

    let input: unknown;
    try {
      if (Number(request.headers.get("content-length")) > 10_000) return json({ error: "Request is too large." }, 413);
      const body = await request.text();
      if (body.length > 10_000) return json({ error: "Request is too large." }, 413);
      input = JSON.parse(body);
    } catch {
      return json({ error: "Invalid request body." }, 400);
    }

    const parsed = inquirySchema.safeParse(input);
    if (!parsed.success || parsed.data.website) {
      return json({ error: "Please check the inquiry details and try again." }, 422);
    }

    const data = parsed.data;
    const vehicle = findVehicle(data.carSlug);
    if (!vehicle) return json({ error: "That vehicle is no longer in the collection." }, 404);

    const start = validDate(data.startDate);
    const end = validDate(data.endDate);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const days = start && end ? Math.round((end.getTime() - start.getTime()) / 86_400_000) : 0;
    if (!start || !end || start < today || days < 1 || days > 30) {
      return json({ error: "Choose a future rental period of 1 to 30 days." }, 422);
    }

    const estimatedTotal = vehicle.dailyPrice * days;
    try {
      const db = await getDatabase();
      await db.execute({
        sql: `INSERT INTO inquiries (
          id, car_slug, car_name, customer_name, email, phone, start_date, end_date,
          message, daily_price_cents, estimated_total_cents
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
        args: [
          data.requestId, vehicle.slug, vehicle.name, data.customerName, data.email,
          data.phone, data.startDate, data.endDate, data.message,
          vehicle.dailyPrice * 100, estimatedTotal * 100,
        ],
      });
      return json({ reference: data.requestId, vehicle: vehicle.name, estimatedTotal }, 201);
    } catch (error) {
      console.error("Inquiry persistence failed", error);
      return json({ error: "We could not save your request. Please try again shortly." }, 503);
    }
  },
};
