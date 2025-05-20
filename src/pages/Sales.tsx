import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { SalesNavTabs } from "@/components/sales/SalesNavTabs";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesSummaryCards } from "@/components/sales/SalesSummaryCards";
import { salesData } from "@/data/salesData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, Truck, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

const Sales = () => {
  const navigate = useNavigate();
  // Add active tab state
  const [activeTab, setActiveTab] = useState("delivery");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // For Order tab specific filters
  const [orderSearchValue, setOrderSearchValue] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  
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
  
  // Filter and search for order data specifically
  const orderData = salesData.filter(sale => {
    const matchesSearch = orderSearchValue
      ? sale.customer.toLowerCase().includes(orderSearchValue.toLowerCase()) ||
        sale.number.toLowerCase().includes(orderSearchValue.toLowerCase())
      : true;
      
    const matchesStatus = orderStatusFilter === "all" 
      ? true 
      : sale.status.toLowerCase().replace(" ", "_") === orderStatusFilter.toLowerCase();
      
    return matchesSearch && matchesStatus;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  
  const orderTotalPages = Math.ceil(orderData.length / pageSize);
  const orderPaginatedData = orderData.slice(startIndex, startIndex + pageSize);
  
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

  // Render empty table for Quotation tab
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
    switch (activeTab) {
      case "delivery":
        return (
          <>
            {/* Only show filters for delivery tab */}
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
      case "order":
        return (
          <>
            {/* Only show filters for delivery tab */}
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
      case "quotation":
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
        )
      default:
        return null;
    }
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

            {/* Only show summary cards for delivery tab */}
            {activeTab === "delivery" && (
              <SalesSummaryCards salesData={salesData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
