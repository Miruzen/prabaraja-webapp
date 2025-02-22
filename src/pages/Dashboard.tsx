
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, amount, trend, isPositive }: { 
  title: string;
  amount: string;
  trend: string;
  isPositive: boolean;
}) => (
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

const data = [
  { month: 'Jan', profit: 4000, loss: 2400 },
  { month: 'Feb', profit: 3000, loss: 1398 },
  { month: 'Mar', profit: 2000, loss: 9800 },
  { month: 'Apr', profit: 2780, loss: 3908 },
  { month: 'May', profit: 1890, loss: 4800 },
  { month: 'Jun', profit: 2390, loss: 3800 },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        {/* Added header */}
        <div className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
        </div>
        
        <div className="p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-8">            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                title="Total Sales (Current Month)" 
                amount="$45,231.89" 
                trend="+20.1% vs last month"
                isPositive={true}
              />
              <StatCard 
                title="Total Sales (Previous Month)" 
                amount="$37,651.72" 
                trend="+12.5% vs previous"
                isPositive={true}
              />
              <StatCard 
                title="Payments Received (Current Month)" 
                amount="$28,458.92" 
                trend="-4.3% vs last month"
                isPositive={false}
              />
              <StatCard 
                title="Payments Received (Previous Month)" 
                amount="$31,892.45" 
                trend="+8.7% vs previous"
                isPositive={true}
              />
            </div>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Monthly Profit & Loss</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
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
