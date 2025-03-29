
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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SoldAsset {
  id: string;
  dateSold: string;
  detail: string;
  transactionNo: string;
  boughtPrice: number;
  sellingPrice: number;
}

interface SoldAssetsTableProps {
  itemsPerPage: number;
  search: string;
  soldAssets: SoldAsset[];
  onDeleteSoldAsset: (id: string) => void;
}

export const SoldAssetsTable = ({ itemsPerPage, search, soldAssets, onDeleteSoldAsset }: SoldAssetsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAssets = soldAssets.filter((asset) =>
    asset.detail.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (id: string) => {
    onDeleteSoldAsset(id);
    toast.success("Sold asset record deleted successfully");
  };

  if (filteredAssets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sold assets recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Sold</TableHead>
            <TableHead>Asset Detail</TableHead>
            <TableHead>Transaction No</TableHead>
            <TableHead>Profit/Loss</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(asset.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )})}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
