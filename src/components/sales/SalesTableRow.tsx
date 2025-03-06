
import { TableRow, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";

interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  dueDate: string;
  status: string;
  total: string;
}

interface SalesTableRowProps {
  row: SalesData;
}

export const SalesTableRow = ({ row }: SalesTableRowProps) => {
  return (
    <TableRow key={row.id}>
      <TableCell>{row.date}</TableCell>
      <TableCell>
        <Link to={`/sales-invoice/${row.id}`} className="text-indigo-600 hover:underline">
          {row.number}
        </Link>
      </TableCell>
      <TableCell className="text-indigo-600">{row.customer}</TableCell>
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
    </TableRow>
  );
};
