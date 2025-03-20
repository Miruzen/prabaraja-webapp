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
import { Circle, MoreVertical, Edit, CreditCard, Trash } from "lucide-react"; // Added icons
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import dropdown components

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
  status: "pending" | "completed" | "cancelled";
  itemCount: number; // Kept for potential use elsewhere
  amount: number; // Added amount field
  items: InvoiceItem[]; // Add items field for dynamic calculation
  tags: string[]; // Tags will be hidden but searchable
  type: "invoice" | "shipment" | "order" | "offer" | "request";
}

const statusColors = {
  pending: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

interface TransactionsTableProps {
  transactions: Transaction[];
  searchQuery?: string; // Optional search query for filtering
}

export function TransactionsTable({ transactions, searchQuery = "" }: TransactionsTableProps) {
  // Filter transactions based on search query (including tags)
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.number.toLowerCase().includes(searchLower) ||
      transaction.approver.toLowerCase().includes(searchLower) ||
      transaction.tags.some((tag) => tag.toLowerCase().includes(searchLower)) // Search tags
    );
  });

  // Calculate the total amount for each transaction
  const transactionsWithAmount = filteredTransactions.map((transaction) => {
    // If the amount field is missing or 0, calculate it dynamically
    const amount = transaction.amount || (transaction.items && transaction.items.length ) > 0
      ? transaction.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      : 0;

    return {
      ...transaction,
      amount, // Ensure the amount field is populated
    };
  });

  // Handle actions
  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
    // Add your edit logic here
  };

  const handleReceivePayment = (id: string) => {
    console.log("Receive payment for transaction:", id);
    // Add your receive payment logic here
  };

  const handleDelete = (id: string) => {
    console.log("Delete invoice", id);
    
  };

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
            <TableHead>Amount</TableHead> {/* Added Amount column */}
            <TableHead>Actions</TableHead> {/* Added Actions column */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionsWithAmount.map((transaction) => (
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
                      "bg-yellow-100 text-yellow-800":
                        transaction.status === "pending",
                      "bg-green-100 text-green-800":
                        transaction.status === "completed",
                      "bg-red-100 text-red-800":
                        transaction.status === "cancelled",
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
                {/* Display amount in IDR format */}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0, // Remove decimal places for IDR
                }).format(transaction.amount)}
              </TableCell>
              {/* Actions Dropdown */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleEdit(transaction.id)}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleReceivePayment(transaction.id)}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <span>Receive Payment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(transaction.id)}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                      <span>Receive Payment</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}