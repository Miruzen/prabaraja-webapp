
import { Card, CardContent } from "@/components/ui/card";
import { parseIndonesianCurrency, formatIndonesianCurrency, validateCurrencyAmount } from "@/utils/numberUtils";

interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  dueDate: string;
  status: string;
  total: string;
}

interface SalesSummaryCardsProps {
  salesData: SalesData[];
}

export const SalesSummaryCards = ({ salesData }: SalesSummaryCardsProps) => {
  // Calculate unpaid invoices total with improved error handling
  const unpaidInvoices = salesData.filter(sale => sale.status === "Unpaid");
  const unpaidTotal = unpaidInvoices.reduce((total, sale) => {
    if (!validateCurrencyAmount(sale.total)) {
      console.warn(`Invalid currency amount for sale ${sale.id}: ${sale.total}`);
      return total;
    }
    const amount = parseIndonesianCurrency(sale.total);
    return total + amount;
  }, 0);

  // Calculate paid invoices total (for last 30 days) with improved error handling
  const paidInvoices = salesData.filter(sale => sale.status === "Paid");
  const paidTotal = paidInvoices.reduce((total, sale) => {
    if (!validateCurrencyAmount(sale.total)) {
      console.warn(`Invalid currency amount for sale ${sale.id}: ${sale.total}`);
      return total;
    }
    const amount = parseIndonesianCurrency(sale.total);
    return total + amount;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Unpaid invoices</h3>
            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {unpaidInvoices.length}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">
              {formatIndonesianCurrency(unpaidTotal)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Payments received last 30 days</h3>
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {paidInvoices.length}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">
              {formatIndonesianCurrency(paidTotal)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
