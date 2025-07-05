
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseIndonesianCurrency, formatIndonesianCurrency, validateCurrencyAmount, testNumberParsing } from "@/utils/numberUtils";

interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  dueDate: string;
  status: string;
  total: string;
}

interface SalesDebugPanelProps {
  salesData: SalesData[];
  isVisible: boolean;
}

export const SalesDebugPanel = ({ salesData, isVisible }: SalesDebugPanelProps) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  const runTests = () => {
    testNumberParsing();
    setShowDetails(true);
  };

  const unpaidStatuses = ["Unpaid", "Late Payment", "Awaiting Payment"];
  const unpaidInvoices = salesData.filter(sale => unpaidStatuses.includes(sale.status));
  const paidInvoices = salesData.filter(sale => sale.status === "Paid");

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">Sales Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm">Data Summary</h4>
            <p className="text-xs">Total Records: {salesData.length}</p>
            <p className="text-xs">Unpaid: {unpaidInvoices.length}</p>
            <p className="text-xs">Paid: {paidInvoices.length}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Status Distribution</h4>
            {Object.entries(
              salesData.reduce((acc, sale) => {
                acc[sale.status] = (acc[sale.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([status, count]) => (
              <p key={status} className="text-xs">{status}: {count}</p>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button onClick={runTests} size="sm" className="mr-2">
            Run Number Parsing Tests
          </Button>
          <Button 
            onClick={() => setShowDetails(!showDetails)} 
            size="sm"
            variant="outline"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-sm">Sample Data Processing</h4>
            {salesData.slice(0, 3).map((sale) => (
              <div key={sale.id} className="bg-white p-2 rounded text-xs">
                <p><strong>ID:</strong> {sale.id}</p>
                <p><strong>Status:</strong> {sale.status}</p>
                <p><strong>Total (raw):</strong> {sale.total}</p>
                <p><strong>Parsed:</strong> {parseIndonesianCurrency(sale.total)}</p>
                <p><strong>Valid:</strong> {validateCurrencyAmount(sale.total) ? 'Yes' : 'No'}</p>
                <p><strong>Formatted:</strong> {formatIndonesianCurrency(parseIndonesianCurrency(sale.total))}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
