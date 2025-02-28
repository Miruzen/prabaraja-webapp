
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

import Dashboard from "@/pages/Dashboard";
import Sales from "@/pages/Sales";
import Purchases from "@/pages/Purchases";
import Products from "@/pages/Products";
import Contacts from "@/pages/Contacts";
import CashnBank from "@/pages/CashnBank";
import Expenses from "@/pages/Expenses";
import Assets from "@/pages/Assets";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import InvoiceDetail from "@/pages/InvoiceDetail";
import NotFound from "@/pages/NotFound";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/cash-bank" element={<CashnBank />} />
          </Routes>
          <Toaster />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
