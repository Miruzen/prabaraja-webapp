
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionDropdown } from "./ActionDropdown";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Expense, ExpenseStatus } from "@/types/expense";

interface ExpenseTableProps {
  expenses: Expense[];
  tableType: "expenses" | "approval";
  onDeleteExpense: (id: string) => void;
  onApproveExpense?: (id: string) => void;
}

export const ExpenseTable = ({ 
  expenses, 
  tableType, 
  onDeleteExpense, 
  onApproveExpense 
}: ExpenseTableProps) => {
  const filteredExpenses = expenses.filter(expense => 
    (tableType === "expenses" && expense.status === "Paid") ||
    (tableType === "approval" && expense.status === "Require Approval")
  );

  return (
    <Table>
      <TableHeader className="bg-blue-50">
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Beneficiary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total (in IDR)</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredExpenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No {tableType === "approval" ? "pending approval" : "paid"} expenses found
            </TableCell>
          </TableRow>
        ) : (
          filteredExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.date}</TableCell>
              <TableCell className="text-blue-600">{expense.number}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell className="text-blue-600">{expense.beneficiary}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  expense.status === "Paid" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {expense.status}
                </span>
              </TableCell>
              <TableCell>{expense.total}</TableCell>
              <TableCell>
                {tableType === "approval" && onApproveExpense ? (
                  <ActionDropdown 
                    expenseId={expense.id} 
                    onApprove={onApproveExpense} 
                    onDelete={onDeleteExpense} 
                  />
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this expense? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeleteExpense(expense.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
