import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";

const Fleet = lazy(() => import("./pages/Search"));
const VehicleDetail = lazy(() => import("./pages/VehicleDetail"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const App = () => (
  <BrowserRouter>
    <RouteScroll />
    <Suspense fallback={<div className="route-loading" role="status">Loading the collection…</div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/search" element={<Navigate to="/fleet" replace />} />
        <Route path="/cars/:slug" element={<VehicleDetail />} />
        <Route path="/confirmation/:id" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
