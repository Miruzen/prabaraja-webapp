import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { SalesNavTabs } from "@/components/sales/SalesNavTabs";
import { SalesFilters } from "@/components/sales/SalesFilters";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesSummaryCards } from "@/components/sales/SalesSummaryCards";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useSalesInvoices, useOrderDeliveries, useQuotations } from "@/hooks/useSalesData";
import { transformSalesInvoiceData, transformOrderDeliveryData, transformQuotationData } from "@/utils/salesDataUtils";

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

const Sales = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("delivery");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Fetch data from Supabase based on active tab
  const { data: salesInvoices = [], isLoading: loadingSalesInvoices } = useSalesInvoices();
  const { data: orderDeliveries = [], isLoading: loadingOrderDeliveries } = useOrderDeliveries();
  const { data: quotations = [], isLoading: loadingQuotations } = useQuotations();
  
  // Get data based on active tab
  const getCurrentTabData = () => {
    switch(activeTab) {
      case "delivery":
        return {
          data: transformSalesInvoiceData(salesInvoices),
          isLoading: loadingSalesInvoices,
          emptyMessage: "No sales invoices found."
        };
      case "order":
        return {
          data: transformOrderDeliveryData(orderDeliveries),
          isLoading: loadingOrderDeliveries,
          emptyMessage: "No orders found."
        };
      case "quotation":
        return {
          data: transformQuotationData(quotations),
          isLoading: loadingQuotations,
          emptyMessage: "No quotations found."
        };
      default:
        return {
          data: [],
          isLoading: false,
          emptyMessage: "No data found."
        };
    }
  };
  
  const { data: currentData, isLoading, emptyMessage } = getCurrentTabData();
  
  // Filter by selected category
  const filteredData = filterCategory === "all" 
    ? [...currentData] 
    : currentData.filter(item => {
        switch(filterCategory) {
          case "paid":
            return item.status === "Paid";
          case "unpaid":
            return item.status === "Unpaid";
          case "late":
            return item.status === "Late Payment";
          case "awaiting":
            return item.status === "Awaiting Payment";
          default:
            return true;
        }
      });
  
  // Further filter by search term if provided
  const searchFilteredData = searchValue 
    ? filteredData.filter(item => 
        item.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.number.toLowerCase().includes(searchValue.toLowerCase())
      )
    : filteredData;
  
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

  // Reset pagination when changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilterCategory("all");
    setSearchValue("");
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
              {isLoading ? "Loading..." : message}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
  
  // Render content based on active tab
  const renderTabContent = () => {
    // Check if we have data for this tab type or if still loading
    if (isLoading) {
      return (
        <>
          <SalesFilters 
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          {renderEmptyTable("Loading...")}
        </>
      );
    }
    
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
  
  // Get all data for summary cards (combine all tabs data)
  const allSalesData = [
    ...transformSalesInvoiceData(salesInvoices),
    ...transformOrderDeliveryData(orderDeliveries),
    ...transformQuotationData(quotations)
  ];
  
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
              setActiveTab={handleTabChange} 
            />

            {/* Render content based on active tab */}
            {renderTabContent()}

            {/* Always show summary cards regardless of active tab */}
            <SalesSummaryCards salesData={allSalesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
