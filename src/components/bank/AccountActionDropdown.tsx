
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowRightLeft, PiggyBank, BarChart, Pencil, Archive, ArchiveRestore, Trash2 } from "lucide-react";
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
  archived?: boolean;
}

interface AccountActionDropdownProps {
  account: Account;
  onArchive: (account: Account) => void;
  onEdit: (account: Account) => void;
  onUnarchive?: (account: Account) => void;
  onDelete?: (account: Account) => void;
}

export function AccountActionDropdown({ account, onArchive, onEdit, onUnarchive, onDelete }: AccountActionDropdownProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleArchiveConfirm = () => {
    onArchive(account);
    setShowArchiveDialog(false);
    toast.success("Account archived successfully");
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(account);
      setShowDeleteDialog(false);
    }
  };

  const handleUnarchiveConfirm = () => {
    if (onUnarchive) {
      onUnarchive(account);
      setShowUnarchiveDialog(false);
    }
  };

  const handleEditSave = (updatedAccount: Account) => {
    onEdit(updatedAccount);
    toast.success("Account updated successfully");
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
      <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
        <Pencil className="mr-2 h-4 w-4 text-[#0FA0CE]" />
        Edit Account
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setShowArchiveDialog(true)} className="cursor-pointer">
        <Archive className="mr-2 h-4 w-4 text-[#ea384c]" />
        Archive Account
      </DropdownMenuItem>
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
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveConfirm}>Yes</AlertDialogAction>
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
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnarchiveConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account permanently? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Yes</AlertDialogAction>
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
