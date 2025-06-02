
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Purchase, 
  isInvoice, 
  isShipment, 
  isOrder, 
  isOffer, 
  isRequest 
} from "@/types/purchase";
import { InvoicesTable } from "./tables/InvoicesTable";
import { ShipmentsTable } from "./tables/ShipmentsTable";
import { OrdersTable } from "./tables/OrdersTable";
import { OffersTable } from "./tables/OffersTable";
import { RequestsTable } from "./tables/RequestsTable";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface TransactionsTableProps {
  transactions: Purchase[];
  activeTab: string;
  onDeleteTransaction: (id: string) => void;
  onApproveTransaction?: (id: string) => void;
  onRejectTransaction?: (id: string) => void;
  onReceivePayment?: (id: string) => void;
}

export function TransactionsTable({
  transactions,
  activeTab = "all",
  onDeleteTransaction,
  onApproveTransaction = () => {},
  onRejectTransaction = () => {},
  onReceivePayment = () => {},
}: TransactionsTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "approval") {
      return isRequest(transaction) && transaction.status === "pending";
    }
    return activeTab === transaction.type + "s";
  });

  // Common action handlers
  const handleEdit = (id: string) => navigate(`/edit-purchase/${id}`);
  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      onDeleteTransaction(transactionToDelete);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
      toast({
        title: "Deleted",
        description: "Transaction removed successfully",
        variant: "default",
      });
    }
  };

  const cancelDelete = () => setIsDeleteDialogOpen(false);

  // Render appropriate table based on activeTab
  const renderTable = () => {
    switch(activeTab) {
      case "invoices":
        return (
          <InvoicesTable
            invoices={filteredTransactions.filter(isInvoice)}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onReceivePayment={onReceivePayment}
          />
        );
      case "shipments":
        return (
          <ShipmentsTable
            shipments={filteredTransactions.filter(isShipment)}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        );
      case "orders":
        return (
          <OrdersTable
            orders={filteredTransactions.filter(isOrder)}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        );
      case "offers":
        return (
          <OffersTable
            offers={filteredTransactions.filter(isOffer)}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        );
      case "requests":
      case "approval":
        return (
          <RequestsTable
            requests={filteredTransactions.filter(isRequest)}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onApprove={activeTab === "approval" ? onApproveTransaction : undefined}
            onReject={activeTab === "approval" ? onRejectTransaction : undefined}
          />
        );
      default:
        return (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No table view available for this tab</p>
          </div>
        );
    }
  };

  return (
    <>
      {renderTable()}
      
      {/* Shared Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              No
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
