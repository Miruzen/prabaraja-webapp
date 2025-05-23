
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Dashboard from "@/pages/Dashboard";
import Sales from "@/pages/Sales";
import CreateNewSales from "@/components/create/CreateNewSales";
import Purchases from "@/pages/Purchases";
import CreateNewPurchase from "@/components/create/CreateNewPurchase";
import CreateExpense from "./components/create/CreateExpense";
import Products from "@/pages/Products";
import Contacts from "@/pages/Contacts";
import CreateContact from "@/pages/CreateContact";
import ContactDetails from "@/pages/ContactDetails";
import CashnBank from "@/pages/CashnBank";
import CashflowAnalysisPage from "@/pages/CashflowAnalysis";
import Expenses from "@/pages/Expenses";
import ExpenseDetail from "@/components/detail/ExpenseDetail";
import Assets from "@/pages/Assets";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import InvoiceDetail from "@/components/detail/InvoiceDetail";
import SalesInvoiceDetail from "@/components/detail/SalesInvoiceDetail";
import ShipmentDetail from "@/components/detail/ShipmentDetail";
import OrderDetail from "@/components/detail/OrderDetail";
import OfferDetail from "@/components/detail/OfferDetail";
import RequestDetail from "@/components/detail/RequestDetail";
import NotFound from "@/pages/NotFound";
import Index from "./pages/Index";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPass";
import Neraca from "./components/reports/neraca";
import { ReceivePaymentPage } from "./pages/ReceivePaymentPage";

import AddProduct from "@/pages/AddProduct";
import AddWarehouse from "@/pages/AddWarehouse";
import AdjustStock from "@/pages/AdjustStock";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
              <Route path="/create-new-sales" element={<ProtectedRoute><CreateNewSales /></ProtectedRoute>} />
              <Route path="/sales-invoice/:id" element={<ProtectedRoute><SalesInvoiceDetail /></ProtectedRoute>} />
              <Route path="/invoices/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
              <Route path="/shipments/:id" element={<ProtectedRoute><ShipmentDetail /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
              <Route path="/offers/:id" element={<ProtectedRoute><OfferDetail /></ProtectedRoute>} />
              <Route path="/requests/:id" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
              <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
              <Route path="/create-new-purchase" element={<ProtectedRoute><CreateNewPurchase /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/create-contact" element={<ProtectedRoute><CreateContact /></ProtectedRoute>} />
              <Route path="/contact-details/:id" element={<ProtectedRoute><ContactDetails /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/expense/:id" element={<ProtectedRoute><ExpenseDetail /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-expense" element={<ProtectedRoute><CreateExpense /></ProtectedRoute>} />
              <Route path="/cash-bank" element={<ProtectedRoute><CashnBank /></ProtectedRoute>} />
              <Route path="/cashflow-analysis" element={<ProtectedRoute><CashflowAnalysisPage /></ProtectedRoute>} />
              <Route path="/neraca" element={<ProtectedRoute><Neraca /></ProtectedRoute>} />
              <Route path="/receive-payment/:invoiceId" element={<ProtectedRoute><ReceivePaymentPage /></ProtectedRoute>} />
              <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/add-warehouse" element={<ProtectedRoute><AddWarehouse /></ProtectedRoute>} />
              <Route path="/adjust-stock" element={<ProtectedRoute><AdjustStock /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
