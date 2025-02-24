
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";

interface ExpenseData {
  date: string;
  number: string;
  category: string;
  beneficiary: string;
  status: string;
  balanceDue: string;
  total: string;
  tags?: string[];
}

const expensesData: ExpenseData[] = [
  {
    date: "18-02-2025",
    number: "Expense #10002",
    category: "Cost of Sales",
    beneficiary: "Nanda",
    status: "Paid",
    balanceDue: "Rp. 0,00",
    total: "Rp. 15.000,00",
  },
  {
    date: "13-02-2025",
    number: "Expense #10001",
    category: "Fuel, Toll and Parking - General",
    beneficiary: "Nanda",
    status: "Paid",
    balanceDue: "Rp. 0,00",
    total: "Rp. 500.000,00",
  },
];

const Expenses = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">List of Expense</h1>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center space-x-6 border-b border-gray-200 pb-4">
              <Button variant="link" className="text-blue-500 font-medium">
                Expenses
              </Button>
              <Button variant="link" className="text-gray-500">
                Require Approval
              </Button>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {/* Empty space for layout balance */}
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
                  Create Expenses <Plus className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[30px]"><input type="checkbox" /></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance Due (in IDR)</TableHead>
                  <TableHead>Total (in IDR)</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expensesData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell><input type="checkbox" /></TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="text-blue-600">{row.number}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-blue-600">{row.beneficiary}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>{row.balanceDue}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>{row.tags?.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="text-sm text-gray-500">
              Showing 1 .. 2 of 2 Entries.
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-blue-50 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Expenses This Month (in IDR)</h3>
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-semibold">Rp. 515.000,00</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Expenses Last 30 Days (in IDR)</h3>
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-semibold">Rp. 515.000,00</div>
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

export default Expenses;
