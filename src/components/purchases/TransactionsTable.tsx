import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Circle, MoreVertical, Edit, CreditCard, Trash, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  date: Date;
  number: string;
  approver: string;
  dueDate: Date | null;
  status: "pending" | "completed" | "cancelled" | "Half-paid";
  itemCount: number;
  amount: number;
  paidAmount?: number;
  items: InvoiceItem[];
  tags: string[];
  type: "invoice" | "shipment" | "order" | "offer" | "request";
}

const statusColors = {
  pending: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
  "Half-paid": "bg-blue-500",
};

interface TransactionsTableProps {
  transactions: Transaction[];
  searchQuery?: string;
  onDeleteTransaction: (id: string) => void;
  activeTab?: string;
  onApproveTransaction?: (id: string) => void;
  onRejectTransaction?: (id: string) => void;
}

export function TransactionsTable({
  transactions,
  searchQuery = "",
  onDeleteTransaction,
  activeTab = "all",
  onApproveTransaction = () => {},
  onRejectTransaction = () => {},
}: TransactionsTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter transactions based on search query and active tab
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      transaction.number.toLowerCase().includes(searchLower) ||
      transaction.approver.toLowerCase().includes(searchLower) ||
      transaction.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
    
    if (activeTab === "approval") {
      return matchesSearch && transaction.status === "pending";
    }
    return matchesSearch;
  }
);

  // Calculate amounts
  const transactionsWithAmount = filteredTransactions.map((transaction) => {
    const amount = transaction.amount || 
      (transaction.items?.length > 0
        ? transaction.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : 0);

    return {
      ...transaction,
      amount,
    };
  });

  // Handle actions
  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
  };

  const handleReceivePayment = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      navigate("/receive-payment", { state: { transaction } });
    }
  };

  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleApprove = (id: string) => {
    onApproveTransaction(id);
  };

  const handleReject = (id: string) => {
    onRejectTransaction(id);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      onDeleteTransaction(transactionToDelete);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  // Empty state message based on active tab
  const emptyStateMessage = activeTab === "approval" 
    ? "No transactions requiring approval" 
    : "No transactions found";

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>No.</TableHead>
            <TableHead>Staff Approval</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Paid Amount</TableHead>
            <TableHead>Remaining Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionsWithAmount.length > 0 ? (
            transactionsWithAmount.map((transaction) => {
              const paidAmount = transaction.paidAmount || 0;
              const remainingAmount = transaction.amount - paidAmount;

              return (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <Link
                      to={`/${transaction.type}/${transaction.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {transaction.number}
                    </Link>
                  </TableCell>
                  <TableCell>{transaction.approver}</TableCell>
                  <TableCell>
                    {transaction.dueDate ? format(transaction.dueDate, "dd/MM/yyyy") : "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                        {
                          "bg-yellow-100 text-yellow-800": transaction.status === "pending",
                          "bg-green-100 text-green-800": transaction.status === "completed",
                          "bg-red-100 text-red-800": transaction.status === "cancelled",
                          "bg-blue-100 text-blue-800": transaction.status === "Half-paid",
                        }
                      )}
                    >
                      <Circle
                        className={cn(
                          "h-2 w-2 fill-current",
                          statusColors[transaction.status]
                        )}
                      />
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(paidAmount)}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(remainingAmount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        {/* Always show Edit and Delete */}
                        <DropdownMenuItem
                          onClick={() => handleEdit(transaction.id)}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                          <span>Edit</span>
                        </DropdownMenuItem>

                        {/* Approval-specific actions */}
                        {activeTab === "approval" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApprove(transaction.id)}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReject(transaction.id)}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <X className="h-4 w-4 text-red-500" />
                              <span>Reject</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {/* Only show Receive Payment outside approval tab for pending/Half-paid */}
                        {activeTab !== "approval" && 
                          (transaction.status === "pending" || transaction.status === "Half-paid") && (
                            <DropdownMenuItem
                              onClick={() => handleReceivePayment(transaction.id)}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <CreditCard className="h-4 w-4 text-green-500" />
                              <span>Receive Payment</span>
                            </DropdownMenuItem>
                          )}

                        {/* Always show Delete */}
                        <DropdownMenuItem
                          onClick={() => handleDelete(transaction.id)}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                {emptyStateMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
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
    </div>
  );
}