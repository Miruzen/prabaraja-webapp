
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExpenseData {
  id: string;
  date: string;
  number: string;
  category: string;
  beneficiary: string;
  status: string;
  total: string;
}

const expensesData: ExpenseData[] = [
  {
    id: "1",
    date: "18-02-2025",
    number: "Expense #10002",
    category: "Cost of Sales",
    beneficiary: "Nanda",
    status: "Paid",
    total: "Rp. 15.000,00",
  },
  {
    id: "2",
    date: "13-02-2025",
    number: "Expense #10001",
    category: "Fuel, Toll and Parking - General",
    beneficiary: "Nanda",
    status: "Paid",
    total: "Rp. 500.000,00",
  },
];

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpenseData[]>(expensesData);
  const [activeTab, setActiveTab] = useState<"expenses" | "approval">("expenses");

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const navigateToCreateExpense = () => {
    navigate("/create-expense");
  };

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
              <Button 
                variant="link" 
                className={activeTab === "expenses" ? "text-blue-500 font-medium" : "text-gray-500"}
                onClick={() => setActiveTab("expenses")}
              >
                Expenses
              </Button>
              <Button 
                variant="link" 
                className={activeTab === "approval" ? "text-blue-500 font-medium" : "text-gray-500"}
                onClick={() => setActiveTab("approval")}
              >
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
                <Button className="bg-indigo-600 text-white" onClick={navigateToCreateExpense}>
                  Create Expenses <Plus className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total (in IDR)</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.filter(expense => 
                  (activeTab === "expenses" && expense.status === "Paid") ||
                  (activeTab === "approval" && expense.status === "Require Approval")
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="text-blue-600">{row.number}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-blue-600">{row.beneficiary}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this expense? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteExpense(row.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Yes
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="text-sm text-gray-500">
              Showing {expenses.filter(expense => 
                (activeTab === "expenses" && expense.status === "Paid") ||
                (activeTab === "approval" && expense.status === "Require Approval")
              ).length} Entries.
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-blue-50 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Expenses This Month (in IDR)</h3>
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      {expenses.filter(e => e.status === "Paid").length}
                    </span>
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
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      {expenses.filter(e => e.status === "Paid").length}
                    </span>
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
