import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { useState } from "react";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CashflowAnalysis({ open, onOpenChange, accounts, transactions }: CashflowAnalysisProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        
        {/* ... rest of the component remains the same ... */}
      </DialogContent>
    </Dialog>
  );
}