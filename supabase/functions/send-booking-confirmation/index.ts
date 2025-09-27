import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  booking: {
    id: number;
    start_date: string;
    end_date: string;
    total_price: string;
    status: string;
  };
  car: {
    brand: string;
    model: string;
    year: number;
    seats: number;
    transmission: string;
    price_per_day: string;
  };
  user: {
    email: string;
    id: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking, car, user }: BookingConfirmationRequest = await req.json();

    console.log("Sending booking confirmation for:", booking.id);

    const startDate = new Date(booking.start_date).toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const endDate = new Date(booking.end_date).toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const days = Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24));

    const emailResponse = await resend.emails.send({
      from: "CarRental Pro <onboarding@resend.dev>",
      to: [user.email],
      subject: `Booking Confirmation - ${car.brand} ${car.model}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .car-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .status-confirmed { background: #dcfce7; color: #166534; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #666; }
            .price-highlight { font-size: 24px; font-weight: bold; color: #059669; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .label { font-weight: bold; color: #374151; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚗 Booking Confirmed!</h1>
            <p>Your car rental is all set and ready to go</p>
          </div>
          
          <div class="content">
            <div class="status-confirmed">
              ✅ Booking #${booking.id} - CONFIRMED
            </div>
            
            <div class="car-details">
              <h2>Vehicle Details</h2>
              <h3>${car.brand} ${car.model} (${car.year})</h3>
              <p><strong>Transmission:</strong> ${car.transmission}</p>
              <p><strong>Seats:</strong> ${car.seats} passengers</p>
              <p><strong>Daily Rate:</strong> $${car.price_per_day}/day</p>
            </div>
            
            <div class="booking-details">
              <h2>Rental Details</h2>
              <table>
                <tr>
                  <td class="label">Booking ID:</td>
                  <td>#${booking.id}</td>
                </tr>
                <tr>
                  <td class="label">Pick-up Date:</td>
                  <td>${startDate}</td>
                </tr>
                <tr>
                  <td class="label">Drop-off Date:</td>
                  <td>${endDate}</td>
                </tr>
                <tr>
                  <td class="label">Duration:</td>
                  <td>${days} ${days === 1 ? 'day' : 'days'}</td>
                </tr>
                <tr>
                  <td class="label">Total Amount:</td>
                  <td class="price-highlight">$${parseFloat(booking.total_price).toFixed(2)}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📋 What's Next?</h3>
              <ul>
                <li>Bring a valid driver's license and credit card</li>
                <li>Arrive 15 minutes before your scheduled pick-up time</li>
                <li>Vehicle inspection will be conducted before handover</li>
                <li>Keep this confirmation email for your records</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>📞 Need to modify or cancel?</h4>
              <p>Contact our support team at <a href="mailto:support@carrental.com">support@carrental.com</a> or call us at (555) 123-4567</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing CarRental Pro!</p>
            <p>Drive safe and enjoy your journey 🚗💨</p>
            <p style="font-size: 12px; color: #888;">
              This is an automated confirmation email. Please do not reply directly to this message.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);