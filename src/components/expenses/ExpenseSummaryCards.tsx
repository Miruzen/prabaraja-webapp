
import { Card, CardContent } from "@/components/ui/card";
import { Expense } from "@/types/expense";

interface ExpenseSummaryCardsProps {
  expenses: Expense[];
}

export const ExpenseSummaryCards = ({ expenses }: ExpenseSummaryCardsProps) => {
  const paidExpenses = expenses.filter(e => e.status === "Paid");
  
  // Calculate total expenses amount
  const totalAmount = paidExpenses.reduce((sum, expense) => {
    // Extract numeric value from formatted string (e.g., "Rp. 15.000,00" -> 15000)
    const numericValue = Number(expense.total.replace(/[^0-9]/g, "")) || 0;
    return sum + numericValue;
  }, 0);

  // Format the total amount with proper currency formatting
  const formatCurrency = (amount: number) => {
    return `Rp. ${amount.toLocaleString("id-ID")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-blue-50 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Expenses This Month (in IDR)</h3>
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {paidExpenses.length}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">{formatCurrency(totalAmount)}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Expenses Last 30 Days (in IDR)</h3>
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {paidExpenses.length}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">{formatCurrency(totalAmount)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
