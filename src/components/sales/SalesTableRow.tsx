
import { TableRow, TableCell } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash } from "lucide-react";

interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  customerId?: number; // Added customerId field
  dueDate: string;
  status: string;
  total: string;
}

interface SalesTableRowProps {
  row: SalesData;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const SalesTableRow = ({ row, onDelete, onEdit }: SalesTableRowProps) => {
  const navigate = useNavigate();
  
  // Find the contact ID for this customer
  const handleCustomerClick = () => {
    // If we have a customerId, use it directly
    if (row.customerId) {
      navigate(`/contact-details/${row.customerId}`);
    } else {
      // This is fallback logic in case customerId is not available
      // Find the correct contact in the Contacts database - we'll use ID 1 for now as fallback
      navigate(`/contact-details/1`);
    }
  };

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.id);
    } else {
      navigate(`/edit-sales/${row.id}`);
    }
  };

  // Handle delete action
  const handleDelete = () => {
    if (onDelete) {
      onDelete(row.id);
    }
  };

  return (
    <TableRow key={row.id}>
      <TableCell>{row.date}</TableCell>
      <TableCell>
        <Link to={`/sales-invoice/${row.id}`} className="text-indigo-600 hover:underline">
          {row.number}
        </Link>
      </TableCell>
      <TableCell>
        <button 
          onClick={handleCustomerClick}
          className="text-indigo-600 hover:underline text-left"
        >
          {row.customer}
        </button>
      </TableCell>
      <TableCell>{row.dueDate}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-sm ${
          row.status === "Paid" 
            ? "bg-green-100 text-green-800" 
            : row.status === "Unpaid"
              ? "bg-orange-100 text-orange-800"
              : row.status === "Late Payment"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
        }`}>
          {row.status}
        </span>
      </TableCell>
      <TableCell>{row.total}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
