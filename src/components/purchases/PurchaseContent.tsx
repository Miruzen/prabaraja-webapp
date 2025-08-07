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
  useDeleteOffer,
  useDeleteOrder,
  useDeleteRequest,
  useDeleteShipment,
  useUpdateInvoice,
  useUpdateOffer,
  useUpdateOrder,
  useUpdateRequest,
  useUpdateShipment
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

  // Create mutations
  const createInvoiceMutation = useCreateInvoice();
  const createOfferMutation = useCreateOffer();
  const createOrderMutation = useCreateOrder();
  const createRequestMutation = useCreateRequest();
  const createShipmentMutation = useCreateShipment();

  // Delete mutations
  const deleteInvoiceMutation = useDeleteInvoice();
  const deleteOfferMutation = useDeleteOffer();
  const deleteOrderMutation = useDeleteOrder();
  const deleteRequestMutation = useDeleteRequest();
  const deleteShipmentMutation = useDeleteShipment();

  // Update mutations
  const updateInvoiceMutation = useUpdateInvoice();
  const updateOfferMutation = useUpdateOffer();
  const updateOrderMutation = useUpdateOrder();
  const updateRequestMutation = useUpdateRequest();
  const updateShipmentMutation = useUpdateShipment();

  const isLoading = invoicesLoading || offersLoading || ordersLoading || requestsLoading || shipmentsLoading;

  // Transform data to unified Purchase format with proper field mapping
  const transformInvoicesToPurchases = (invoices: any[]): InvoicePurchase[] => {
    return invoices.map(invoice => ({
      id: invoice.id,
      date: new Date(invoice.date),
      number: `INV-${invoice.number}`,
      approver: invoice.approver || '',
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
      requestedBy: request.requested_by || 'Unknown',
      urgency: request.urgency as any,
      dueDate: request.due_date ? new Date(request.due_date) : undefined
    }));
  };

  const transformShipmentsToP = (shipments: any[]): ShipmentPurchase[] => {
    return shipments.map(shipment => ({
      id: shipment.id,
      date: new Date(shipment.date),
      number: `SHP-${shipment.number}`,
      approver: '',
      status: shipment.status as any,
      tags: shipment.tags || [],
      type: "shipment" as const,
      items: shipment.items as any[],
      amount: shipment.grand_total,
      itemCount: Array.isArray(shipment.items) ? shipment.items.length : 0,
      trackingNumber: shipment.tracking_number || '',
      carrier: shipment.carrier || '',
      shippingDate: new Date(shipment.shipping_date)
    }));
  };

  // Get all purchases for the active tab - FIXED LOGIC
  const getAllPurchases = (): Purchase[] => {
    const invoicePurchases = transformInvoicesToPurchases(invoices);
    const offerPurchases = transformOffersToP(offers);
    const orderPurchases = transformOrdersToP(orders);
    const requestPurchases = transformRequestsToP(requests);
    const shipmentPurchases = transformShipmentsToP(shipments);

    console.log('PurchaseContent - getAllPurchases called for activeTab:', activeTab);
    console.log('Data counts:', {
      invoices: invoicePurchases.length,
      offers: offerPurchases.length,
      orders: orderPurchases.length,
      requests: requestPurchases.length,
      shipments: shipmentPurchases.length
    });

    // Return all purchases for the TransactionsTable to filter appropriately
    const allPurchases = [...invoicePurchases, ...offerPurchases, ...orderPurchases, ...requestPurchases, ...shipmentPurchases];
    
    console.log('PurchaseContent - total purchases:', allPurchases.length);
    console.log('PurchaseContent - purchase types distribution:', 
      allPurchases.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    );

    return allPurchases;
  };

  // Filter purchases based on search and status
  const filteredPurchases = getAllPurchases().filter(purchase => {
    const matchesSearch = searchValue === "" || 
      purchase.number.toLowerCase().includes(searchValue.toLowerCase()) ||
      purchase.approver.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  console.log('PurchaseContent - filteredPurchases count:', filteredPurchases.length);

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

  // Fixed delete handler - now type-aware with proper type checking
  const handleDeleteTransaction = async (id: string) => {
    try {
      // Find the purchase to determine its type
      const allPurchases = getAllPurchases();
      const purchase = allPurchases.find(p => p.id === id);
      
      if (!purchase) {
        toast.error("Purchase not found");
        return;
      }

      // Ensure purchase has type property with proper type checking
      const purchaseType = (purchase as Purchase).type;
      if (!purchaseType) {
        toast.error("Purchase type not found");
        return;
      }

      console.log('Deleting purchase:', { id, type: purchaseType });

      // Call the appropriate delete mutation based on type
      switch (purchaseType) {
        case "invoice":
          await deleteInvoiceMutation.mutateAsync(id);
          break;
        case "offer":
          await deleteOfferMutation.mutateAsync(id);
          break;
        case "order":
          await deleteOrderMutation.mutateAsync(id);
          break;
        case "request":
          await deleteRequestMutation.mutateAsync(id);
          break;
        case "shipment":
          await deleteShipmentMutation.mutateAsync(id);
          break;
        default:
          throw new Error(`Unknown purchase type: ${purchaseType}`);
      }

      toast.success("Purchase deleted successfully");
    } catch (error) {
      console.error('Error deleting purchase:', error);
      toast.error("Failed to delete purchase");
    }
  };

  // Fixed approve handler - now type-aware with proper type checking
  const handleApproveTransaction = async (id: string) => {
    try {
      // Find the purchase to determine its type
      const allPurchases = getAllPurchases();
      const purchase = allPurchases.find(p => p.id === id);
      
      if (!purchase) {
        toast.error("Purchase not found");
        return;
      }

      // Ensure purchase has type property with proper type checking
      const purchaseType = (purchase as Purchase).type;
      if (!purchaseType) {
        toast.error("Purchase type not found");
        return;
      }

      console.log('Approving purchase:', { id, type: purchaseType });

      // Call the appropriate update mutation based on type
      switch (purchaseType) {
        case "invoice":
          await updateInvoiceMutation.mutateAsync({
            id,
            updates: { status: "completed" }
          });
          break;
        case "request":
          await updateRequestMutation.mutateAsync({
            id,
            updates: { status: "completed" }
          });
          break;
        case "offer":
          await updateOfferMutation.mutateAsync({
            id,
            updates: { status: "completed" }
          });
          break;
        case "order":
          await updateOrderMutation.mutateAsync({
            id,
            updates: { status: "completed" }
          });
          break;
        case "shipment":
          await updateShipmentMutation.mutateAsync({
            id,
            updates: { status: "completed" }
          });
          break;
        default:
          throw new Error(`Unknown purchase type: ${purchaseType}`);
      }

      toast.success("Purchase approved successfully");
    } catch (error) {
      console.error('Error approving purchase:', error);
      toast.error("Failed to approve purchase");
    }
  };

  // Fixed reject handler - now type-aware with proper type checking
  const handleRejectTransaction = async (id: string) => {
    try {
      // Find the purchase to determine its type
      const allPurchases = getAllPurchases();
      const purchase = allPurchases.find(p => p.id === id);
      
      if (!purchase) {
        toast.error("Purchase not found");
        return;
      }

      // Ensure purchase has type property with proper type checking
      const purchaseType = (purchase as Purchase).type;
      if (!purchaseType) {
        toast.error("Purchase type not found");
        return;
      }

      console.log('Rejecting purchase:', { id, type: purchaseType });

      // Call the appropriate update mutation based on type
      switch (purchaseType) {
        case "invoice":
          await updateInvoiceMutation.mutateAsync({
            id,
            updates: { status: "cancelled" }
          });
          break;
        case "request":
          await updateRequestMutation.mutateAsync({
            id,
            updates: { status: "cancelled" }
          });
          break;
        case "offer":
          await updateOfferMutation.mutateAsync({
            id,
            updates: { status: "cancelled" }
          });
          break;
        case "order":
          await updateOrderMutation.mutateAsync({
            id,
            updates: { status: "cancelled" }
          });
          break;
        case "shipment":
          await updateShipmentMutation.mutateAsync({
            id,
            updates: { status: "cancelled" }
          });
          break;
        default:
          throw new Error(`Unknown purchase type: ${purchaseType}`);
      }

      toast.success("Purchase rejected successfully");
    } catch (error) {
      console.error('Error rejecting purchase:', error);
      toast.error("Failed to reject purchase");
    }
  };

  // New receive payment handler for invoices
  const handleReceivePayment = (id: string) => {
    navigate(`/receive-payment/${id}`);
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
        <div className="flex-1 min-w-0">
          <PurchaseNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <PurchaseAddButton onAddPurchase={handleAddPurchaseClick} />
        </div>
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
        onReceivePayment={handleReceivePayment}
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
