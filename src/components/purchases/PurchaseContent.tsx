
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
import { PurchaseType, InvoicePurchase, ShipmentPurchase, OrderPurchase, OfferPurchase, RequestPurchase } from "@/types/purchase";
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
  type Invoice,
  type Shipment,
  type Order,
  type Offer,
  type Request
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

  // Transform data to match expected types
  const transformInvoices = (invoices: Invoice[]): InvoicePurchase[] => {
    return invoices.map(invoice => ({
      id: invoice.id,
      date: new Date(invoice.date),
      number: invoice.number.toString(),
      approver: invoice.approver,
      status: invoice.status as any,
      tags: invoice.tags || [],
      type: "invoice" as const,
      items: invoice.items || [],
      amount: Number(invoice.grand_total),
      itemCount: invoice.items?.length || 0,
      dueDate: new Date(invoice.due_date),
      paidAmount: 0 // Default value, would need to be calculated from payments
    }));
  };

  const transformShipments = (shipments: Shipment[]): ShipmentPurchase[] => {
    return shipments.map(shipment => ({
      id: shipment.id,
      date: new Date(shipment.date),
      number: shipment.number.toString(),
      approver: "System", // Default value
      status: shipment.status as any,
      tags: shipment.tags || [],
      type: "shipment" as const,
      items: shipment.items || [],
      amount: Number(shipment.grand_total),
      itemCount: shipment.items?.length || 0,
      trackingNumber: shipment.tracking_number,
      carrier: shipment.carrier,
      shippingDate: new Date(shipment.shipping_date)
    }));
  };

  const transformOrders = (orders: Order[]): OrderPurchase[] => {
    return orders.map(order => ({
      id: order.id,
      date: new Date(order.date),
      number: order.number.toString(),
      approver: "System", // Default value
      status: order.status as any,
      tags: order.tags || [],
      type: "order" as const,
      items: order.items || [],
      amount: Number(order.grand_total),
      itemCount: order.items?.length || 0,
      orderDate: new Date(order.orders_date),
      discountTerms: ""
    }));
  };

  const transformOffers = (offers: Offer[]): OfferPurchase[] => {
    return offers.map(offer => ({
      id: offer.id,
      date: new Date(offer.date),
      number: offer.number.toString(),
      approver: "System", // Default value
      status: offer.status as any,
      tags: offer.tags || [],
      type: "offer" as const,
      items: offer.items || [],
      amount: Number(offer.grand_total),
      itemCount: offer.items?.length || 0,
      expiryDate: offer.expiry_date ? new Date(offer.expiry_date) : new Date(),
      discountTerms: offer.discount_terms || ""
    }));
  };

  const transformRequests = (requests: Request[]): RequestPurchase[] => {
    return requests.map(request => ({
      id: request.id,
      date: new Date(request.date || new Date()),
      number: request.number.toString(),
      approver: "System", // Default value
      status: request.status as any,
      tags: request.tags || [],
      type: "request" as const,
      items: request.items || [],
      amount: Number(request.grand_total),
      itemCount: request.items?.length || 0,
      requestedBy: request.requested_by,
      urgency: request.urgency as any
    }));
  };

  const handleAddPurchase = (type: PurchaseType) => {
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

  const renderTable = () => {
    switch (activeTab) {
      case "invoices":
        return (
          <InvoicesTable 
            invoices={transformInvoices(invoices)} 
            onDelete={(id) => handleDelete(id, "invoice")}
            onEdit={(id) => handleEdit(id, "invoice")}
          />
        );
      case "shipments":
        return (
          <ShipmentsTable 
            shipments={transformShipments(shipments)} 
            onDelete={(id) => handleDelete(id, "shipment")}
            onEdit={(id) => handleEdit(id, "shipment")}
          />
        );
      case "orders":
        return (
          <OrdersTable 
            orders={transformOrders(orders)} 
            onDelete={(id) => handleDelete(id, "order")}
            onEdit={(id) => handleEdit(id, "order")}
          />
        );
      case "offers":
        return (
          <OffersTable 
            offers={transformOffers(offers)} 
            onDelete={(id) => handleDelete(id, "offer")}
            onEdit={(id) => handleEdit(id, "offer")}
          />
        );
      case "requests":
        return (
          <RequestsTable 
            requests={transformRequests(requests)} 
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
      <PurchaseNavTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
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
