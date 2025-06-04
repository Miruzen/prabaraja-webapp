
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseTabs } from "@/components/expenses/ExpenseTabs";
import { ExpenseSummaryCards } from "@/components/expenses/ExpenseSummaryCards";
import { useExpenses, useDeleteExpense, useUpdateExpense } from "@/hooks/useExpenses";
import { toast } from "sonner";

const Expenses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"expenses" | "approval">("expenses");
  const [searchQuery, setSearchQuery] = useState("");

  // Use Supabase hooks for data management
  const { data: expenses = [], isLoading, error } = useExpenses();
  const deleteExpenseMutation = useDeleteExpense();
  const updateExpenseMutation = useUpdateExpense();

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpenseMutation.mutateAsync(id);
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleApproveExpense = async (id: string) => {
    try {
      await updateExpenseMutation.mutateAsync({
        id,
        updates: { status: "Paid" }
      });
      toast.success("Expense approved successfully");
    } catch (error) {
      console.error("Error approving expense:", error);
      toast.error("Failed to approve expense");
    }
  };

  const navigateToCreateExpense = () => {
    navigate("/create-expense");
  };

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(expense => {
    const searchLower = searchQuery.toLowerCase();
    return (
      expense.number.toString().toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower) ||
      expense.beneficiary.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
            <h1 className="text-2xl font-semibold text-white">List of Expense</h1>
            <p className="text-white/80">Manage your company expenses</p>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading expenses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
            <h1 className="text-2xl font-semibold text-white">List of Expense</h1>
            <p className="text-white/80">Manage your company expenses</p>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-red-600">
              <p>Error loading expenses. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">List of Expense</h1>
          <p className="text-white/80">Manage your company expenses</p>
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
