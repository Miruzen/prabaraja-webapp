// src/components/purchases/PurchaseContent.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatsCards } from "@/components/purchases/StatsCards";
import { PurchaseFilters } from "@/components/purchases/PurchaseFilters";
import { TransactionsTable } from "@/components/purchases/TransactionsTable";
import { PurchaseTabControls } from "@/components/purchases/PurchaseTabControls";
import { PurchaseAddButton } from "@/components/purchases/PurchaseAddButton";
import { 
  Purchase, 
  PURCHASES_STORAGE_KEY, 
  PurchaseType, 
  PurchaseStatus,
  isInvoice,
  isShipment,
  isOrder,
  isOffer,
  isRequest,
  InvoicePurchase,
  RequestPurchase,
  OfferPurchase
} from "@/types/purchase";
import { isAfter, subDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ShipmentsTable } from "./tables/ShipmentsTable";
import { InvoicesTable } from "./tables/InvoicesTable";
import { OrdersTable } from "./tables/OrdersTable";
import { OffersTable } from "./tables/OffersTable";
import { RequestsTable } from "./tables/RequestsTable";

export function PurchaseContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchValue, setSearchValue] = useState<string>(""); // Added searchValue state
  const [transactions, setTransactions] = useState<Purchase[]>([]);
  const [pendingRequestCount, setPendingRequestCount] = useState<number>(0);
  
  // Stats calculations
  const [unpaidAmount, setUnpaidAmount] = useState<number>(0);
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [last30DaysPayments, setLast30DaysPayments] = useState<number>(0);

  // Load purchases from localStorage
  useEffect(() => {
    const loadPurchasesFromStorage = () => {
      const storedPurchases = localStorage.getItem(PURCHASES_STORAGE_KEY);
      if (storedPurchases) {
        try {
          const parsedPurchases = JSON.parse(storedPurchases);
          const purchasesWithDates = parsedPurchases.map((purchase: any) => ({
            ...purchase,
            date: new Date(purchase.date),
            dueDate: purchase.dueDate ? new Date(purchase.dueDate) : null,
            shippingDate: purchase.shippingDate ? new Date(purchase.shippingDate) : null,
            orderDate: purchase.orderDate ? new Date(purchase.orderDate) : null,
            expiryDate: purchase.expiryDate ? new Date(purchase.expiryDate) : null,
            amount: purchase.amount || 0,
            paidAmount: isInvoice(purchase) ? purchase.paidAmount || 0 : undefined,
            status: purchase.status as PurchaseStatus,
            type: purchase.type as PurchaseType,
            itemCount: purchase.items?.length || 0
          }));
          setTransactions(purchasesWithDates);
        } catch (error) {
          console.error("Error loading purchases:", error);
        }
      }
    };
    loadPurchasesFromStorage();
    window.addEventListener('storage', loadPurchasesFromStorage);
    return () => window.removeEventListener('storage', loadPurchasesFromStorage);
  }, []);

  // Calculate stats and pending requests count
  useEffect(() => {
    if (transactions.length > 0) {
      // Calculate unpaid amount (only for invoices)
      const unpaidTotal = transactions
        .filter(isInvoice) // First filter only invoices
        .filter(t => t.status === "pending" || t.status === "Half-paid")
        .reduce((sum, t) => {
          // Now we know t is InvoicePurchase, so paidAmount is safe
          return t.status === "Half-paid" 
            ? sum + (t.amount - (t.paidAmount || 0))
            : sum + t.amount;
        }, 0);
      setUnpaidAmount(unpaidTotal);

      // Calculate overdue invoices count
      const today = new Date();
      const overdueInvoices = transactions
        .filter(isInvoice)
        .filter(t => (t.status === "pending" || t.status === "Half-paid") && t.dueDate && isAfter(today, t.dueDate));
      setOverdueCount(overdueInvoices.length);

      // Calculate payments in last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      const recentPayments = transactions
        .filter(t => t.status === "completed" && t.date && isAfter(t.date, thirtyDaysAgo))
        .reduce((sum, t) => sum + t.amount, 0);
      setLast30DaysPayments(recentPayments);

      // Calculate pending requests count
      const pendingCount = transactions.filter(isRequest).filter(t => t.status === "pending").length;
      setPendingRequestCount(pendingCount);
    } else {
      setUnpaidAmount(0);
      setOverdueCount(0);
      setLast30DaysPayments(0);
      setPendingRequestCount(0);
    }
  }, [transactions]);

  // Handle approve action
  const handleApproveTransaction = (id: string) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === id && isRequest(t)) {
        // Explicitly create a new OfferPurchase with all required fields
        const approvedOffer: OfferPurchase = {
          ...t,
          id: t.id,
          type: "offer",
          status: "pending", // Changed from "completed" to "pending"
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          discountTerms: "Standard terms apply",
          // Include all base purchase fields
          date: t.date,
          number: t.number,
          approver: t.approver,
          tags: t.tags,
          items: t.items,
          amount: t.amount,
          itemCount: t.itemCount
        };
        return approvedOffer;
      }
      return t;
    });
    
    setTransactions(updatedTransactions as Purchase[]);
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedTransactions));
    
    toast({
      title: "✓ Approved",
      description: "Request has been approved and moved to Offers with pending status",
      variant: "default",
      className: "border-green-300 bg-green-50 text-green-700",
    });
  };

  // Handle reject action
  const handleRejectTransaction = (id: string) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === id && isRequest(t)) {
        // Explicitly return as RequestPurchase with updated status
        return {
          ...t,
          status: "cancelled" as const
        };
      }
      return t;
    });
    
    setTransactions(updatedTransactions);
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedTransactions));
    
    toast({
      title: "✗ Rejected",
      description: "Request has been cancelled",
      variant: "destructive",
    });
  };

  // Handle delete action
  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedTransactions));
    
    toast({
      title: "Deleted",
      description: "Transaction removed successfully",
      variant: "default",
    });
  };

  // Filter transactions based on active tab and search value
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "approval") {
      return isRequest(transaction) && transaction.status === "pending";
    }
    
    const matchesType = activeTab === transaction.type + "s";
    const matchesStatus = statusFilter === "all" || statusFilter === transaction.status;
    const matchesSearch = searchValue 
      ? transaction.number.toLowerCase().includes(searchValue.toLowerCase())
      : true;
    return matchesType && matchesStatus && matchesSearch;
  });

  // Handle tab change
  const handleTabChange = (tab: string) => {
    if (activeTab === "approval" && tab !== "approval") {
      setStatusFilter("all");
    }
    setActiveTab(tab);
  };

  const handleReceivePayment = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction && isInvoice(transaction)) {
      // Now TypeScript knows transaction is InvoicePurchase
      navigate(`/receive-payment/${id}`, { 
        state: { 
          invoiceId: transaction.id,
          amountDue: transaction.amount - (transaction.paidAmount || 0)
        } 
      });
    }
  };

  const renderTable = () => {
    switch(activeTab) {
      case "invoices":
        return (
          <InvoicesTable
            invoices={filteredTransactions.filter(isInvoice)}
            onDelete={handleDeleteTransaction}
            onEdit={(id) => navigate(`/edit-purchase/${id}`)}
            onReceivePayment={handleReceivePayment}
          />
        );
      case "shipments":
        return (
          <ShipmentsTable
            shipments={filteredTransactions.filter(isShipment)}
            onDelete={handleDeleteTransaction}
            onEdit={(id) => navigate(`/edit-purchase/${id}`)}
          />
        );
      case "orders":
        return (
          <OrdersTable
            orders={filteredTransactions.filter(isOrder)}
            onDelete={handleDeleteTransaction}
            onEdit={(id) => navigate(`/edit-purchase/${id}`)}
          />
        );
      case "offers":
        return (
          <OffersTable
            offers={filteredTransactions.filter(isOffer)}
            onDelete={handleDeleteTransaction}
            onEdit={(id) => navigate(`/edit-purchase/${id}`)}
          />
        );
      case "requests":
        return (
          <RequestsTable
            requests={filteredTransactions.filter(isRequest)}
            onDelete={handleDeleteTransaction}
            onEdit={(id) => navigate(`/edit-purchase/${id}`)}
          />
        );
      case "approval":
        return (
          <TransactionsTable
            transactions={filteredTransactions}
            activeTab={activeTab}
            onDeleteTransaction={handleDeleteTransaction}
            onApproveTransaction={handleApproveTransaction}
            onRejectTransaction={handleRejectTransaction}
          />
        );
      default:
        return (
          <TransactionsTable
            transactions={filteredTransactions}
            activeTab={activeTab}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
    }
  };

  return (
    <div className="max-w-full mx-auto p-6">
      <Toaster />
      
      <StatsCards
        unpaidAmount={unpaidAmount}
        overdueCount={overdueCount}
        last30DaysPayments={last30DaysPayments}
        pendingApprovalCount={pendingRequestCount}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <PurchaseTabControls
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            pendingRequestCount={pendingRequestCount}
          />
        </div>

        <div className="flex justify-between items-center">
          <PurchaseFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            showStatusFilter={activeTab !== "approval"}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
          
          <PurchaseAddButton onAddPurchase={(type) => navigate(`/create-new-purchase?type=${type}`)} />
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">
              {activeTab === "approval" 
                ? "No transactions requiring approval"
                : `There haven't been any ${activeTab.slice(0, -1)} added yet`}
            </p>
            <p className="text-sm text-gray-400">Use the Add New button to create one.</p>
          </div>
        ) : (
          renderTable()
        )}
      </div>
    </div>
  );
};
