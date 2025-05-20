
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { SalesNavTabs } from "@/components/sales/SalesNavTabs";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesSummaryCards } from "@/components/sales/SalesSummaryCards";
import { salesData } from "@/data/salesData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

const Sales = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("delivery");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Get the type based on active tab
  const getTypeForActiveTab = () => {
    switch(activeTab) {
      case "delivery": return "invoice";
      case "order": return "order";
      case "quotation": return "quotation";
      default: return "invoice";
    }
  };
  
  // First filter by tab type
  const dataFilteredByType = salesData.filter(sale => 
    sale.type === getTypeForActiveTab()
  );
  
  // Then filter by selected category
  const filteredSalesData = filterCategory === "all" 
    ? [...dataFilteredByType] 
    : dataFilteredByType.filter(sale => {
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

  // Handle delete action
  const handleDeleteSale = (id: string) => {
    // In a real app, this would call an API to delete the sale
    // For now we'll just show a toast message
    toast({
      title: "Sale deleted",
      description: `Sale with ID ${id} has been deleted.`,
      variant: "default",
    });
  };

  // Handle edit action
  const handleEditSale = (id: string) => {
    navigate(`/edit-sales/${id}`);
  };

  // Render empty table for empty tabs
  const renderEmptyTable = (message: string) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              {message}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
  
  // Render content based on active tab
  const renderTabContent = () => {
    // Determine message based on active tab
    const emptyMessage = `No ${activeTab === "delivery" ? "sales invoices" : 
                            activeTab === "order" ? "orders" : "quotations"} found.`;
    
    // Check if we have data for this tab type
    if (sortedData.length === 0) {
      return (
        <>
          <SalesFilters 
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          {renderEmptyTable(emptyMessage)}
        </>
      );
    }
    
    return (
      <>
        <SalesFilters 
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <SalesTable 
          filteredSalesData={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showTopControls={false}
          onDelete={handleDeleteSale}
          onEdit={handleEditSale}
        />
      </>
    );
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Toaster />
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Sales</h1>
              <p className="text-white/80"> Manage your company sales transaction</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Use the SalesNavTabs component with lucide icons */}
            <SalesNavTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />

            {/* Render content based on active tab */}
            {renderTabContent()}

            {/* Always show summary cards regardless of active tab */}
            <SalesSummaryCards salesData={salesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
