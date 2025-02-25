
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface Transaction {
  id: string;
  date: Date;
  number: string;
  approver: string;
  dueDate: Date | null;
  status: string;
  itemCount: number;
  priority: "High" | "Medium" | "Low";
  tags: string[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for demonstration
  const unpaidAmount = 15000000;
  const overdueCount = 3;
  const last30DaysPayments = 45000000;

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-white">Purchases</h1>
            <p className="text-white/80">Manage your purchase transactions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Unpaid Invoices */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Unpaid Invoices</h3>
              <p className="text-2xl font-bold mt-2">{formatCurrency(unpaidAmount)}</p>
              <div className="flex items-center mt-2">
                <span className="text-orange-500 text-sm">Pending Payment</span>
              </div>
            </div>

            {/* Overdue Invoices */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Overdue Invoices</h3>
              <p className="text-2xl font-bold mt-2">{overdueCount} invoices</p>
              <div className="flex items-center mt-2">
                <span className="text-red-500 text-sm">Requires Immediate Action</span>
              </div>
            </div>

            {/* Last 30 Days Payments */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Last 30 Days Payments</h3>
              <p className="text-2xl font-bold mt-2">{formatCurrency(last30DaysPayments)}</p>
              <div className="flex items-center mt-2">
                <span className="text-green-500 text-sm">Total Expenses</span>
              </div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="invoices" className="w-full">
                <TabsList>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="shipments">Shipments</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="offers">Offers</TabsTrigger>
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button>
                <Plus className="mr-2" />
                Add New
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>

            {/* Transactions Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>No.</TableHead>
                    <TableHead>Staff Approval</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Example row */}
                  <TableRow>
                    <TableCell>{format(new Date(), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>PO-2024001</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>{format(new Date(), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell>5 items</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High
                      </span>
                    </TableCell>
                    <TableCell>Office Supplies</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
