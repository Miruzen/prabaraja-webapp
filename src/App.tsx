
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPass from "./pages/ForgotPass";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import CreateNewPurchase from "./components/create/CreateNewPurchase";
import EditPurchase from "@/components/EditPurchase";
import CashnBank from "./pages/CashnBank";
import Reports from "./pages/Reports";
import Index from "./pages/Index";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";
import Expenses from "./pages/Expenses";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import AddWarehouse from "./pages/AddWarehouse";
import AdjustStock from "./pages/AdjustStock";
import Contacts from "./pages/Contacts";
import CreateContact from "./pages/CreateContact";
import ContactDetails from "./pages/ContactDetails";
import Assets from "./pages/Assets";
import Settings from "./pages/Settings";
import CashflowAnalysis from "./pages/CashflowAnalysis";
import CreateNewSales from "./components/create/CreateNewSales";
import CreateExpense from "./components/create/CreateExpense";
import SalesInvoiceDetail from "./components/detail/SalesInvoiceDetail";
import InvoiceDetail from "./components/detail/InvoiceDetail";
import OfferDetail from "./components/detail/OfferDetail";
import OrderDetail from "./components/detail/OrderDetail";
import RequestDetail from "./components/detail/RequestDetail";
import ShipmentDetail from "./components/detail/ShipmentDetail";
import ExpenseDetail from "./components/detail/ExpenseDetail";
import { ReceivePaymentPage }from "./pages/ReceivePaymentPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <Purchases />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-new-purchase"
              element={
                <ProtectedRoute>
                  <CreateNewPurchase />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/edit-purchase/:id" 
              element={
                <ProtectedRoute>
                  <EditPurchase />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/cash-bank"
              element={
                <ProtectedRoute>
                  <CashnBank />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Expenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses/:id"
              element={
                <ProtectedRoute>
                  <ExpenseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-expense"
              element={
                <ProtectedRoute>
                  <CreateExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-warehouse"
              element={
                <ProtectedRoute>
                  <AddWarehouse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adjust-stock"
              element={
                <ProtectedRoute>
                  <AdjustStock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-contact"
              element={
                <ProtectedRoute>
                  <CreateContact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-details/:id"
              element={
                <ProtectedRoute>
                  <ContactDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets"
              element={
                <ProtectedRoute>
                  <Assets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cashflow-analysis"
              element={
                <ProtectedRoute>
                  <CashflowAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-new-sales"
              element={
                <ProtectedRoute>
                  <CreateNewSales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-invoice/:id"
              element={
                <ProtectedRoute>
                  <SalesInvoiceDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/:id"
              element={
                <ProtectedRoute>
                  <OfferDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests/:id"
              element={
                <ProtectedRoute>
                  <RequestDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/:id"
              element={
                <ProtectedRoute>
                  <ShipmentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receive-payment/:invoiceId"
              element={
                <ProtectedRoute>
                  <ReceivePaymentPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
