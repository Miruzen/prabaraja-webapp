
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Sidebar } from "@/components/Sidebar";
import { CreateAccountDialog } from "@/components/bank/CreateAccountDialog";
import { AccountActionDropdown } from "@/components/bank/AccountActionDropdown";
import { toast } from "sonner";
import { formatCurrency, parseInputCurrency } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

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

const CashnBank = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { code: "1-10001", name: "Cash", bankName: "Bank Central Asia (BCA)", balance: "Rp 4.490.871", archived: false },
    { code: "1-10002", name: "Bank Account", bankName: "Bank Central Asia (BCA)", balance: "Rp 1.800.002", archived: false },
    { code: "1-10003", name: "Giro", bankName: "Bank Central Asia (BCA)", balance: "Rp 184.651.887", archived: false },
    { code: "1-10004", name: "Test AKUN", bankName: "Bank Central Asia (BCA)", balance: "Rp 0", archived: false },
    { code: "1-10012", name: "Test BCA", bankName: "Bank Central Asia (BCA)", balance: "(Rp 151.623.322)", archived: false },
  ]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      date: new Date(2024, 2, 1),
      description: "Initial deposit",
      amount: 5000000,
      type: "inflow",
      accountCode: "1-10001",
      reference: "REF001"
    },
    {
      id: "tx-2",
      date: new Date(2024, 2, 15),
      description: "Client payment",
      amount: 12500000,
      type: "inflow",
      accountCode: "1-10003",
      reference: "INV-2024-001"
    },
    {
      id: "tx-3",
      date: new Date(2024, 2, 20),
      description: "Office rent payment",
      amount: 8000000,
      type: "outflow",
      accountCode: "1-10003",
      reference: "RENT-001"
    },
    {
      id: "tx-4",
      date: new Date(2024, 3, 1),
      description: "Utility bills",
      amount: 1200000,
      type: "outflow",
      accountCode: "1-10002",
      reference: "BILL-001"
    },
    {
      id: "tx-5",
      date: new Date(2024, 3, 5),
      description: "Service fee payment",
      amount: 509129,
      type: "outflow",
      accountCode: "1-10001",
      reference: "SERVICE-001"
    },
  ]);
  
  const [showArchived, setShowArchived] = useState(false);

  const handleCreateAccount = (formData: any) => {
    const newAccount = {
      code: formData.accountCode,
      name: formData.accountName,
      balance: `Rp ${formData.startBalance.toLocaleString('id-ID')}`,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      archived: false,
    };
    setAccounts([...accounts, newAccount]);
    
    // Create initial transaction for the new account
    if (formData.startBalance > 0) {
      const newTransaction: Transaction = {
        id: uuidv4(),
        date: new Date(),
        description: "Initial balance",
        amount: formData.startBalance,
        type: "inflow",
        accountCode: formData.accountCode,
        reference: "INITIAL"
      };
      setTransactions([...transactions, newTransaction]);
    }
    
    toast.success("Account created successfully");
  };

  const handleArchiveAccount = (accountToArchive: Account) => {
    setAccounts(accounts.map(account => 
      account.code === accountToArchive.code 
        ? { ...account, archived: true }
        : account
    ));
    toast.success("Account archived successfully");
  };

  const handleUnarchiveAccount = (accountToUnarchive: Account) => {
    setAccounts(accounts.map(account => 
      account.code === accountToUnarchive.code 
        ? { ...account, archived: false }
        : account
    ));
    toast.success("Account unarchived successfully");
  };

  const handleDeleteAccount = (accountToDelete: Account) => {
    setAccounts(accounts.filter(account => account.code !== accountToDelete.code));
    // Also delete associated transactions
    setTransactions(transactions.filter(transaction => transaction.accountCode !== accountToDelete.code));
    toast.success("Account deleted permanently");
  };

  const handleEditAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map(account =>
      account.code === updatedAccount.code
        ? { ...account, ...updatedAccount }
        : account
    ));
    toast.success("Account updated successfully");
  };
  
  // Handle transfer between accounts
  const handleTransferFunds = (fromCode: string, toCode: string, amount: number, notes: string) => {
    // Create two transactions (outflow and inflow)
    const newTransactions: Transaction[] = [
      {
        id: uuidv4(),
        date: new Date(),
        description: `Transfer to ${accounts.find(a => a.code === toCode)?.name}`,
        amount: amount,
        type: "outflow",
        accountCode: fromCode,
        reference: notes ? notes : "Fund transfer"
      },
      {
        id: uuidv4(),
        date: new Date(),
        description: `Transfer from ${accounts.find(a => a.code === fromCode)?.name}`,
        amount: amount,
        type: "inflow",
        accountCode: toCode,
        reference: notes ? notes : "Fund transfer"
      }
    ];
    
    setTransactions([...transactions, ...newTransactions]);
    
    // Update account balances
    setAccounts(accounts.map(account => {
      if (account.code === fromCode) {
        // Get current balance as number
        const currentBalance = parseInputCurrency(account.balance.replace(/[()]/g, ''));
        const newBalance = currentBalance - amount;
        return {
          ...account,
          balance: newBalance >= 0 ? `Rp ${newBalance.toLocaleString('id-ID')}` : `(Rp ${Math.abs(newBalance).toLocaleString('id-ID')})`
        };
      } else if (account.code === toCode) {
        // Get current balance as number
        const currentBalance = parseInputCurrency(account.balance.replace(/[()]/g, ''));
        const newBalance = currentBalance + amount;
        return {
          ...account,
          balance: newBalance >= 0 ? `Rp ${newBalance.toLocaleString('id-ID')}` : `(Rp ${Math.abs(newBalance).toLocaleString('id-ID')})`
        };
      }
      return account;
    }));
    
    toast.success("Funds transferred successfully");
  };
  
  // Handle receiving money
  const handleReceiveMoney = (accountCode: string, amount: number, payer: string, reference: string, date: Date, notes: string) => {
    // Create a new transaction
    const newTransaction: Transaction = {
      id: uuidv4(),
      date: date,
      description: `Payment from ${payer}${notes ? `: ${notes}` : ''}`,
      amount: amount,
      type: "inflow",
      accountCode: accountCode,
      reference: reference || payer
    };
    
    setTransactions([...transactions, newTransaction]);
    
    // Update account balance
    setAccounts(accounts.map(account => {
      if (account.code === accountCode) {
        // Get current balance as number
        const currentBalance = parseInputCurrency(account.balance.replace(/[()]/g, ''));
        const newBalance = currentBalance + amount;
        return {
          ...account,
          balance: newBalance >= 0 ? `Rp ${newBalance.toLocaleString('id-ID')}` : `(Rp ${Math.abs(newBalance).toLocaleString('id-ID')})`
        };
      }
      return account;
    }));
    
    toast.success("Money received successfully");
  };

  const visibleAccounts = accounts.filter(account => account.archived === showArchived);

  const calculateTotal = (accounts: Account[]) => {
    return accounts.reduce((total, account) => {
      const amount = parseInt(account.balance.replace(/[^\d-]/g, '')) || 0;
      return total + amount;
    }, 0);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Cash & Bank</h1>
          <p className="text-white/80"> Manage your company Bank accounts </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <CreateAccountDialog onSubmit={handleCreateAccount} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show archived accounts</span>
                <Switch
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account code</TableHead>
                  <TableHead>Account name</TableHead>
                  <TableHead>Account Bank</TableHead>
                  <TableHead>Balance in Prabasena</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleAccounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{account.balance}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-1">
                        <AccountActionDropdown
                          account={account}
                          onArchive={handleArchiveAccount}
                          onEdit={handleEditAccount}
                          onUnarchive={handleUnarchiveAccount}
                          onDelete={handleDeleteAccount}
                          transactions={transactions}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#F3F4F6]">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  Cash & bank balance
                  <span className="ml-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {accounts.filter(a => !a.archived).length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(calculateTotal(accounts.filter(a => !a.archived)))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#FEF2F2]">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  Credit Card balance
                  <span className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    5
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-semibold">Rp 130.545.869</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashnBank;
