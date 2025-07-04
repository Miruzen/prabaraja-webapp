
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
  customerId?: number;
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
  
  const handleCustomerClick = () => {
    if (row.customerId) {
      navigate(`/contact-details/${row.customerId}`);
    } else {
      navigate(`/contact-details/1`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.id);
    } else {
      navigate(`/edit-sales/${row.id}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row.id);
    }
  };

  // Determine the correct detail route based on the number prefix
  const getDetailRoute = () => {
    if (row.number.startsWith('INV-')) {
      return `/sales-invoice/${row.id}`;
    } else if (row.number.startsWith('ORD-')) {
      return `/order-delivery/${row.id}`;
    } else if (row.number.startsWith('QUO-')) {
      return `/quotation/${row.id}`;
    }
    return `/sales-invoice/${row.id}`; // fallback
  };

  return (
    <TableRow key={row.id}>
      <TableCell>{row.date}</TableCell>
      <TableCell>
        <Link to={getDetailRoute()} className="text-indigo-600 hover:underline">
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
