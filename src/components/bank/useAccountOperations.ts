
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { parseInputCurrency } from "@/lib/utils";

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

export function useAccountOperations() {
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
  
  const handleTransferFunds = (fromCode: string, toCode: string, amount: number, notes: string) => {
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
    
    setAccounts(accounts.map(account => {
      if (account.code === fromCode) {
        const currentBalance = parseInputCurrency(account.balance.replace(/[()]/g, ''));
        const newBalance = currentBalance - amount;
        return {
          ...account,
          balance: newBalance >= 0 ? `Rp ${newBalance.toLocaleString('id-ID')}` : `(Rp ${Math.abs(newBalance).toLocaleString('id-ID')})`
        };
      } else if (account.code === toCode) {
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
  
  const handleReceiveMoney = (accountCode: string, amount: number, payer: string, reference: string, date: Date, notes: string) => {
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
    
    setAccounts(accounts.map(account => {
      if (account.code === accountCode) {
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

  const calculateTotal = (filteredAccounts: Account[]) => {
    return filteredAccounts.reduce((total, account) => {
      const amount = parseInt(account.balance.replace(/[^\d-]/g, '')) || 0;
      return total + amount;
    }, 0);
  };

  const getAccountTransactions = (accountCode: string) => {
    return transactions.filter(t => t.accountCode === accountCode);
  };

  return {
    accounts,
    transactions,
    handleCreateAccount,
    handleArchiveAccount,
    handleUnarchiveAccount,
    handleDeleteAccount,
    handleEditAccount,
    handleTransferFunds,
    handleReceiveMoney,
    calculateTotal,
    getAccountTransactions
  };
}
