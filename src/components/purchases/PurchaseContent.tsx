import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatsCards } from "@/components/purchases/StatsCards";
import { PurchaseFilters } from "@/components/purchases/PurchaseFilters";
import { TransactionsTable } from "@/components/purchases/TransactionsTable";
import { PurchaseTabControls } from "@/components/purchases/PurchaseTabControls";
import { PurchaseAddButton } from "@/components/purchases/PurchaseAddButton";
import { Purchase, PURCHASES_STORAGE_KEY, PurchaseType, PurchaseStatus } from "@/types/purchase";
import { isAfter, subDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function PurchaseContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
            paidAmount: purchase.paidAmount || 0,
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

  // Calculate stats
  useEffect(() => {
    if (transactions.length > 0) {
      // Unpaid amount (pending + half-paid invoices)
      const unpaidTotal = transactions
        .filter(t => (t.status === "pending" || t.status === "Half-paid") && t.type === "invoice")
        .reduce((sum, t) => t.status === "Half-paid" 
          ? sum + (t.amount - (t.paidAmount || 0))
          : sum + (t.amount || 0), 0);
      setUnpaidAmount(unpaidTotal);

      // Overdue invoices
      const today = new Date();
      const overdueInvoices = transactions.filter(t => 
        t.type === "invoice" && 
        (t.status === "pending" || t.status === "Half-paid") && 
        t.dueDate && 
        isAfter(today, t.dueDate)
      );
      setOverdueCount(overdueInvoices.length);

      // Recent payments
      const thirtyDaysAgo = subDays(new Date(), 30);
      const recentPayments = transactions
        .filter(t => t.status === "completed" && t.date && isAfter(t.date, thirtyDaysAgo))
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      setLast30DaysPayments(recentPayments);

      // Pending requests count
      const pendingCount = transactions.filter(t => 
        t.type === "request" && t.status === "pending"
      ).length;
      setPendingRequestCount(pendingCount);
    } else {
      // Reset all stats
      setUnpaidAmount(0);
      setOverdueCount(0);
      setLast30DaysPayments(0);
      setPendingRequestCount(0);
    }
  }, [transactions]);
  

  // Handle approve action
  const handleApproveTransaction = (id: string) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: "completed" as PurchaseStatus,
          type: "offer" as PurchaseType,
          // No need to redeclare properties already included in ...t
        };
      }
      return t;
    }) as Purchase[];
    
    setTransactions(updatedTransactions);
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedTransactions));
    
    toast({
      title: "✓ Approved",
      description: "Request moved to Offers",
      variant: "default",
      className: "border-green-300 bg-green-50 text-green-700",
    });
  };

  // Handle reject action
  const handleRejectTransaction = (id: string) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: "cancelled" as PurchaseStatus
        };
      }
      return t;
    }) as Purchase[];
    
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
      description: "Transaction removed",
      variant: "default",
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "approval") {
      return transaction.type === "request" && transaction.status === "pending";
    }
    
    const matchesType = activeTab === transaction.type + "s";
    const matchesStatus = statusFilter === "all" || statusFilter === transaction.status;
    return matchesType && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />
      
      <StatsCards
        unpaidAmount={unpaidAmount}
        overdueCount={overdueCount}
        last30DaysPayments={last30DaysPayments}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <PurchaseTabControls
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === "approval") setStatusFilter("pending");
            }}
            pendingRequestCount={pendingRequestCount}
          />
        </div>

        <div className="flex justify-between items-center">
          <PurchaseFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            disabled={activeTab === "approval"}
          />
          
          <PurchaseAddButton onAddPurchase={(type) => navigate(`/create-new-purchase?type=${type}`)} />
        </div>

        <TransactionsTable
          transactions={filteredTransactions}
          activeTab={activeTab}
          onDeleteTransaction={handleDeleteTransaction}
          onApproveTransaction={activeTab === "approval" ? handleApproveTransaction : undefined}
          onRejectTransaction={activeTab === "approval" ? handleRejectTransaction : undefined}
        />
      </div>
    </div>
  );
}