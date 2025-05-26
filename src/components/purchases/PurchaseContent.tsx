
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Purchase, PurchaseType, InvoicePurchase } from "@/types/purchase";
import { PurchaseNavTabs } from "./PurchaseNavTabs";
import { PurchaseFilters } from "./PurchaseFilters";
import { PurchaseAddButton } from "./PurchaseAddButton";
import { StatsCards } from "./StatsCards";
import { TransactionsTable } from "./TransactionsTable";
import { AddPurchaseDialog } from "@/components/AddPurchaseDialog";
import { useCreateInvoice, useDeleteInvoice, useUpdateInvoice, Invoice } from "@/hooks/usePurchases";

interface PurchaseContentProps {
  invoices: Invoice[];
}

export function PurchaseContent({ invoices }: PurchaseContentProps) {
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const createInvoiceMutation = useCreateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();
  const updateInvoiceMutation = useUpdateInvoice();

  // Transform Supabase invoices to Purchase format
  const transformedPurchases: Purchase[] = invoices.map(invoice => ({
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
    paidAmount: 0 // This would need to be tracked separately
  } as InvoicePurchase));

  // Filter purchases based on active tab, search and status
  const filteredPurchases = transformedPurchases.filter(purchase => {
    // Tab filter - for now we only have invoices data, so show invoices for all tabs
    const matchesTab = activeTab === "invoices" || 
                      (activeTab === "shipments" && purchase.type === "shipment") ||
                      (activeTab === "orders" && purchase.type === "order") ||
                      (activeTab === "offers" && purchase.type === "offer") ||
                      (activeTab === "requests" && purchase.type === "request") ||
                      (activeTab === "approval" && purchase.status === "pending");
    
    const matchesSearch = search === "" || 
      purchase.number.toLowerCase().includes(search.toLowerCase()) ||
      purchase.approver.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  // Calculate stats for StatsCards
  const unpaidAmount = transformedPurchases
    .filter(p => p.status === "pending" || p.status === "Half-paid")
    .reduce((total, p) => total + p.amount, 0);

  const overdueCount = transformedPurchases
    .filter(p => p.status === "pending" && new Date(p.dueDate || 0) < new Date())
    .length;

  const last30DaysPayments = transformedPurchases
    .filter(p => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return p.status === "completed" && new Date(p.date) >= thirtyDaysAgo;
    })
    .reduce((total, p) => total + p.amount, 0);

  const handleAddPurchase = async (data: any) => {
    try {
      const invoiceData = {
        number: parseInt(data.number.replace(/\D/g, '')),
        type: data.type,
        date: data.date,
        due_date: data.dueDate,
        status: data.status,
        approver: data.approver,
        tags: data.tags,
        items: [],
        tax_calculation_method: false,
        grand_total: 0
      };

      await createInvoiceMutation.mutateAsync(invoiceData);
      setIsDialogOpen(false);
      toast.success("Purchase created successfully");
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast.error("Failed to create purchase");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteInvoiceMutation.mutateAsync(id);
      toast.success("Purchase deleted successfully");
    } catch (error) {
      console.error('Error deleting purchase:', error);
      toast.error("Failed to delete purchase");
    }
  };

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

  const handleAddPurchaseClick = (type: PurchaseType) => {
    navigate(`/create-new-purchase?type=${type}`);
  };

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
        searchValue={search}
        onSearchChange={setSearch}
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
