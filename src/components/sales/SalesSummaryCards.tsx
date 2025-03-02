
import { Card, CardContent } from "@/components/ui/card";

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
  return (
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
  );
};
