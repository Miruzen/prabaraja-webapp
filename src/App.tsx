
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

import Dashboard from "@/pages/Dashboard";
import Sales from "@/pages/Sales";
import CreateNewSales from "@/pages/CreateNewSales";
import Purchases from "@/pages/Purchases";
import CreateNewPurchase from "@/pages/CreateNewPurchase";
import CreateExpense from "./pages/CreateExpense";
import Products from "@/pages/Products";
import Contacts from "@/pages/Contacts";
import CashnBank from "@/pages/CashnBank";
import Expenses from "@/pages/Expenses";
import ExpenseDetail from "@/pages/ExpenseDetail";
import Assets from "@/pages/Assets";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import InvoiceDetail from "@/pages/InvoiceDetail";
import SalesInvoiceDetail from "@/pages/SalesInvoiceDetail";
import ShipmentDetail from "@/pages/ShipmentDetail";
import OrderDetail from "@/pages/OrderDetail";
import OfferDetail from "@/pages/OfferDetail";
import RequestDetail from "@/pages/RequestDetail";
import NotFound from "@/pages/NotFound";
import Index from "./pages/Index";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPass";
import Neraca from "./components/reports/neraca";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/create-new-sales" element={<CreateNewSales />} />
            <Route path="/sales-invoice/:id" element={<SalesInvoiceDetail />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
            <Route path="/shipment/:id" element={<ShipmentDetail />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/offer/:id" element={<OfferDetail />} />
            <Route path="/request/:id" element={<RequestDetail />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/create-new-purchase" element={<CreateNewPurchase />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expense/:id" element={<ExpenseDetail />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-expense" element={<CreateExpense />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/cash-bank" element={<CashnBank />} />
            <Route path="/login" element={<LoginPage/> }/> 
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/> }/>
            <Route path="/neraca" element={<Neraca/> } />
          </Routes>
          <Toaster />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
