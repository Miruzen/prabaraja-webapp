
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { parseInputCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  bankType?: string;
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch accounts from database
  const fetchAccounts = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('cashbank')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedAccounts = data?.map(account => ({
        code: account.number.toString(),
        name: account.account_name,
        balance: account.balance >= 0 
          ? `Rp ${account.balance.toLocaleString('id-ID')}` 
          : `(Rp ${Math.abs(account.balance).toLocaleString('id-ID')})`,
        bankName: account.bank_name,
        bankType: account.account_type,
        accountNumber: account.bank_number,
        archived: account.status === 'Archived'
      })) || [];

      setAccounts(formattedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions from database
  const fetchTransactions = async () => {
    if (!user?.id) return;
    
    try {
      // Fetch transfer transactions
      const { data: transfers, error: transferError } = await supabase
        .from('bank_transfer_transactions')
        .select('*')
        .eq('user_id', user.id);

      // Fetch receive transactions
      const { data: receives, error: receiveError } = await supabase
        .from('bank_receive_transactions')
        .select('*')
        .eq('user_id', user.id);

      if (transferError) throw transferError;
      if (receiveError) throw receiveError;

      const formattedTransactions: Transaction[] = [];

      // Format transfer transactions
      transfers?.forEach(transfer => {
        // Outflow from source account
        formattedTransactions.push({
          id: `${transfer.id}-out`,
          date: new Date(transfer.created_at),
          description: `Transfer to account`,
          amount: transfer.amount,
          type: "outflow",
          accountCode: transfer.from_account,
          reference: transfer.notes || "Fund transfer"
        });

        // Inflow to target account
        formattedTransactions.push({
          id: `${transfer.id}-in`,
          date: new Date(transfer.created_at),
          description: `Transfer from account`,
          amount: transfer.amount,
          type: "inflow",
          accountCode: transfer.to_account,
          reference: transfer.notes || "Fund transfer"
        });
      });

      // Format receive transactions
      receives?.forEach(receive => {
        formattedTransactions.push({
          id: receive.id,
          date: new Date(receive.date_received),
          description: `Payment from ${receive.payer_name}${receive.notes ? `: ${receive.notes}` : ''}`,
          amount: receive.amount,
          type: "inflow",
          accountCode: receive.receiving_account,
          reference: receive.reference || receive.payer_name
        });
      });

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAccounts();
      fetchTransactions();
    }
  }, [user?.id]);

  const handleCreateAccount = async (formData: any) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('cashbank')
        .insert({
          user_id: user.id,
          number: parseInt(formData.accountCode),
          account_name: formData.accountName,
          account_type: formData.bankType,
          bank_name: formData.bankName,
          bank_number: formData.accountNumber,
          balance: formData.startBalance,
          status: 'Active'
        });

      if (error) throw error;

      toast.success("Account created successfully");
      fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account');
    }
  };

  const handleArchiveAccount = async (accountToArchive: Account) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cashbank')
        .update({ status: 'Archived' })
        .eq('user_id', user.id)
        .eq('number', parseInt(accountToArchive.code));

      if (error) throw error;

      toast.success("Account archived successfully");
      fetchAccounts();
    } catch (error) {
      console.error('Error archiving account:', error);
      toast.error('Failed to archive account');
    }
  };

  const handleUnarchiveAccount = async (accountToUnarchive: Account) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cashbank')
        .update({ status: 'Active' })
        .eq('user_id', user.id)
        .eq('number', parseInt(accountToUnarchive.code));

      if (error) throw error;

      toast.success("Account unarchived successfully");
      fetchAccounts();
    } catch (error) {
      console.error('Error unarchiving account:', error);
      toast.error('Failed to unarchive account');
    }
  };

  const handleDeleteAccount = async (accountToDelete: Account) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cashbank')
        .delete()
        .eq('user_id', user.id)
        .eq('number', parseInt(accountToDelete.code));

      if (error) throw error;

      toast.success("Account deleted permanently");
      fetchAccounts();
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleEditAccount = async (updatedAccount: Account) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cashbank')
        .update({
          account_name: updatedAccount.name,
          bank_name: updatedAccount.bankName,
          bank_number: updatedAccount.accountNumber,
          balance: parseInputCurrency(updatedAccount.balance.replace(/[()]/g, ''))
        })
        .eq('user_id', user.id)
        .eq('number', parseInt(updatedAccount.code));

      if (error) throw error;

      toast.success("Account updated successfully");
      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    }
  };
  
  const handleTransferFunds = async (fromCode: string, toCode: string, amount: number, notes: string) => {
    if (!user?.id) return;

    try {
      // Get current balances
      const { data: fromAccount } = await supabase
        .from('cashbank')
        .select('balance')
        .eq('user_id', user.id)
        .eq('number', parseInt(fromCode))
        .single();

      const { data: toAccount } = await supabase
        .from('cashbank')
        .select('balance')
        .eq('user_id', user.id)
        .eq('number', parseInt(toCode))
        .single();

      if (!fromAccount || !toAccount) {
        throw new Error('Accounts not found');
      }

      const sourceBefore = fromAccount.balance;
      const targetBefore = toAccount.balance;
      const sourceAfter = sourceBefore - amount;
      const targetAfter = targetBefore + amount;

      // Create transfer transaction record
      const { error: transferError } = await supabase
        .from('bank_transfer_transactions')
        .insert({
          user_id: user.id,
          from_account: fromCode,
          to_account: toCode,
          amount: amount,
          notes: notes,
          number: Date.now(), // Simple number generation
          source_balance_before: sourceBefore,
          source_balance_after: sourceAfter,
          target_balance_before: targetBefore,
          target_balance_after: targetAfter
        });

      if (transferError) throw transferError;

      // Update account balances
      const { error: updateFromError } = await supabase
        .from('cashbank')
        .update({ balance: sourceAfter })
        .eq('user_id', user.id)
        .eq('number', parseInt(fromCode));

      const { error: updateToError } = await supabase
        .from('cashbank')
        .update({ balance: targetAfter })
        .eq('user_id', user.id)
        .eq('number', parseInt(toCode));

      if (updateFromError || updateToError) {
        throw new Error('Failed to update account balances');
      }

      toast.success("Funds transferred successfully");
      fetchAccounts();
      fetchTransactions();
    } catch (error) {
      console.error('Error transferring funds:', error);
      toast.error('Failed to transfer funds');
    }
  };
  
  const handleReceiveMoney = async (accountCode: string, amount: number, payer: string, reference: string, date: Date, notes: string) => {
    if (!user?.id) return;

    try {
      // Get current balance
      const { data: account } = await supabase
        .from('cashbank')
        .select('balance')
        .eq('user_id', user.id)
        .eq('number', parseInt(accountCode))
        .single();

      if (!account) {
        throw new Error('Account not found');
      }

      const balanceBefore = account.balance;
      const balanceAfter = balanceBefore + amount;

      // Create receive transaction record
      const { error: receiveError } = await supabase
        .from('bank_receive_transactions')
        .insert({
          user_id: user.id,
          receiving_account: accountCode,
          amount: amount,
          payer_name: payer,
          reference: reference,
          date_received: date.toISOString().split('T')[0],
          notes: notes,
          number: Date.now(), // Simple number generation
          target_balance_before: balanceBefore,
          target_balance_after: balanceAfter
        });

      if (receiveError) throw receiveError;

      // Update account balance
      const { error: updateError } = await supabase
        .from('cashbank')
        .update({ balance: balanceAfter })
        .eq('user_id', user.id)
        .eq('number', parseInt(accountCode));

      if (updateError) throw updateError;

      toast.success("Money received successfully");
      fetchAccounts();
      fetchTransactions();
    } catch (error) {
      console.error('Error receiving money:', error);
      toast.error('Failed to receive money');
    }
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
    loading,
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
