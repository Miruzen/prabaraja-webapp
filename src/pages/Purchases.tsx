import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AddPurchaseDialog } from "@/components/AddPurchaseDialog";
import { StatsCards } from "@/components/purchases/StatsCards";
import { PurchaseFilters } from "@/components/purchases/PurchaseFilters";
import { TransactionsTable } from "@/components/purchases/TransactionsTable";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseTabControls } from "@/components/purchases/PurchaseTabControls";
import { Purchase, PURCHASES_STORAGE_KEY } from "@/types/purchase";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [purchaseType, setPurchaseType] = useState<"invoice" | "shipment" | "order" | "offer" | "request">("invoice");
  const [transactions, setTransactions] = useState<Purchase[]>([]);

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

  const unpaidAmount = 15000000;
  const overdueCount = 3;
  const last30DaysPayments = 45000000;

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = activeTab === transaction.type + "s";
    const matchesStatus = statusFilter === "all" || statusFilter === transaction.status;
    return matchesType && matchesStatus;
  });

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
            <PurchaseTabControls
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <PurchaseFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

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
    </div>
  );
};

export default Purchases;
