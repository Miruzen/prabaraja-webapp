import { useState, useEffect } from 'react';

export interface FinanceSummaryData {
  profit: number;
  loss: number;
  month: string;
}

export interface FinanceApiResponse {
  success: boolean;
  data: {
    monthlyData: FinanceSummaryData[];
    currentMonthSales: number;
    previousMonthSales: number;
    currentMonthPayments: number;
    previousMonthPayments: number;
  };
}

export const useDashboardFinance = () => {
  const [data, setData] = useState<FinanceApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://pbw-backend-api.vercel.app/api/dashboard?action=summaryFinance');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: FinanceApiResponse = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        console.error('Error fetching finance data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch finance data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger the useEffect by creating a new instance
    }
  };
};