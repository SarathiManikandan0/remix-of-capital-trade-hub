import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import LiveSignals from "./pages/LiveSignals";
import MarketAnalysis from "./pages/MarketAnalysis";
import ToolsCourses from "./pages/ToolsCourses";
import MySubscription from "./pages/MySubscription";
import SupportTickets from "./pages/SupportTickets";
import PaymentsHistory from "./pages/PaymentsHistory";
import Notifications from "./pages/Notifications";
import Community from "./pages/Community";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signals" element={<LiveSignals />} />
            <Route path="/analysis" element={<MarketAnalysis />} />
            <Route path="/courses" element={<ToolsCourses />} />
            <Route path="/subscription" element={<MySubscription />} />
            <Route path="/support" element={<SupportTickets />} />
            <Route path="/payments" element={<PaymentsHistory />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
