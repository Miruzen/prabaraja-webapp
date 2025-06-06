
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
  useDeleteRequest
} from "@/hooks/usePurchases";
import { toast } from "sonner";

export function PurchaseContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PurchaseType>("invoice");

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

  const renderTable = () => {
    switch (activeTab) {
      case "invoices":
        return (
          <InvoicesTable 
            invoices={invoices} 
            onDelete={(id) => handleDelete(id, "invoice")}
            onEdit={(id) => handleEdit(id, "invoice")}
          />
        );
      case "shipments":
        return (
          <ShipmentsTable 
            shipments={shipments} 
            onDelete={(id) => handleDelete(id, "shipment")}
            onEdit={(id) => handleEdit(id, "shipment")}
          />
        );
      case "orders":
        return (
          <OrdersTable 
            orders={orders} 
            onDelete={(id) => handleDelete(id, "order")}
            onEdit={(id) => handleEdit(id, "order")}
          />
        );
      case "offers":
        return (
          <OffersTable 
            offers={offers} 
            onDelete={(id) => handleDelete(id, "offer")}
            onEdit={(id) => handleEdit(id, "offer")}
          />
        );
      case "requests":
        return (
          <RequestsTable 
            requests={requests} 
            onDelete={(id) => handleDelete(id, "request")}
            onEdit={(id) => handleEdit(id, "request")}
          />
        );
      default:
        return <TransactionsTable />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Purchases</h1>
        <PurchaseAddButton onAddPurchase={handleAddPurchase} />
      </div>

      <StatsCards />
      <PurchaseNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <PurchaseFilters />
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
