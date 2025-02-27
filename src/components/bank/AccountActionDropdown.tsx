
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowRightLeft, PiggyBank, BarChart, Pencil, Archive } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { EditAccountDialog } from "./EditAccountDialog";
import { toast } from "sonner";

interface Account {
  code: string;
  name: string;
  balance: string;
  bankName?: string;
  accountNumber?: string;
}

interface AccountActionDropdownProps {
  account: Account;
  onArchive: (account: Account) => void;
  onEdit: (account: Account) => void;
}

export function AccountActionDropdown({ account, onArchive, onEdit }: AccountActionDropdownProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleArchiveConfirm = () => {
    onArchive(account);
    setShowArchiveDialog(false);
    toast.success("Account archived successfully");
  };

  const handleEditSave = (updatedAccount: Account) => {
    onEdit(updatedAccount);
    toast.success("Account updated successfully");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Action <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] bg-white">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4 text-[#0FA0CE]" />
            Edit Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowArchiveDialog(true)} className="cursor-pointer">
            <Archive className="mr-2 h-4 w-4 text-[#ea384c]" />
            Archive Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toast.info("Coming soon!")} className="cursor-pointer">
            <ArrowRightLeft className="mr-2 h-4 w-4 text-[#3B82F6]" />
            Transfer Funds
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("Coming soon!")} className="cursor-pointer">
            <PiggyBank className="mr-2 h-4 w-4 text-[#10B981]" />
            Receive Money
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("Coming soon!")} className="cursor-pointer">
            <BarChart className="mr-2 h-4 w-4 text-[#8B5CF6]" />
            Cashflow Analysis
          </DropdownMenuItem>
        </DropdownMenuContent>
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

      <EditAccountDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        account={account}
        onSave={handleEditSave}
      />
    </>
  );
}
