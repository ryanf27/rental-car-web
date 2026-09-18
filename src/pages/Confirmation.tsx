import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "@/portfolio.css";

interface ConfirmationState {
  vehicleName: string;
  startDate: string;
  endDate: string;
  estimatedTotal: number;
}

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();
  const state = useLocation().state as ConfirmationState | null;
  const justSubmitted = Boolean(state && id);

  return (
    <div className="portfolio-site">
      <SiteHeader />
      <main className="page-shell confirmation-page catalog-page">
        <div className="confirmation-heading">
          <span><Check size={34} /></span>
          <p className="eyebrow">{justSubmitted ? "REQUEST RECEIVED" : "YOUR REFERENCE"}</p>
          <h1>{justSubmitted ? <>Your next drive <em>starts here.</em></> : <>Keep the journey <em>in sight.</em></>}</h1>
          <p>{justSubmitted
            ? "Your inquiry has been saved. This portfolio demonstration does not process a payment or guarantee availability."
            : "If you have just sent an inquiry, keep this reference for your records."}</p>
        </div>
        <div className="confirmation-card confirmation-card--simple">
          <div>
            <p className="eyebrow">YOUR REFERENCE</p>
            <h2>#{id?.slice(0, 8).toUpperCase()}</h2>
            {state && (
              <dl>
                <div><dt>Vehicle</dt><dd>{state.vehicleName}</dd></div>
                <div><dt>Pick up</dt><dd>{state.startDate}</dd></div>
                <div><dt>Return</dt><dd>{state.endDate}</dd></div>
                <div><dt>Estimated total</dt><dd>${state.estimatedTotal.toLocaleString()}</dd></div>
              </dl>
            )}
          </div>
        </div>
        <div className="confirmation-actions">
          <Link className="button-gold" to="/fleet">Explore the collection <ArrowUpRight size={18} /></Link>
          <Link className="button-outline" to="/">Return home</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
