import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Purchase, PurchaseType, InvoicePurchase, OfferPurchase, OrderPurchase, RequestPurchase, ShipmentPurchase } from "@/types/purchase";
import { PurchaseNavTabs } from "./PurchaseNavTabs";
import { PurchaseFilters } from "./PurchaseFilters";
import { PurchaseAddButton } from "./PurchaseAddButton";
import { StatsCards } from "./StatsCards";
import { TransactionsTable } from "./TransactionsTable";
import { AddPurchaseDialog } from "@/components/AddPurchaseDialog";
import { 
  useInvoices, 
  useOffers, 
  useOrders, 
  useRequests, 
  useShipments,
  useCreateInvoice,
  useCreateOffer,
  useCreateOrder,
  useCreateRequest,
  useCreateShipment,
  useDeleteInvoice,
  useUpdateInvoice
} from "@/hooks/usePurchases";

export function PurchaseContent() {
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Fetch data from all tables
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();
  const { data: offers = [], isLoading: offersLoading } = useOffers();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: requests = [], isLoading: requestsLoading } = useRequests();
  const { data: shipments = [], isLoading: shipmentsLoading } = useShipments();

  // Mutations
  const createInvoiceMutation = useCreateInvoice();
  const createOfferMutation = useCreateOffer();
  const createOrderMutation = useCreateOrder();
  const createRequestMutation = useCreateRequest();
  const createShipmentMutation = useCreateShipment();
  const deleteInvoiceMutation = useDeleteInvoice();
  const updateInvoiceMutation = useUpdateInvoice();

  const isLoading = invoicesLoading || offersLoading || ordersLoading || requestsLoading || shipmentsLoading;

  // Transform data to unified Purchase format
  const transformInvoicesToPurchases = (invoices: any[]): InvoicePurchase[] => {
    return invoices.map(invoice => ({
      id: invoice.id,
      date: new Date(invoice.date),
      number: `INV-${invoice.number}`,
      approver: invoice.approver,
      status: invoice.status as any,
      tags: invoice.tags || [],
      type: "invoice" as const,
      items: invoice.items as any[],
      amount: invoice.grand_total,
      itemCount: Array.isArray(invoice.items) ? invoice.items.length : 0,
      dueDate: new Date(invoice.due_date),
      paidAmount: 0
    }));
  };

  const transformOffersToP = (offers: any[]): OfferPurchase[] => {
    return offers.map(offer => ({
      id: offer.id,
      date: new Date(offer.date),
      number: `OFR-${offer.number}`,
      approver: '',
      status: offer.status as any,
      tags: offer.tags || [],
      type: "offer" as const,
      items: offer.items as any[],
      amount: offer.grand_total,
      itemCount: Array.isArray(offer.items) ? offer.items.length : 0,
      expiryDate: offer.expiry_date ? new Date(offer.expiry_date) : new Date(),
      discountTerms: offer.discount_terms || ''
    }));
  };

  const transformOrdersToP = (orders: any[]): OrderPurchase[] => {
    return orders.map(order => ({
      id: order.id,
      date: new Date(order.date),
      number: `ORD-${order.number}`,
      approver: '',
      status: order.status as any,
      tags: order.tags || [],
      type: "order" as const,
      items: order.items as any[],
      amount: order.grand_total,
      itemCount: Array.isArray(order.items) ? order.items.length : 0,
      orderDate: new Date(order.orders_date),
      discountTerms: ''
    }));
  };

  const transformRequestsToP = (requests: any[]): RequestPurchase[] => {
    return requests.map(request => ({
      id: request.id,
      date: request.date ? new Date(request.date) : new Date(),
      number: `REQ-${request.number}`,
      approver: '',
      status: request.status as any,
      tags: request.tags || [],
      type: "request" as const,
      items: request.items as any[],
      amount: request.grand_total,
      itemCount: Array.isArray(request.items) ? request.items.length : 0,
      requestedBy: request.requested_by,
      urgency: request.urgency as any,
      dueDate: request.due_date ? new Date(request.due_date) : undefined
    }));
  };

  const transformShipmentsToP = (shipments: any[]): ShipmentPurchase[] => {
    return shipments.map(shipment => ({
      id: shipment.id,
      date: new Date(shipment.date),
      number: `SH-${shipment.number}`,
      approver: '',
      status: shipment.status as any,
      tags: shipment.tags || [],
      type: "shipment" as const,
      items: shipment.items as any[],
      amount: shipment.grand_total,
      itemCount: Array.isArray(shipment.items) ? shipment.items.length : 0,
      trackingNumber: shipment.tracking_number,
      carrier: shipment.carrier,
      shippingDate: new Date(shipment.shipping_date)
    }));
  };

  // Get all purchases for the active tab
  const getAllPurchases = (): Purchase[] => {
    const invoicePurchases = transformInvoicesToPurchases(invoices);
    const offerPurchases = transformOffersToP(offers);
    const orderPurchases = transformOrdersToP(orders);
    const requestPurchases = transformRequestsToP(requests);
    const shipmentPurchases = transformShipmentsToP(shipments);

    console.log('All request purchases:', requestPurchases);
    console.log('Pending requests:', requestPurchases.filter(r => r.status === "pending"));

    switch (activeTab) {
      case "invoices":
        return invoicePurchases;
      case "offers":
        return offerPurchases;
      case "orders":
        return orderPurchases;
      case "requests":
        return requestPurchases;
      case "shipments":
        return shipmentPurchases;
      case "approval":
        // Show ALL pending requests, not just from requests table
        const allPendingRequests = requestPurchases.filter(r => r.status === "pending");
        console.log('Approval tab - showing pending requests:', allPendingRequests);
        return allPendingRequests;
      default:
        return [...invoicePurchases, ...offerPurchases, ...orderPurchases, ...requestPurchases, ...shipmentPurchases];
    }
  };

  // Filter purchases based on search and status
  const filteredPurchases = getAllPurchases().filter(purchase => {
    const matchesSearch = searchValue === "" || 
      purchase.number.toLowerCase().includes(searchValue.toLowerCase()) ||
      purchase.approver.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for StatsCards
  const allPurchases = [...transformInvoicesToPurchases(invoices), ...transformOffersToP(offers), ...transformOrdersToP(orders), ...transformRequestsToP(requests), ...transformShipmentsToP(shipments)];
  
  const unpaidAmount = allPurchases
    .filter(p => p.status === "pending" || p.status === "Half-paid")
    .reduce((total, p) => total + p.amount, 0);

  const overdueCount = allPurchases
    .filter(p => p.status === "pending" && p.dueDate && new Date(p.dueDate) < new Date())
    .length;

  const last30DaysPayments = allPurchases
    .filter(p => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return p.status === "completed" && new Date(p.date) >= thirtyDaysAgo;
    })
    .reduce((total, p) => total + p.amount, 0);

  // Handle adding a new purchase
  const handleAddPurchase = async (data: any) => {
    try {
      const baseData = {
        number: parseInt(data.number.replace(/\D/g, '')),
        type: data.type,
        date: data.date,
        due_date: data.dueDate,
        status: data.status,
        tags: data.tags,
        items: data.items || [],
        grand_total: data.grandTotal || 0
      };

      switch (data.type) {
        case "invoice":
          await createInvoiceMutation.mutateAsync({
            ...baseData,
            approver: data.approver,
            tax_calculation_method: false,
            ppn_percentage: data.ppnPercentage,
            pph_percentage: data.pphPercentage,
            pph_type: data.pphType,
            dpp: data.dpp,
            ppn: data.ppn,
            pph: data.pph
          });
          break;
        case "offer":
          await createOfferMutation.mutateAsync({
            ...baseData,
            expiry_date: data.expiryDate,
            discount_terms: data.discountTerms
          });
          break;
        case "order":
          await createOrderMutation.mutateAsync({
            ...baseData,
            orders_date: data.orderDate || data.date
          });
          break;
        case "request":
          await createRequestMutation.mutateAsync({
            ...baseData,
            requested_by: data.requestedBy,
            urgency: data.urgency
          });
          break;
        case "shipment":
          await createShipmentMutation.mutateAsync({
            ...baseData,
            tracking_number: data.trackingNumber,
            carrier: data.carrier,
            shipping_date: data.shippingDate
          });
          break;
      }

      setIsDialogOpen(false);
      toast.success("Purchase created successfully");
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast.error("Failed to create purchase");
    }
  };

  // Handle deleting a purchase
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteInvoiceMutation.mutateAsync(id);
      toast.success("Purchase deleted successfully");
    } catch (error) {
      console.error('Error deleting purchase:', error);
      toast.error("Failed to delete purchase");
    }
  };

  // Handle approving a purchase
  const handleApproveTransaction = async (id: string) => {
    try {
      await updateInvoiceMutation.mutateAsync({
        id,
        updates: { status: "completed" }
      });
      toast.success("Purchase approved successfully");
    } catch (error) {
      console.error('Error approving purchase:', error);
      toast.error("Failed to approve purchase");
    }
  };

  // Handle rejecting a purchase
  const handleRejectTransaction = async (id: string) => {
    try {
      await updateInvoiceMutation.mutateAsync({
        id,
        updates: { status: "cancelled" }
      });
      toast.success("Purchase rejected successfully");
    } catch (error) {
      console.error('Error rejecting purchase:', error);
      toast.error("Failed to reject purchase");
    }
  };

  // Get the default purchase type based on the active tab
  const getDefaultPurchaseType = (): PurchaseType => {
    switch(activeTab) {
      case "invoices": return "invoice";
      case "shipments": return "shipment";
      case "orders": return "order";
      case "offers": return "offer";
      case "requests": return "request";
      default: return "invoice";
    }
  };

  // Handle clicking the "Add Purchase" button
  const handleAddPurchaseClick = (type: PurchaseType) => {
    navigate(`/create-new-purchase?type=${type}`);
  };

  // Render the component
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading purchases...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards 
        unpaidAmount={unpaidAmount}
        overdueCount={overdueCount}
        last30DaysPayments={last30DaysPayments}
      />
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <PurchaseNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <PurchaseAddButton onAddPurchase={handleAddPurchaseClick} />
      </div>

      <PurchaseFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <TransactionsTable
        transactions={filteredPurchases}
        activeTab={activeTab}
        onDeleteTransaction={handleDeleteTransaction}
        onApproveTransaction={handleApproveTransaction}
        onRejectTransaction={handleRejectTransaction}
      />

      <AddPurchaseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddPurchase}
        defaultType={getDefaultPurchaseType()}
      />
    </div>
  );
}
