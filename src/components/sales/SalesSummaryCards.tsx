
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
  console.log('SalesSummaryCards received data:', salesData);
  
  // Define unpaid statuses to include all relevant states
  const unpaidStatuses = ["Unpaid", "Late Payment", "Awaiting Payment"];
  
  // Calculate unpaid invoices total with improved error handling and status filtering
  const unpaidInvoices = salesData.filter(sale => unpaidStatuses.includes(sale.status));
  console.log('Filtered unpaid invoices:', unpaidInvoices);
  
  const unpaidTotal = unpaidInvoices.reduce((total, sale) => {
    console.log(`Processing sale ${sale.id}: ${sale.total} (status: ${sale.status})`);
    
    if (!validateCurrencyAmount(sale.total)) {
      console.warn(`Invalid currency amount for sale ${sale.id}: ${sale.total}`);
      return total;
    }
    
    const amount = parseIndonesianCurrency(sale.total);
    console.log(`Parsed amount for sale ${sale.id}: ${amount}`);
    
    if (isNaN(amount) || amount < 0) {
      console.warn(`Invalid parsed amount for sale ${sale.id}: ${amount}`);
      return total;
    }
    
    return total + amount;
  }, 0);
  
  console.log('Total unpaid amount calculated:', unpaidTotal);

  // Calculate paid invoices total with improved error handling
  const paidInvoices = salesData.filter(sale => sale.status === "Paid");
  console.log('Filtered paid invoices:', paidInvoices);
  
  const paidTotal = paidInvoices.reduce((total, sale) => {
    console.log(`Processing paid sale ${sale.id}: ${sale.total}`);
    
    if (!validateCurrencyAmount(sale.total)) {
      console.warn(`Invalid currency amount for paid sale ${sale.id}: ${sale.total}`);
      return total;
    }
    
    const amount = parseIndonesianCurrency(sale.total);
    console.log(`Parsed paid amount for sale ${sale.id}: ${amount}`);
    
    if (isNaN(amount) || amount < 0) {
      console.warn(`Invalid parsed paid amount for sale ${sale.id}: ${amount}`);
      return total;
    }
    
    return total + amount;
  }, 0);
  
  console.log('Total paid amount calculated:', paidTotal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Unpaid invoices</h3>
            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {unpaidInvoices.length}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">
              {formatIndonesianCurrency(unpaidTotal)}
            </div>
            {/* Debug information - remove in production */}
            <div className="text-xs text-gray-400 mt-1">
              Debug: {unpaidTotal.toLocaleString('en-US')} from {unpaidInvoices.length} invoices
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Payments received last 30 days</h3>
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {paidInvoices.length}
            </span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">
              {formatIndonesianCurrency(paidTotal)}
            </div>
            {/* Debug information - remove in production */}
            <div className="text-xs text-gray-400 mt-1">
              Debug: {paidTotal.toLocaleString('en-US')} from {paidInvoices.length} invoices
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
