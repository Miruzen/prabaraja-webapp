
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPass from "./pages/ForgotPass";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import AddWarehouse from "./pages/AddWarehouse";
import AdjustStock from "./pages/AdjustStock";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import CashnBank from "./pages/CashnBank";
import CashflowAnalysis from "./pages/CashflowAnalysis";
import Assets from "./pages/Assets";
import Contacts from "./pages/Contacts";
import CreateContact from "./pages/CreateContact";
import ContactDetails from "./pages/ContactDetails";
import Settings from "./pages/Settings";
import ReceivePaymentPage from "./pages/ReceivePaymentPage";
import NotFound from "./pages/NotFound";
import CreateExpense from "./components/create/CreateExpense";
import CreateNewPurchase from "./components/create/CreateNewPurchase";
import CreateNewSales from "./components/create/CreateNewSales";
import InvoiceDetail from "./components/detail/InvoiceDetail";
import OfferDetail from "./components/detail/OfferDetail";
import OrderDetail from "./components/detail/OrderDetail";
import RequestDetail from "./components/detail/RequestDetail";
import SalesInvoiceDetail from "./components/detail/SalesInvoiceDetail";
import ShipmentDetail from "./components/detail/ShipmentDetail";
import ExpenseDetail from "./components/detail/ExpenseDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPass />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/add-warehouse" element={<ProtectedRoute><AddWarehouse /></ProtectedRoute>} />
              <Route path="/adjust-stock" element={<ProtectedRoute><AdjustStock /></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
              <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/cash-bank" element={<ProtectedRoute><CashnBank /></ProtectedRoute>} />
              <Route path="/cashflow-analysis" element={<ProtectedRoute><CashflowAnalysis /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/create-contact" element={<ProtectedRoute><CreateContact /></ProtectedRoute>} />
              <Route path="/contact/:id" element={<ProtectedRoute><ContactDetails /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/receive-payment" element={<ProtectedRoute><ReceivePaymentPage /></ProtectedRoute>} />
              
              {/* Create routes */}
              <Route path="/create-expense" element={<ProtectedRoute><CreateExpense /></ProtectedRoute>} />
              <Route path="/create-purchase" element={<ProtectedRoute><CreateNewPurchase /></ProtectedRoute>} />
              <Route path="/create-sales" element={<ProtectedRoute><CreateNewSales /></ProtectedRoute>} />
              
              {/* Detail routes */}
              <Route path="/invoice/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
              <Route path="/offer/:id" element={<ProtectedRoute><OfferDetail /></ProtectedRoute>} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
              <Route path="/request/:id" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
              <Route path="/sales-invoice/:id" element={<ProtectedRoute><SalesInvoiceDetail /></ProtectedRoute>} />
              <Route path="/shipment/:id" element={<ProtectedRoute><ShipmentDetail /></ProtectedRoute>} />
              <Route path="/expense/:id" element={<ProtectedRoute><ExpenseDetail /></ProtectedRoute>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
