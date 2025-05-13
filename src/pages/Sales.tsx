
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

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

const Sales = () => {
  const navigate = useNavigate();
  // Add active tab state
  const [activeTab, setActiveTab] = useState("delivery");
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

  // Render empty table for Order and Quotation tabs
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
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
          <SalesTable 
            filteredSalesData={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedData.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        );
      case "order":
        return renderEmptyTable("There haven't been any Orders added to the table yet.");
      case "quotation":
        return renderEmptyTable("There haven't been any Quotations added to the table yet.");
      default:
        return null;
    }
  };

  // Handle creating a new sales item based on type
  const handleCreateNew = (type: string) => {
    navigate("/create-new-sales", { state: { type } });
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Sales</h1>
              <p className="text-white/80"> Manage your company sales transaction</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                  <Plus className="mr-2 h-4 w-4" /> Create New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => handleCreateNew("delivery")} className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-purple-500" /> Sales Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateNew("order")} className="flex items-center cursor-pointer">
                  <Truck className="mr-2 h-4 w-4 text-orange-500" /> Order & Delivery
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateNew("quotation")} className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-blue-500" /> Quotation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Use the SalesNavTabs component with lucide icons */}
            <SalesNavTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />

            {/* Only show filters for delivery tab */}
            {activeTab === "delivery" && (
              <SalesFilters 
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            )}

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
