
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SalesTableHeader } from "./SalesTableHeader";
import { SalesTableRow } from "./SalesTableRow";
import { SalesTablePagination } from "./SalesTablePagination";
import { SalesTableFooter } from "./SalesTableFooter";

interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  dueDate: string;
  status: string;
  total: string;
}

interface SalesTableProps {
  filteredSalesData: SalesData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const SalesTable = ({ 
  filteredSalesData, 
  currentPage, 
  totalPages, 
  pageSize, 
  totalItems,
  onPageChange, 
  onPageSizeChange 
}: SalesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <SalesTableHeader />
        <TableBody>
          {filteredSalesData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No sales data found
              </TableCell>
            </TableRow>
          ) : (
            filteredSalesData.map((row) => (
              <SalesTableRow key={row.id} row={row} />
            ))
          )}
        </TableBody>
      </Table>

      <SalesTableFooter 
        itemsCount={filteredSalesData.length}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />

      <SalesTablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
