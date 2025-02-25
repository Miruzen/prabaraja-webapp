
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

interface Asset {
  id: string;
  dateAdded: string;
  detail: string;
  warrantyDeadline: string;
  price: number;
  depreciation: number;
}

// Mock data - replace with actual data fetching
const mockAssets: Asset[] = [
  {
    id: "1",
    dateAdded: "2024-01-15",
    detail: "Office Laptop",
    warrantyDeadline: "2027-01-15",
    price: 15000000,
    depreciation: 3000000,
  },
  // Add more mock data as needed
];

interface AssetsTableProps {
  itemsPerPage: number;
  search: string;
}

export const AssetsTable = ({ itemsPerPage, search }: AssetsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAssets = mockAssets.filter((asset) =>
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
            <TableHead>Date Added</TableHead>
            <TableHead>Asset Detail</TableHead>
            <TableHead>Warranty Deadline</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead>Depreciation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{new Date(asset.dateAdded).toLocaleDateString()}</TableCell>
              <TableCell>{asset.detail}</TableCell>
              <TableCell>
                {new Date(asset.warrantyDeadline).toLocaleDateString()}
              </TableCell>
              <TableCell>{formatCurrency(asset.price)}</TableCell>
              <TableCell>{formatCurrency(asset.depreciation)}</TableCell>
            </TableRow>
          ))}
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
