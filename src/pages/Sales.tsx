import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, DollarSign, CheckCircle, Clock, AlertTriangle, ChevronDown, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  dueDate: string;
  status: string;
  total: string;
}

const salesData: SalesData[] = [
  // Paid examples (5)
  {
    id: "10005",
    date: "18/02/2025",
    number: "Sales Invoice #10005",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    total: "Rp 13.440"
  },
  {
    id: "10004",
    date: "18/02/2025",
    number: "Sales Invoice #10004",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    total: "Rp 133.440"
  },
  {
    id: "10003",
    date: "14/02/2025",
    number: "Sales Invoice #10003",
    customer: "Nanda goaw putra",
    dueDate: "16/03/2025",
    status: "Paid",
    total: "Rp 106.560"
  },
  {
    id: "10002",
    date: "10/02/2025",
    number: "Sales Invoice #10002",
    customer: "Sutejo Enterprises",
    dueDate: "10/02/2025",
    status: "Paid",
    total: "Rp 245.000"
  },
  {
    id: "10001",
    date: "05/02/2025",
    number: "Sales Invoice #10001",
    customer: "Pak Budi Store",
    dueDate: "05/02/2025",
    status: "Paid",
    total: "Rp 89.750"
  },
  
  // Unpaid examples (5)
  {
    id: "10006",
    date: "22/02/2025",
    number: "Sales Invoice #10006",
    customer: "Toko Makmur",
    dueDate: "10/03/2025",
    status: "Unpaid",
    total: "Rp 320.500"
  },
  {
    id: "10007",
    date: "23/02/2025",
    number: "Sales Invoice #10007",
    customer: "CV Berkah",
    dueDate: "15/03/2025",
    status: "Unpaid",
    total: "Rp 175.200"
  },
  {
    id: "10008",
    date: "25/02/2025",
    number: "Sales Invoice #10008",
    customer: "PT Maju Jaya",
    dueDate: "25/03/2025",
    status: "Unpaid",
    total: "Rp 425.750"
  },
  {
    id: "10009",
    date: "26/02/2025",
    number: "Sales Invoice #10009",
    customer: "Ibu Sari Catering",
    dueDate: "26/03/2025",
    status: "Unpaid",
    total: "Rp 92.800"
  },
  {
    id: "10010",
    date: "28/02/2025",
    number: "Sales Invoice #10010",
    customer: "Warung Padang",
    dueDate: "28/03/2025",
    status: "Unpaid",
    total: "Rp 65.000"
  },
  
  // Late Payment examples (5)
  {
    id: "9995",
    date: "10/01/2025",
    number: "Sales Invoice #9995",
    customer: "Supermarket Indah",
    dueDate: "10/02/2025",
    status: "Late Payment",
    total: "Rp 456.000"
  },
  {
    id: "9996",
    date: "15/01/2025",
    number: "Sales Invoice #9996",
    customer: "Restoran Sedap",
    dueDate: "15/02/2025",
    status: "Late Payment",
    total: "Rp 215.700"
  },
  {
    id: "9997",
    date: "18/01/2025",
    number: "Sales Invoice #9997",
    customer: "Toko Elektronik",
    dueDate: "18/02/2025",
    status: "Late Payment",
    total: "Rp 650.250"
  },
  {
    id: "9998",
    date: "20/01/2025",
    number: "Sales Invoice #9998",
    customer: "Apotek Sehat",
    dueDate: "20/02/2025",
    status: "Late Payment",
    total: "Rp 125.400"
  },
  {
    id: "9999",
    date: "25/01/2025",
    number: "Sales Invoice #9999",
    customer: "PT Textile Indonesia",
    dueDate: "25/02/2025",
    status: "Late Payment",
    total: "Rp 875.000"
  },
  
  // Awaiting Payment examples (5)
  {
    id: "10011",
    date: "01/03/2025",
    number: "Sales Invoice #10011",
    customer: "Hotel Merdeka",
    dueDate: "15/03/2025",
    status: "Awaiting Payment",
    total: "Rp 520.000"
  },
  {
    id: "10012",
    date: "02/03/2025",
    number: "Sales Invoice #10012",
    customer: "Toko Bangunan Jaya",
    dueDate: "16/03/2025",
    status: "Awaiting Payment",
    total: "Rp 327.500"
  },
  {
    id: "10013",
    date: "03/03/2025",
    number: "Sales Invoice #10013",
    customer: "Bengkel Motor Cepat",
    dueDate: "17/03/2025",
    status: "Awaiting Payment",
    total: "Rp 85.300"
  },
  {
    id: "10014",
    date: "04/03/2025",
    number: "Sales Invoice #10014",
    customer: "Salon Cantik",
    dueDate: "18/03/2025",
    status: "Awaiting Payment",
    total: "Rp 142.500"
  },
  {
    id: "10015",
    date: "05/03/2025",
    number: "Sales Invoice #10015",
    customer: "Klinik Hewan",
    dueDate: "19/03/2025",
    status: "Awaiting Payment",
    total: "Rp 275.800"
  }
];

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

const Sales = () => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const navigate = useNavigate();
  
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
              <Button variant="link" className="text-indigo-600 font-medium">Delivery</Button>
              <Button variant="link" className="text-gray-500">Order</Button>
              <Button variant="link" className="text-gray-500">Quotation</Button>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                {/* Category Filter Dropdown */}
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
                <Button 
                  className="bg-indigo-600 text-white"
                  onClick={() => navigate('/create-new-sales')}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Create new sales
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
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
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        row.status === "Paid" 
                          ? "bg-green-100 text-green-800" 
                          : row.status === "Unpaid"
                            ? "bg-orange-100 text-orange-800"
                            : row.status === "Late Payment"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {row.status}
                      </span>
                    </TableCell>
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
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      {salesData.filter(sale => sale.status === "Unpaid").length}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-semibold">
                      Rp {salesData
                        .filter(sale => sale.status === "Unpaid")
                        .reduce((total, sale) => {
                          const amount = parseFloat(sale.total.replace("Rp ", "").replace(".", ""));
                          return total + amount;
                        }, 0)
                        .toLocaleString('id-ID')}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Payments received last 30 days</h3>
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      {salesData.filter(sale => sale.status === "Paid").length}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-semibold">
                      Rp {salesData
                        .filter(sale => sale.status === "Paid")
                        .reduce((total, sale) => {
                          const amount = parseFloat(sale.total.replace("Rp ", "").replace(".", ""));
                          return total + amount;
                        }, 0)
                        .toLocaleString('id-ID')}
                    </div>
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
