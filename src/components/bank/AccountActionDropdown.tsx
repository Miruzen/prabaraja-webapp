
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowRightLeft, PiggyBank, BarChart, Pencil, Archive, ArchiveRestore, Trash2, History } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { EditAccountDialog } from "./EditAccountDialog";
import { TransactionHistoryDialog } from "./TransactionHistoryDialog";
import { TransferFundsDialog } from "./TransferFundsDialog";
import { ReceiveMoneyDialog } from "./ReceiveMoneyDialog";
import { CashflowAnalysis } from "./CashflowAnalysis";
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
  reference?: string;
}

interface AccountActionDropdownProps {
  account: Account;
  onArchive: (account: Account) => void;
  onEdit: (account: Account) => void;
  onUnarchive?: (account: Account) => void;
  onDelete?: (account: Account) => void;
  transactions?: Transaction[];
  allAccounts?: Account[];
  onTransferFunds?: (fromCode: string, toCode: string, amount: number, notes: string) => void;
  onReceiveMoney?: (accountCode: string, amount: number, payer: string, reference: string, date: Date, notes: string) => void;
}

export function AccountActionDropdown({ 
  account, 
  onArchive, 
  onEdit, 
  onUnarchive, 
  onDelete,
  transactions = [],
  allAccounts = [],
  onTransferFunds,
  onReceiveMoney
}: AccountActionDropdownProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showCashflowDialog, setShowCashflowDialog] = useState(false);

  const handleArchiveConfirm = () => {
    onArchive(account);
    setShowArchiveDialog(false);
    toast.success("Account archived successfully");
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(account);
      setShowDeleteDialog(false);
      toast.success("Account deleted permanently");
    }
  };

  const handleUnarchiveConfirm = () => {
    if (onUnarchive) {
      onUnarchive(account);
      setShowUnarchiveDialog(false);
      toast.success("Account unarchived successfully");
    }
  };

  const handleEditSave = (updatedAccount: Account) => {
    onEdit(updatedAccount);
    setShowEditDialog(false);
    toast.success("Account updated successfully");
  };

  const handleTransferFunds = (fromCode: string, toCode: string, amount: number, notes: string) => {
    if (onTransferFunds) {
      onTransferFunds(fromCode, toCode, amount, notes);
      setShowTransferDialog(false);
      toast.success("Funds transferred successfully");
    }
  };

  const handleReceiveMoney = (accountCode: string, amount: number, payer: string, reference: string, date: Date, notes: string) => {
    if (onReceiveMoney) {
      onReceiveMoney(accountCode, amount, payer, reference, date, notes);
      setShowReceiveDialog(false);
      toast.success("Payment received successfully");
    }
  };

  const renderArchivedActions = () => (
    <DropdownMenuContent align="end" className="w-[200px] bg-white">
      <DropdownMenuItem onClick={() => setShowUnarchiveDialog(true)} className="cursor-pointer">
        <ArchiveRestore className="mr-2 h-4 w-4 text-[#10B981]" />
        Unarchive
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer">
        <Trash2 className="mr-2 h-4 w-4 text-[#ea384c]" />
        Delete Permanently
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  const renderActiveActions = () => (
    <DropdownMenuContent align="end" className="w-[200px] bg-white">
      <DropdownMenuItem onClick={() => setShowHistoryDialog(true)} className="cursor-pointer">
        <History className="mr-2 h-4 w-4 text-[#8B5CF6]" />
        History
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
        <Pencil className="mr-2 h-4 w-4 text-[#0FA0CE]" />
        Edit Account
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setShowArchiveDialog(true)} className="cursor-pointer">
        <Archive className="mr-2 h-4 w-4 text-[#ea384c]" />
        Archive Account
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setShowTransferDialog(true)} className="cursor-pointer">
        <ArrowRightLeft className="mr-2 h-4 w-4 text-[#3B82F6]" />
        Transfer Funds
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setShowReceiveDialog(true)} className="cursor-pointer">
        <PiggyBank className="mr-2 h-4 w-4 text-[#10B981]" />
        Receive Money
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setShowCashflowDialog(true)} className="cursor-pointer">
        <BarChart className="mr-2 h-4 w-4 text-[#8B5CF6]" />
        Cashflow Analysis
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Action <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {account.archived ? renderArchivedActions() : renderActiveActions()}
      </DropdownMenu>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveConfirm}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showUnarchiveDialog} onOpenChange={setShowUnarchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unarchive Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unarchive this account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnarchiveConfirm}>Unarchive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account and all its transaction history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditAccountDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        account={account}
        onSave={handleEditSave}
      />
      
      <TransactionHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        account={account}
        transactions={transactions.filter(t => t.accountCode === account.code)}
      />

      {onTransferFunds && (
        <TransferFundsDialog
          open={showTransferDialog}
          onOpenChange={setShowTransferDialog}
          fromAccount={account}
          accounts={allAccounts.filter(a => !a.archived && a.code !== account.code)}
          onTransfer={handleTransferFunds}
        />
      )}

      {onReceiveMoney && (
        <ReceiveMoneyDialog
          open={showReceiveDialog}
          onOpenChange={setShowReceiveDialog}
          account={account}
          onReceive={handleReceiveMoney}
        />
      )}

      {showCashflowDialog && (
        <CashflowAnalysis
          accounts={allAccounts.filter(a => !a.archived)}
          transactions={transactions}
          onClose={() => setShowCashflowDialog(false)}
        />
      )}
    </>
  );
}