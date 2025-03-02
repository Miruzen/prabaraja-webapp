
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SalesNavTabs } from "@/components/sales/SalesNavTabs";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesSummaryCards } from "@/components/sales/SalesSummaryCards";
import { salesData } from "@/data/salesData";

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

const Sales = () => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Filter sales data based on selected category
  const filteredSalesData = filterCategory === "all" 
    ? [...salesData] 
    : salesData.filter(sale => {
        switch(filterCategory) {
          case "paid":
            return sale.status === "Paid";
          case "unpaid":
            return sale.status === "Unpaid";
          case "late":
            return sale.status === "Late Payment";
          case "awaiting":
            return sale.status === "Awaiting Payment";
          default:
            return true;
        }
      });
  
  // Further filter by search term if provided
  const searchFilteredData = searchValue 
    ? filteredSalesData.filter(sale => 
        sale.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
        sale.number.toLowerCase().includes(searchValue.toLowerCase())
      )
    : filteredSalesData;
  
  // Sort data by date (newest to oldest)
  const sortedData = [...searchFilteredData].sort((a, b) => {
    // Convert DD/MM/YYYY format to Date objects for comparison
    const [aDay, aMonth, aYear] = a.date.split("/").map(Number);
    const [bDay, bMonth, bYear] = b.date.split("/").map(Number);
    
    const dateA = new Date(aYear, aMonth - 1, aDay);
    const dateB = new Date(bYear, bMonth - 1, bDay);
    
    // Sort in descending order (newest first)
    return dateB.getTime() - dateA.getTime();
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Sales</h1>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Top Navigation */}
            <SalesNavTabs />

            {/* Actions Bar */}
            <SalesFilters 
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />

            {/* Table with pagination - pass paginated data */}
            <SalesTable 
              filteredSalesData={paginatedData}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={sortedData.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />

            {/* Summary Cards */}
            <SalesSummaryCards salesData={salesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
