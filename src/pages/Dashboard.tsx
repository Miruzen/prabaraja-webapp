
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, AreaChartIcon, LineChartIcon } from "lucide-react";
import { salesData as allSalesData } from "@/data/salesData";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps { 
  title: string;
  amount: string;
  trend: string;
  isPositive: boolean;
}

const StatCard = ({ title, amount, trend, isPositive }: StatCardProps) => (
  <Card className="p-6 space-y-2">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-semibold">{amount}</span>
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{trend}</span>
      </div>
    </div>
  </Card>
);

// Helper function to get current month data
const getCurrentMonthData = (data: typeof allSalesData) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // January is 0
  const currentYear = now.getFullYear();
  
  return data.filter(sale => {
    const [day, month, year] = sale.date.split('/').map(Number);
    return month === currentMonth && year === currentYear;
  });
};

// Helper function to get previous month data
const getPreviousMonthData = (data: typeof allSalesData) => {
  const now = new Date();
  // Get previous month (handling January case)
  let prevMonth = now.getMonth(); // 0-11
  let prevYear = now.getFullYear();
  
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  
  return data.filter(sale => {
    const [day, month, year] = sale.date.split('/').map(Number);
    return month === prevMonth && year === prevYear;
  });
};

// Helper to calculate total amount from sales data
const calculateTotal = (data: typeof allSalesData) => {
  return data.reduce((total, sale) => {
    const amount = parseFloat(sale.total.replace(/[^\d.]/g, '').replace('.', ''));
    return total + amount;
  }, 0);
};

// Prepare chart data from sales data
const generateChartData = (data: typeof allSalesData) => {
  const monthlyData: Record<string, { month: string, profit: number, loss: number }> = {};
  
  data.forEach(sale => {
    const [day, month, year] = sale.date.split('/').map(Number);
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
    const amount = parseFloat(sale.total.replace(/[^\d.]/g, '').replace('.', ''));
    
    if (!monthlyData[monthName]) {
      monthlyData[monthName] = { month: monthName, profit: 0, loss: 0 };
    }
    
    if (sale.status === 'Paid' || sale.status === 'Awaiting Payment') {
      monthlyData[monthName].profit += amount;
    } else if (sale.status === 'Unpaid' || sale.status === 'Late Payment') {
      monthlyData[monthName].loss += amount;
    }
  });
  
  return Object.values(monthlyData).sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });
};

const Dashboard = () => {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [previousMonthSales, setPreviousMonthSales] = useState(0);
  const [currentMonthPayments, setCurrentMonthPayments] = useState(0);
  const [previousMonthPayments, setPreviousMonthPayments] = useState(0);

  useEffect(() => {
    // Get data for current and previous months
    const currentMonthData = getCurrentMonthData(allSalesData);
    const previousMonthData = getPreviousMonthData(allSalesData);
    
    // Calculate totals
    const currentSalesTotal = calculateTotal(currentMonthData);
    const previousSalesTotal = calculateTotal(previousMonthData);
    
    // Calculate payments (Paid status only)
    const currentPaymentsTotal = calculateTotal(currentMonthData.filter(sale => sale.status === 'Paid'));
    const previousPaymentsTotal = calculateTotal(previousMonthData.filter(sale => sale.status === 'Paid'));
    
    // Generate chart data
    const chartData = generateChartData(allSalesData);
    
    // Update state
    setCurrentMonthSales(currentSalesTotal);
    setPreviousMonthSales(previousSalesTotal);
    setCurrentMonthPayments(currentPaymentsTotal);
    setPreviousMonthPayments(previousPaymentsTotal);
    setChartData(chartData);
  }, []);

  // Calculate percentage changes
  const salesPercentChange = previousMonthSales === 0 
    ? 100 
    : ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;
  
  const paymentsPercentChange = previousMonthPayments === 0 
    ? 100 
    : ((currentMonthPayments - previousMonthPayments) / previousMonthPayments) * 100;

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Area 
            type="monotone" 
            dataKey="profit" 
            stackId="1" 
            stroke="#0EA5E9" 
            fill="#0EA5E9" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="loss" 
            stackId="1" 
            stroke="#EF4444" 
            fill="#EF4444" 
            fillOpacity={0.6}
          />
        </AreaChart>
      );
    } else {
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="#0EA5E9" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="loss" 
            stroke="#EF4444" 
            strokeWidth={2}
          />
        </LineChart>
      );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
        </div>
        
        <div className="p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-8">            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                title="Total Sales (Current Month)" 
                amount={formatCurrency(currentMonthSales)} 
                trend={`${salesPercentChange.toFixed(1)}% vs last month`}
                isPositive={salesPercentChange >= 0}
              />
              <StatCard 
                title="Total Sales (Previous Month)" 
                amount={formatCurrency(previousMonthSales)} 
                trend="Compared to current"
                isPositive={true}
              />
              <StatCard 
                title="Payments Received (Current Month)" 
                amount={formatCurrency(currentMonthPayments)} 
                trend={`${paymentsPercentChange.toFixed(1)}% vs last month`}
                isPositive={paymentsPercentChange >= 0}
              />
              <StatCard 
                title="Payments Received (Previous Month)" 
                amount={formatCurrency(previousMonthPayments)} 
                trend="Compared to current"
                isPositive={true}
              />
            </div>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Monthly Profit & Loss</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChartType('area')}
                    className={`p-2 rounded ${chartType === 'area' ? 'bg-blue-100' : 'bg-gray-100'}`}
                  >
                    <AreaChartIcon className={`w-5 h-5 ${chartType === 'area' ? 'text-blue-600' : 'text-gray-500'}`} />
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded ${chartType === 'line' ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <LineChartIcon className={`w-5 h-5 ${chartType === 'line' ? 'text-green-600' : 'text-gray-500'}`} />
                  </button>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 
