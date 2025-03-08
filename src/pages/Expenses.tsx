
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Expense } from "@/types/expense";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseTabs } from "@/components/expenses/ExpenseTabs";
import { ExpenseSummaryCards } from "@/components/expenses/ExpenseSummaryCards";
import { getExpenses, deleteExpense, approveExpense } from "@/utils/expenseUtils";

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<"expenses" | "approval">("expenses");
  const [searchQuery, setSearchQuery] = useState("");

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const loadExpenses = () => {
      const loadedExpenses = getExpenses();
      setExpenses(loadedExpenses);
    };
    
    loadExpenses();
  }, []);

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = deleteExpense(id);
    setExpenses(updatedExpenses);
  };

  const handleApproveExpense = (id: string) => {
    const updatedExpenses = approveExpense(id);
    setExpenses(updatedExpenses);
  };

  const navigateToCreateExpense = () => {
    navigate("/create-expense");
  };

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(expense => {
    const searchLower = searchQuery.toLowerCase();
    return (
      expense.number.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower) ||
      expense.beneficiary.toLowerCase().includes(searchLower)
    );
  });

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
            <ExpenseTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Actions Bar */}
            <div className="flex justify-between items-center gap-4">
              <div className="relative mr-2 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 h-auto rounded-xl" 
                onClick={navigateToCreateExpense}
              >
                Create Expenses <Plus className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Table */}
            <ExpenseTable 
              expenses={filteredExpenses}
              tableType={activeTab}
              onDeleteExpense={handleDeleteExpense}
              onApproveExpense={handleApproveExpense}
            />

            <div className="text-sm text-gray-500">
              Showing {filteredExpenses.filter(expense => 
                (activeTab === "expenses" && expense.status === "Paid") ||
                (activeTab === "approval" && expense.status === "Require Approval")
              ).length} Entries.
            </div>

            {/* Summary Cards */}
            <ExpenseSummaryCards expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
