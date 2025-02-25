
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface SoldAsset {
  id: string;
  dateSold: string;
  detail: string;
  transactionNo: string;
  boughtPrice: number;
  sellingPrice: number;
}

// Mock data - replace with actual data fetching
const mockSoldAssets: SoldAsset[] = [
  {
    id: "1",
    dateSold: "2024-02-15",
    detail: "Old Office Laptop",
    transactionNo: "TRX-001",
    boughtPrice: 15000000,
    sellingPrice: 8000000,
  },
  // Add more mock data as needed
];

interface SoldAssetsTableProps {
  itemsPerPage: number;
  search: string;
}

export const SoldAssetsTable = ({ itemsPerPage, search }: SoldAssetsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAssets = mockSoldAssets.filter((asset) =>
    asset.detail.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Sold</TableHead>
            <TableHead>Asset Detail</TableHead>
            <TableHead>Transaction No</TableHead>
            <TableHead>Profit/Loss</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAssets.map((asset) => {
            const profitLoss = asset.sellingPrice - asset.boughtPrice;
            return (
              <TableRow key={asset.id}>
                <TableCell>{new Date(asset.dateSold).toLocaleDateString()}</TableCell>
                <TableCell>{asset.detail}</TableCell>
                <TableCell>{asset.transactionNo}</TableCell>
                <TableCell className={profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(profitLoss)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
