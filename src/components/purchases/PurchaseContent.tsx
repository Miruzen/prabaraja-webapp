import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatsCards } from "@/components/purchases/StatsCards";
import { PurchaseFilters } from "@/components/purchases/PurchaseFilters";
import { TransactionsTable } from "@/components/purchases/TransactionsTable";
import { PurchaseTabControls } from "@/components/purchases/PurchaseTabControls";
import { PurchaseAddButton } from "@/components/purchases/PurchaseAddButton";
import { Purchase, PURCHASES_STORAGE_KEY, PurchaseType } from "@/types/purchase";
import { isAfter, parseISO, subDays } from "date-fns";

export function PurchaseContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("invoice");
  const [transactions, setTransactions] = useState<Purchase[]>([]);
  
  // Stats calculations
  const [unpaidAmount, setUnpaidAmount] = useState<number>(0);
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [last30DaysPayments, setLast30DaysPayments] = useState<number>(0);

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
            expiryDate: purchase.expiryDate ? new Date(purchase.expiryDate) : null
          }));
          setTransactions(purchasesWithDates);
        } catch (error) {
          console.error("Error loading purchases from localStorage:", error);
        }
      }
    };

    loadPurchasesFromStorage();

    window.addEventListener('storage', loadPurchasesFromStorage);

    return () => {
      window.removeEventListener('storage', loadPurchasesFromStorage);
    };
  }, []);

  useEffect(() => {
    // Calculate stats based on the current transactions
    if (transactions.length > 0) {
      // Calculate unpaid amount
      const unpaidTotal = transactions
        .filter(t => t.status === "pending" && t.type === "invoice")
        .reduce((sum, t) => {
          // Calculate total from items if available
          if (t.items && t.items.length > 0) {
            return sum + t.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
          }
          return sum;
        }, 0);
      setUnpaidAmount(unpaidTotal);

      // Calculate overdue invoices count
      const today = new Date();
      const overdueInvoices = transactions.filter(t => {
        return t.type === "invoice" && 
              t.status === "pending" && 
              t.dueDate && 
              isAfter(today, t.dueDate);
      });
      setOverdueCount(overdueInvoices.length);

      // Calculate payments in the last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      const recentPayments = transactions
        .filter(t => {
          return t.status === "completed" && 
                t.date && 
                isAfter(t.date, thirtyDaysAgo);
        })
        .reduce((sum, t) => {
          // Calculate total from items if available
          if (t.items && t.items.length > 0) {
            return sum + t.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
          }
          return sum;
        }, 0);
      setLast30DaysPayments(recentPayments);
    } else {
      // Reset stats if no transactions
      setUnpaidAmount(0);
      setOverdueCount(0);
      setLast30DaysPayments(0);
    }
  }, [transactions]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = activeTab === transaction.type + "s";
    const matchesStatus = statusFilter === "all" || statusFilter === transaction.status;
    return matchesType && matchesStatus;
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Set the purchase type based on the active tab (remove the 's' at the end)
    const type = tab.endsWith('s') ? tab.slice(0, -1) : tab;
    setPurchaseType(type as PurchaseType);
  };

  // Create new navigation function to go to create purchase page
  const navigateToCreatePurchase = (type: PurchaseType) => {
    navigate(`/create-new-purchase?type=${type}`);
  };

  const showEmptyState = filteredTransactions.length === 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <StatsCards
        unpaidAmount={unpaidAmount}
        overdueCount={overdueCount}
        last30DaysPayments={last30DaysPayments}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <PurchaseTabControls
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <PurchaseFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          <PurchaseAddButton onAddPurchase={navigateToCreatePurchase} />
        </div>

        {showEmptyState ? (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">There haven't been any {activeTab.slice(0, -1)} added to the table yet.</p>
            <p className="text-sm text-gray-400">Use the Add New button to create one.</p>
          </div>
        ) : (
          <TransactionsTable transactions={filteredTransactions} />
        )}
      </div>
    </div>
  );
}