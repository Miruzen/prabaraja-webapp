
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AddPurchaseDialog } from "@/components/AddPurchaseDialog";
import { StatsCards } from "@/components/purchases/StatsCards";
import { PurchaseFilters } from "@/components/purchases/PurchaseFilters";
import { TransactionsTable } from "@/components/purchases/TransactionsTable";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseTabControls } from "@/components/purchases/PurchaseTabControls";
import { Purchase, PURCHASES_STORAGE_KEY, PurchaseType } from "@/types/purchase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, isAfter, parseISO, subDays } from "date-fns";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
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
            dueDate: purchase.dueDate ? new Date(purchase.dueDate) : null
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

  const handleAddPurchase = (formData: any) => {
    // Create a new purchase object
    const newPurchase: Purchase = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(formData.date),
      number: formData.number,
      approver: formData.approver,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      status: formData.status,
      itemCount: formData.itemCount,
      priority: formData.priority,
      tags: formData.tags,
      type: formData.type,
      items: []
    };

    // Add the new purchase to the transactions list
    const updatedTransactions = [...transactions, newPurchase];
    setTransactions(updatedTransactions);

    // Save to localStorage
    try {
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedTransactions));
      toast.success(`New ${formData.type} added successfully!`);
    } catch (error) {
      console.error("Error saving purchase to localStorage:", error);
      toast.error("Failed to save purchase. Please try again.");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Set the purchase type based on the active tab (remove the 's' at the end)
    const type = tab.endsWith('s') ? tab.slice(0, -1) : tab;
    setPurchaseType(type as PurchaseType);
  };

  const openAddDialog = () => {
    // Set the purchase type based on the active tab (remove the 's' at the end)
    const type = activeTab.endsWith('s') ? activeTab.slice(0, -1) : activeTab;
    setPurchaseType(type as PurchaseType);
    setIsAddDialogOpen(true);
  };

  const showEmptyState = filteredTransactions.length === 0;

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseHeader />

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
              <Button onClick={openAddDialog} className="ml-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Button>
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
      </div>

      <AddPurchaseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPurchase}
        defaultType={purchaseType}
      />
    </div>
  );
};

export default Purchases;
