import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";

const Search = lazy(() => import("./pages/Search"));
const Auth = lazy(() => import("./pages/Auth"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Booking = lazy(() => import("./pages/Booking"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));

const App = () => (
  <AuthProvider>
    <Toaster />
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center" role="status">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/booking/:carId" element={<Booking />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
