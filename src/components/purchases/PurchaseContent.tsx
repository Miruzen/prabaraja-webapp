
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PurchaseNavTabs } from "./PurchaseNavTabs";
import { PurchaseFilters } from "./PurchaseFilters";
import { TransactionsTable } from "./TransactionsTable";
import { InvoicesTable } from "./tables/InvoicesTable";
import { ShipmentsTable } from "./tables/ShipmentsTable";
import { OrdersTable } from "./tables/OrdersTable";
import { OffersTable } from "./tables/OffersTable";
import { RequestsTable } from "./tables/RequestsTable";
import { StatsCards } from "./StatsCards";
import { PurchaseAddButton } from "./PurchaseAddButton";
import { AddPurchaseDialog } from "../AddPurchaseDialog";
import { PurchaseType } from "@/types/purchase";
import { 
  useInvoices, 
  useShipments, 
  useOrders, 
  useOffers, 
  useRequests,
  useDeleteInvoice,
  useDeleteShipment,
  useDeleteOrder,
  useDeleteOffer,
  useDeleteRequest,
  Invoice,
  Shipment,
  Order,
  Offer,
  Request
} from "@/hooks/usePurchases";
import { toast } from "sonner";

export function PurchaseContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PurchaseType>("invoice");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  // Query hooks
  const { data: invoices = [], refetch: refetchInvoices } = useInvoices();
  const { data: shipments = [], refetch: refetchShipments } = useShipments();
  const { data: orders = [], refetch: refetchOrders } = useOrders();
  const { data: offers = [], refetch: refetchOffers } = useOffers();
  const { data: requests = [], refetch: refetchRequests } = useRequests();

  // Delete mutation hooks
  const deleteInvoiceMutation = useDeleteInvoice();
  const deleteShipmentMutation = useDeleteShipment();
  const deleteOrderMutation = useDeleteOrder();
  const deleteOfferMutation = useDeleteOffer();
  const deleteRequestMutation = useDeleteRequest();

  const handleAddPurchase = (type: PurchaseType) => {
    // Navigate directly to create-new-purchase with the type parameter
    navigate(`/create-new-purchase?type=${type}`);
  };

  const handleEdit = (id: string, type: PurchaseType) => {
    navigate(`/create-new-purchase?id=${id}&type=${type}`);
  };

  const handleDelete = async (id: string, type: PurchaseType) => {
    try {
      switch (type) {
        case "invoice":
          await deleteInvoiceMutation.mutateAsync(id);
          refetchInvoices();
          break;
        case "shipment":
          await deleteShipmentMutation.mutateAsync(id);
          refetchShipments();
          break;
        case "order":
          await deleteOrderMutation.mutateAsync(id);
          refetchOrders();
          break;
        case "offer":
          await deleteOfferMutation.mutateAsync(id);
          refetchOffers();
          break;
        case "request":
          await deleteRequestMutation.mutateAsync(id);
          refetchRequests();
          break;
      }
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  // Transform database types to component-compatible formats
  const transformedInvoices = invoices.map((invoice: Invoice) => ({
    ...invoice,
    date: new Date(invoice.date),
    dueDate: new Date(invoice.due_date),
    amount: invoice.grand_total,
    itemCount: Array.isArray(invoice.items) ? invoice.items.length : 0,
    paidAmount: 0 // Default value since it's not in the database type
  }));

  const transformedShipments = shipments.map((shipment: Shipment) => ({
    ...shipment,
    date: new Date(shipment.date),
    dueDate: new Date(shipment.due_date),
    shippingDate: new Date(shipment.shipping_date),
    trackingNumber: shipment.tracking_number,
    amount: shipment.grand_total,
    itemCount: Array.isArray(shipment.items) ? shipment.items.length : 0,
    approver: "System" // Default value since it's not in the database type
  }));

  const transformedOrders = orders.map((order: Order) => ({
    ...order,
    date: new Date(order.date),
    dueDate: new Date(order.due_date),
    orderDate: new Date(order.orders_date),
    amount: order.grand_total,
    itemCount: Array.isArray(order.items) ? order.items.length : 0,
    approver: "System", // Default value since it's not in the database type
    discountTerms: "" // Default value since it's not in the database type
  }));

  const transformedOffers = offers.map((offer: Offer) => ({
    ...offer,
    date: new Date(offer.date),
    dueDate: new Date(offer.due_date),
    expiryDate: offer.expiry_date ? new Date(offer.expiry_date) : new Date(),
    discountTerms: offer.discount_terms || "",
    amount: offer.grand_total,
    itemCount: Array.isArray(offer.items) ? offer.items.length : 0,
    approver: "System" // Default value since it's not in the database type
  }));

  const transformedRequests = requests.map((request: Request) => ({
    ...request,
    date: new Date(request.date || new Date()),
    dueDate: new Date(request.due_date),
    requestedBy: request.requested_by,
    amount: request.grand_total,
    itemCount: Array.isArray(request.items) ? request.items.length : 0,
    approver: "System" // Default value since it's not in the database type
  }));

  const renderTable = () => {
    switch (activeTab) {
      case "invoices":
        return (
          <InvoicesTable 
            invoices={transformedInvoices} 
            onDelete={(id) => handleDelete(id, "invoice")}
            onEdit={(id) => handleEdit(id, "invoice")}
          />
        );
      case "shipments":
        return (
          <ShipmentsTable 
            shipments={transformedShipments} 
            onDelete={(id) => handleDelete(id, "shipment")}
            onEdit={(id) => handleEdit(id, "shipment")}
          />
        );
      case "orders":
        return (
          <OrdersTable 
            orders={transformedOrders} 
            onDelete={(id) => handleDelete(id, "order")}
            onEdit={(id) => handleEdit(id, "order")}
          />
        );
      case "offers":
        return (
          <OffersTable 
            offers={transformedOffers} 
            onDelete={(id) => handleDelete(id, "offer")}
            onEdit={(id) => handleEdit(id, "offer")}
          />
        );
      case "requests":
        return (
          <RequestsTable 
            requests={transformedRequests} 
            onDelete={(id) => handleDelete(id, "request")}
            onEdit={(id) => handleEdit(id, "request")}
          />
        );
      default:
        return (
          <TransactionsTable 
            transactions={[]}
            activeTab={activeTab}
            onDeleteTransaction={() => {}}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Purchases</h1>
        <PurchaseAddButton onAddPurchase={handleAddPurchase} />
      </div>

      <StatsCards 
        unpaidAmount={0}
        overdueCount={0}
        last30DaysPayments={0}
      />
      <PurchaseNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <PurchaseFilters 
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      {renderTable()}

      <AddPurchaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={() => {}}
        defaultType={selectedType}
      />
    </div>
  );
}
