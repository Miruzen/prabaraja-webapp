
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

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
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/create-new-sales" element={<CreateNewSales />} />
            <Route path="/sales-invoice/:id" element={<SalesInvoiceDetail />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/shipments/:id" element={<ShipmentDetail />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/offers/:id" element={<OfferDetail />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/create-new-purchase" element={<CreateNewPurchase />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/create-contact" element={<CreateContact />} />
            <Route path="/contact-details/:id" element={<ContactDetails />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expense/:id" element={<ExpenseDetail />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-expense" element={<CreateExpense />} />
            <Route path="/cash-bank" element={<CashnBank />} />
            <Route path="/cashflow-analysis" element={<CashflowAnalysisPage />} />
            <Route path="/login" element={<LoginPage/> }/> 
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/> }/>
            <Route path="/neraca" element={<Neraca/> } />
            <Route path="/receive-payment/:invoiceId" element={<ReceivePaymentPage />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-warehouse" element={<AddWarehouse />} />
            <Route path="/adjust-stock" element={<AdjustStock />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
