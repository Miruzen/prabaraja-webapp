
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, DollarSign, CheckCircle, Clock, AlertTriangle, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  dueDate: string;
  status: string;
  balanceDue: string;
  total: string;
}

const salesData: SalesData[] = [
  {
    id: "10005",
    date: "18/02/2025",
    number: "Sales Invoice #10005",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    balanceDue: "Rp 0",
    total: "Rp 13.440"
  },
  {
    id: "10004",
    date: "18/02/2025",
    number: "Sales Invoice #10004",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    balanceDue: "Rp 0",
    total: "Rp 133.440"
  },
  {
    id: "10003",
    date: "14/02/2025",
    number: "Sales Invoice #10003",
    customer: "Nanda goaw putra",
    dueDate: "16/03/2025",
    status: "Paid",
    balanceDue: "Rp 0",
    total: "Rp 106.560"
  },
];

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

const Sales = () => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  
  // Filter sales data based on selected category
  const filteredSalesData = filterCategory === "all" 
    ? salesData 
    : salesData.filter(sale => {
        switch(filterCategory) {
          case "paid":
            return sale.status === "Paid";
          case "unpaid":
            return sale.status === "Unpaid";
          case "late":
            return sale.status === "Late Payment";
          case "awaiting":
            return sale.status === "Awaiting Payment";
          default:
            return true;
        }
      });
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Sales</h1>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center space-x-6 border-b border-gray-200 pb-4">
              <Button variant="link" className="text-indigo-600 font-medium">Invoice</Button>
              <Button variant="link" className="text-gray-500">Delivery</Button>
              <Button variant="link" className="text-gray-500">Order</Button>
              <Button variant="link" className="text-gray-500">Quotation</Button>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <Button variant="outline" className="w-40">
                  Invoice
                </Button>
                
                {/* Filter Dropdown */}
                <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as FilterCategory)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unpaid">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-orange-500" />
                        <span>Unpaid</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="paid">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Paid</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="late">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Late Payment</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="awaiting">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>Awaiting Payment</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2 items-end">
                <Button className="bg-indigo-600 text-white">
                  Create new sales
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance due</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalesData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Link to={`/invoice/${row.id}`} className="text-indigo-600 hover:underline">
                        {row.number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-indigo-600">{row.customer}</TableCell>
                    <TableCell>{row.dueDate}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>{row.balanceDue}</TableCell>
                    <TableCell>{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Unpaid invoices</h3>
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">0</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-semibold">Rp 0</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Payments received last 30 days</h3>
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">5</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-semibold">Rp 310.860</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
