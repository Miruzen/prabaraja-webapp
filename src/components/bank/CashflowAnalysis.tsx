import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  accountNumber?: string;
  archived?: boolean;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "inflow" | "outflow";
  accountCode: string;
  category?: string;
  reference?: string;
}

interface CashflowAnalysisProps {
  accounts: Account[];
  transactions: Transaction[];
}

const upcomingTransactions = [
  { 
    id: "inv-001", 
    date: new Date(2024, 3, 15), 
    description: "Client invoice payment", 
    amount: 25000000, 
    type: "inflow" as const,
    status: "pending" 
  },
  { 
    id: "trans-002", 
    date: new Date(2024, 3, 18), 
    description: "Scheduled transfer to vendors", 
    amount: 12500000, 
    type: "outflow" as const,
    status: "scheduled" 
  },
  { 
    id: "bill-003", 
    date: new Date(2024, 3, 20), 
    description: "Office rental payment", 
    amount: 8000000, 
    type: "outflow" as const,
    status: "upcoming" 
  },
];

export function CashflowAnalysis({ accounts, transactions }: CashflowAnalysisProps) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  
  const processTransactions = () => {
    const filtered = transactions.filter(trans => {
      const isAccountMatch = selectedAccount === "all" || trans.accountCode === selectedAccount;
      
      const today = new Date();
      let startDate = new Date();
      
      if (period === "week") {
        startDate.setDate(today.getDate() - 7);
      } else if (period === "month") {
        startDate.setMonth(today.getMonth() - 1);
      } else if (period === "quarter") {
        startDate.setMonth(today.getMonth() - 3);
      }
      
      const isInTimeRange = trans.date >= startDate && trans.date <= today;
      
      return isAccountMatch && isInTimeRange;
    });
    
    const dailyData: Record<string, { date: string; inflow: number; outflow: number }> = {};
    
    filtered.forEach(trans => {
      const dateStr = trans.date.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { date: dateStr, inflow: 0, outflow: 0 };
      }
      
      if (trans.type === "inflow") {
        dailyData[dateStr].inflow += trans.amount;
      } else {
        dailyData[dateStr].outflow += trans.amount;
      }
    });
    
    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const generateBalanceData = () => {
    const cashflowData = processTransactions();
    let runningBalance = 0;
    
    return cashflowData.map(item => {
      runningBalance += (item.inflow - item.outflow);
      return {
        ...item,
        balance: runningBalance
      };
    });
  };
  
  const calculateTotals = () => {
    const filtered = transactions.filter(trans => {
      const isAccountMatch = selectedAccount === "all" || trans.accountCode === selectedAccount;
      
      const today = new Date();
      let startDate = new Date();
      
      if (period === "week") {
        startDate.setDate(today.getDate() - 7);
      } else if (period === "month") {
        startDate.setMonth(today.getMonth() - 1);
      } else if (period === "quarter") {
        startDate.setMonth(today.getMonth() - 3);
      }
      
      const isInTimeRange = trans.date >= startDate && trans.date <= today;
      
      return isAccountMatch && isInTimeRange;
    });
    
    const inflows = filtered
      .filter(t => t.type === "inflow")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const outflows = filtered
      .filter(t => t.type === "outflow")
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      inflows,
      outflows,
      netCashflow: inflows - outflows
    };
  };
  
  const cashflowData = processTransactions();
  const balanceData = generateBalanceData();
  const totals = calculateTotals();
  
  const handleExport = () => {
    toast.info("Exporting report as PDF...");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm">
          Cashflow Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between items-center">
            <span>Cashflow Analysis</span>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Period:</span>
            <Select 
              value={period} 
              onValueChange={(value) => setPeriod(value as "week" | "month" | "quarter")}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Account:</span>
            <Select 
              value={selectedAccount} 
              onValueChange={setSelectedAccount}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map(account => (
                  <SelectItem key={account.code} value={account.code}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-green-600">Total Inflows</CardTitle>
              <CardDescription>Money coming in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totals.inflows)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-red-600">Total Outflows</CardTitle>
              <CardDescription>Money going out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totals.outflows)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-blue-600">Net Cashflow</CardTitle>
              <CardDescription>Overall balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totals.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totals.netCashflow)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="cashflow" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="cashflow">Inflows vs Outflows</TabsTrigger>
            <TabsTrigger value="balance">Account Balance</TabsTrigger>
            <TabsTrigger value="accounts">Account Distribution</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cashflow" className="mt-0">
            <div className="h-[400px] w-full">
              <ChartContainer
                config={{
                  inflow: { color: "#22c55e" },
                  outflow: { color: "#ef4444" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cashflowData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <ChartTooltipContent>
                            <div className="text-xs font-medium mb-2">
                              {new Date(label).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </div>
                            {payload.map((entry) => (
                              <div
                                key={entry.name}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-1">
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span>{entry.name === "inflow" ? "Inflows" : "Outflows"}</span>
                                </div>
                                <span className="font-medium">
                                  {formatCurrency(entry.value as number)}
                                </span>
                              </div>
                            ))}
                          </ChartTooltipContent>
                        );
                      }}
                    />
                    <Legend />
                    <Bar dataKey="inflow" name="Inflows" fill="var(--color-inflow)" />
                    <Bar dataKey="outflow" name="Outflows" fill="var(--color-outflow)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="balance" className="mt-0">
            <div className="h-[400px] w-full">
              <ChartContainer
                config={{
                  balance: { color: "#3b82f6" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={balanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <ChartTooltipContent>
                            <div className="text-xs font-medium mb-2">
                              {new Date(label).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </div>
                            {payload.map((entry) => (
                              <div
                                key={entry.name}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-1">
                                  <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span>Balance</span>
                                </div>
                                <span className="font-medium">
                                  {formatCurrency(entry.value as number)}
                                </span>
                              </div>
                            ))}
                          </ChartTooltipContent>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="balance" name="Balance" fill="var(--color-balance)" stroke="var(--color-balance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="accounts" className="mt-0">
            <div className="h-[400px] w-full">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-lg text-center">
                  Account Distribution
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {accounts.filter(a => !a.archived).map(account => {
                    const balanceValue = parseInt(account.balance.replace(/[^\d-]/g, ''));
                    
                    return (
                      <Card key={account.code} className="w-[300px]">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">{account.name}</CardTitle>
                          <CardDescription>{account.bankName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className={`text-xl font-bold ${balanceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {account.balance}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="h-[400px] w-full overflow-auto">
              <div className="text-lg mb-4">Upcoming & Scheduled Transactions</div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Description</th>
                    <th className="border px-4 py-2 text-right">Amount</th>
                    <th className="border px-4 py-2 text-center">Type</th>
                    <th className="border px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTransactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-muted/20">
                      <td className="border px-4 py-2">
                        {transaction.date.toLocaleDateString('id-ID')}
                      </td>
                      <td className="border px-4 py-2">{transaction.description}</td>
                      <td className="border px-4 py-2 text-right">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          transaction.type === 'inflow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'inflow' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          transaction.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status === 'pending' ? 'Pending' : 
                           transaction.status === 'scheduled' ? 'Scheduled' : 'Upcoming'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
