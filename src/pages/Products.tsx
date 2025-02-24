import { Sidebar } from "@/components/Sidebar";
import { BoxesIcon, ChevronDown, CirclePlus, PackagePlus, WarehouseIcon } from "lucide-react";
import { Plus } from "lucide-react";
import React, { useState } from "react" 
import { Check, X, Search, Filter } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const products = [
  {
    code: "PRD001",
    category: "Electronics",
    name: "Laptop",
    totalStock: 15,
    minStock: 5,
    unit: "Unit",
    buyPrice: 8000000,
    sellPrice: 10000000,
    status: "In Stock",
  },
  {
    code: "PRD002",
    category: "Electronics",
    name: "Smartphone",
    totalStock: 0,
    minStock: 10,
    unit: "Unit",
    buyPrice: 2000000,
    sellPrice: 2500000,
    status: "Out of Stock",
  },
  {
    code: "PRD003",
    category: "Office",
    name: "Desk Chair",
    totalStock: 8,
    minStock: 3,
    unit: "Unit",
    buyPrice: 500000,
    sellPrice: 750000,
    status: "In Stock",
  },
]

export  function ActionDropDown() { 
  const [isOpen, setIsOpen] = useState(false) ; 
  const navigate = useNavigate() ; 

  const handleOptionClick = (path) => {
    navigate(path) ;
    setIsOpen(false);
  };

  return ( 
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            {/* Action Button */}
            <Button
              className="bg-[#6366F1] text-white ml-auto flex items-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              Action <ChevronDown className="ml-2 h-4 w-4" />
            </Button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  {/* Option 1: Add New Product */}
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleOptionClick('/add-product')}
                  >
                    {getCategoryIcon("NProducts")} 
                    Add New Product
                  </button>

                  {/* Option 2: Add New Warehouse */}
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleOptionClick('/add-warehouse')}
                  >
                    {getCategoryIcon("Warehouse")}
                    Add New Warehouse
                  </button>

                  {/* Option 3: Adjust Stock */}
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleOptionClick('/adjust-stock')}
                  >
                    {getCategoryIcon("Stocks")}
                    Adjust Stock
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const categories = ["All", "Electronics", "Office", "Furniture"]
const units = ["Unit", "Box", "Pack", "Piece"]

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Stocks":
      return "#0EA5E9";
    case "Warehouse":
      return "#8B5CF6";
    case "NProducts":
      return "#F97316";
    default:
      return "#64748B";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Stock":
      return <CirclePlus size={16} color={getCategoryColor("Stocks")} />;
    case "Warehouse":
      return <WarehouseIcon size={16} color={getCategoryColor("Warehouse")} />;
    case "NProducts":
      return <PackagePlus size={16} color={getCategoryColor("NProducts")} />;
    default:
      return <Plus size={16} color={getCategoryColor("default")} />;
  }
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  // Filter products based on category and search query
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Format currency in Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Products</h1>
        </div>
    
      {/* <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button className="bg-[#6366F1] text-white ml-auto">
              Action <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div> */}

      {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] gap-4">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      <Plus size={16} clasName ="text-black-400" />
                      Create Products
                    </span>
                  </SelectItem>
                  <SelectItem value="Customer">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon("NProducts")}
                      Add Products
                    </span>
                  </SelectItem>
                  <SelectItem value="Vendor">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon("Warehouse")}
                      Add Warehouse
                    </span>
                  </SelectItem>
                  <SelectItem value="Employee">
                    <span className="flex items-center gap-2">
                      {getCategoryIcon("Stocks")}
                      Adjust Stock
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select> */}

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between gap-4 mb-6">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Buy Price</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product.code}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.totalStock}</TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>
                    <Select defaultValue={product.unit}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatCurrency(product.buyPrice)}</TableCell>
                  <TableCell>{formatCurrency(product.sellPrice)}</TableCell>
                  <TableCell>
                    <span
                      className={`flex items-center gap-2 ${
                        product.status === "In Stock"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.status === "In Stock" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      {product.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

export default Products

