
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  unpaidAmount: number;
  overdueCount: number;
  last30DaysPayments: number;
}

export function StatsCards({ unpaidAmount, overdueCount, last30DaysPayments }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Unpaid Invoices</h3>
        <p className="text-2xl font-bold mt-2">{formatCurrency(unpaidAmount)}</p>
        <div className="flex items-center mt-2">
          <span className="text-orange-500 text-sm">Pending Payment</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Overdue Invoices</h3>
        <p className="text-2xl font-bold mt-2">{overdueCount} invoices</p>
        <div className="flex items-center mt-2">
          <span className="text-red-500 text-sm">Requires Immediate Action</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Last 30 Days Payments</h3>
        <p className="text-2xl font-bold mt-2">{formatCurrency(last30DaysPayments)}</p>
        <div className="flex items-center mt-2">
          <span className="text-green-500 text-sm">Total Expenses</span>
        </div>
      </div>
    </div>
  );
}
