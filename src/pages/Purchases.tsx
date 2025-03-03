import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AddPurchaseDialog } from "@/components/AddPurchaseDialog";
import { StatsCards } from "@/components/purchases/StatsCards";
import { PurchaseFilters } from "@/components/purchases/PurchaseFilters";
import { TransactionsTable } from "@/components/purchases/TransactionsTable";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseTabControls } from "@/components/purchases/PurchaseTabControls";

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
  const [purchaseType, setPurchaseType] = useState<"invoice" | "shipment" | "order" | "offer" | "request">("invoice");
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Invoice examples
    {
      id: "1",
      date: new Date(2024, 3, 15),
      number: "INV-2024001",
      approver: "John Doe",
      dueDate: new Date(2024, 4, 15),
      status: "pending",
      itemCount: 5,
      priority: "High",
      tags: ["Office Supplies"],
      type: "invoice",
    },
    {
      id: "2",
      date: new Date(2024, 3, 10),
      number: "INV-2024002",
      approver: "Jane Smith",
      dueDate: new Date(2024, 4, 10),
      status: "completed",
      itemCount: 3,
      priority: "Medium",
      tags: ["Electronics"],
      type: "invoice",
    },
    {
      id: "3",
      date: new Date(2024, 3, 5),
      number: "INV-2024003",
      approver: "Robert Johnson",
      dueDate: new Date(2024, 4, 5),
      status: "cancelled",
      itemCount: 7,
      priority: "Low",
      tags: ["Furniture"],
      type: "invoice",
    },
    
    // Shipment examples
    {
      id: "4",
      date: new Date(2024, 3, 12),
      number: "SH-2024001",
      approver: "Emily Brown",
      dueDate: new Date(2024, 3, 19),
      status: "pending",
      itemCount: 2,
      priority: "High",
      tags: ["International"],
      type: "shipment",
    },
    {
      id: "5",
      date: new Date(2024, 3, 8),
      number: "SH-2024002",
      approver: "Michael Wilson",
      dueDate: new Date(2024, 3, 15),
      status: "completed",
      itemCount: 4,
      priority: "Medium",
      tags: ["Domestic", "Fragile"],
      type: "shipment",
    },
    {
      id: "6",
      date: new Date(2024, 3, 3),
      number: "SH-2024003",
      approver: "Sarah Taylor",
      dueDate: new Date(2024, 3, 10),
      status: "pending",
      itemCount: 1,
      priority: "Low",
      tags: ["Express"],
      type: "shipment",
    },
    
    // Order examples
    {
      id: "7",
      date: new Date(2024, 3, 14),
      number: "ORD-2024001",
      approver: "David Martinez",
      dueDate: new Date(2024, 4, 14),
      status: "pending",
      itemCount: 10,
      priority: "High",
      tags: ["Wholesale"],
      type: "order",
    },
    {
      id: "8",
      date: new Date(2024, 3, 9),
      number: "ORD-2024002",
      approver: "Jessica Anderson",
      dueDate: new Date(2024, 4, 9),
      status: "completed",
      itemCount: 15,
      priority: "Medium",
      tags: ["Retail"],
      type: "order",
    },
    {
      id: "9",
      date: new Date(2024, 3, 4),
      number: "ORD-2024003",
      approver: "Thomas Clark",
      dueDate: new Date(2024, 4, 4),
      status: "cancelled",
      itemCount: 8,
      priority: "Low",
      tags: ["Seasonal"],
      type: "order",
    },
    
    // Offer examples
    {
      id: "10",
      date: new Date(2024, 3, 13),
      number: "OFR-2024001",
      approver: "Laura Rodriguez",
      dueDate: new Date(2024, 4, 13),
      status: "pending",
      itemCount: 6,
      priority: "High",
      tags: ["Promotion"],
      type: "offer",
    },
    {
      id: "11",
      date: new Date(2024, 3, 7),
      number: "OFR-2024002",
      approver: "Daniel Lewis",
      dueDate: new Date(2024, 4, 7),
      status: "completed",
      itemCount: 12,
      priority: "Medium",
      tags: ["Discount"],
      type: "offer",
    },
    {
      id: "12",
      date: new Date(2024, 3, 2),
      number: "OFR-2024003",
      approver: "Olivia Lee",
      dueDate: new Date(2024, 4, 2),
      status: "cancelled",
      itemCount: 9,
      priority: "Low",
      tags: ["Bundle"],
      type: "offer",
    },
    
    // Request examples
    {
      id: "13",
      date: new Date(2024, 3, 11),
      number: "REQ-2024001",
      approver: "James Walker",
      dueDate: new Date(2024, 4, 11),
      status: "pending",
      itemCount: 3,
      priority: "High",
      tags: ["Urgent"],
      type: "request",
    },
    {
      id: "14",
      date: new Date(2024, 3, 6),
      number: "REQ-2024002",
      approver: "Sophia Hall",
      dueDate: new Date(2024, 4, 6),
      status: "completed",
      itemCount: 5,
      priority: "Medium",
      tags: ["Standard"],
      type: "request",
    },
    {
      id: "15",
      date: new Date(2024, 3, 1),
      number: "REQ-2024003",
      approver: "William Young",
      dueDate: new Date(2024, 4, 1),
      status: "pending",
      itemCount: 2,
      priority: "Low",
      tags: ["Internal"],
      type: "request",
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
