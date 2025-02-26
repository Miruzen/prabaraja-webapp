
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { AddPurchaseDialog } from "@/components/AddPurchaseDialog";
import { StatsCards } from "@/components/purchases/StatsCards";
import { PurchaseFilters } from "@/components/purchases/PurchaseFilters";
import { TransactionsTable } from "@/components/purchases/TransactionsTable";
import { toast } from "sonner";

interface Transaction {
  id: string;
  date: Date;
  number: string;
  approver: string;
  dueDate: Date | null;
  status: "pending" | "completed" | "cancelled";
  itemCount: number;
  priority: "High" | "Medium" | "Low";
  tags: string[];
  type: "invoice" | "shipment" | "order" | "offer" | "request";
}

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: new Date(),
      number: "PO-2024001",
      approver: "John Doe",
      dueDate: new Date(),
      status: "pending",
      itemCount: 5,
      priority: "High",
      tags: ["Office Supplies"],
      type: "invoice",
    },
    {
      id: "2",
      date: new Date(),
      number: "SH-2024001",
      approver: "Jane Smith",
      dueDate: new Date(),
      status: "completed",
      itemCount: 3,
      priority: "Medium",
      tags: ["Electronics"],
      type: "shipment",
    },
  ]);

  const unpaidAmount = 15000000;
  const overdueCount = 3;
  const last30DaysPayments = 45000000;

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = activeTab === transaction.type + "s";
    const matchesStatus = statusFilter === "all" || statusFilter === transaction.status;
    return matchesType && matchesStatus;
  });

  const handleAddPurchase = (data: {
    date: string;
    number: string;
    approver: string;
    dueDate: string;
    status: "pending" | "completed" | "cancelled";
    itemCount: number;
    priority: "High" | "Medium" | "Low";
    tags: string[];
    type: "invoice" | "shipment" | "order" | "offer" | "request";
  }) => {
    const newTransaction: Transaction = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(data.date),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };
    setTransactions([...transactions, newTransaction]);
    toast.success("Purchase added successfully");
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-white">Purchases</h1>
            <p className="text-white/80">Manage your purchase transactions</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <StatsCards
            unpaidAmount={unpaidAmount}
            overdueCount={overdueCount}
            last30DaysPayments={last30DaysPayments}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="shipments">Shipments</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="offers">Offers</TabsTrigger>
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2" />
                Add New
              </Button>
            </div>

            <PurchaseFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            <TransactionsTable transactions={filteredTransactions} />
          </div>
        </div>
      </div>
      <AddPurchaseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPurchase}
      />
    </div>
  );
};

export default Purchases;
