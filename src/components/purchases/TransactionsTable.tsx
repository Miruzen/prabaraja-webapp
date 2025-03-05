
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
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: Date;
  number: string;
  approver: string;
  dueDate: Date | null;
  status: "pending" | "completed" | "cancelled";
  itemCount: number;
  priority: "High" | "Medium" | "Low";
  tags: string[];
  type: "invoice" | "shipment" | "order" | "offer" | "request";
}

const statusColors = {
  pending: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
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
            <TableHead>Items</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{format(transaction.date, 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <Link 
                  to={`/${transaction.type}/${transaction.id}`} 
                  className="text-indigo-600 hover:underline"
                >
                  {transaction.number}
                </Link>
              </TableCell>
              <TableCell>{transaction.approver}</TableCell>
              <TableCell>{transaction.dueDate ? format(transaction.dueDate, 'dd/MM/yyyy') : '-'}</TableCell>
              <TableCell>
                <span className={cn(
                  "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                  {
                    "bg-yellow-100 text-yellow-800": transaction.status === "pending",
                    "bg-green-100 text-green-800": transaction.status === "completed",
                    "bg-red-100 text-red-800": transaction.status === "cancelled",
                  }
                )}>
                  <Circle className={cn("h-2 w-2 fill-current", statusColors[transaction.status])} />
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>{transaction.itemCount} items</TableCell>
              <TableCell>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  {
                    "bg-red-100 text-red-800": transaction.priority === "High",
                    "bg-yellow-100 text-yellow-800": transaction.priority === "Medium",
                    "bg-green-100 text-green-800": transaction.priority === "Low",
                  }
                )}>
                  {transaction.priority}
                </span>
              </TableCell>
              <TableCell>{transaction.tags.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
