
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import CreateNewSales from "./pages/CreateNewSales";
import Purchases from "./pages/Purchases";
import Assets from "./pages/Assets";
import CashnBank from "./pages/CashnBank";
import Contacts from "./pages/Contacts";
import Products from "./pages/Products";
import Expenses from "./pages/Expenses";
import CreateExpense from "./pages/CreateExpense";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import InvoiceDetail from "./pages/InvoiceDetail";
import ShipmentDetail from "./pages/ShipmentDetail";
import OrderDetail from "./pages/OrderDetail";
import OfferDetail from "./pages/OfferDetail";
import RequestDetail from "./pages/RequestDetail";
import CreateNewPurchase from "./pages/CreateNewPurchase";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/create-new-sales" element={<CreateNewSales />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/create-new-purchase" element={<CreateNewPurchase />} />
        <Route path="/invoice/:id" element={<InvoiceDetail />} />
        <Route path="/shipment/:id" element={<ShipmentDetail />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/offer/:id" element={<OfferDetail />} />
        <Route path="/request/:id" element={<RequestDetail />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/cash-n-bank" element={<CashnBank />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/products" element={<Products />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/create-expense" element={<CreateExpense />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
