import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChevronDown, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SalesData {
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
    date: "18/02/2025",
    number: "Sales Invoice #10005",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    balanceDue: "Rp 0",
    total: "Rp 13.440"
  },
  {
    date: "18/02/2025",
    number: "Sales Invoice #10004",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    balanceDue: "Rp 0",
    total: "Rp 133.440"
  },
  {
    date: "14/02/2025",
    number: "Sales Invoice #10003",
    customer: "Nanda goaw putra",
    dueDate: "16/03/2025",
    status: "Paid",
    balanceDue: "Rp 0",
    total: "Rp 106.560"
  },
];

const Sales = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] p-6">
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
              <div className="flex space-x-2">
                <Button variant="outline" className="w-40">
                  Invoice <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-40">
                  All status <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-[300px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <Button className="bg-indigo-600 text-white">
                  Create new sales <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"><input type="checkbox" /></TableHead>
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
                {salesData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell><input type="checkbox" /></TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="text-indigo-600">{row.number}</TableCell>
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
