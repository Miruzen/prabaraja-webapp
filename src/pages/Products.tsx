import { Sidebar } from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ChevronDropdown from "@/components/ChevronDropdown";
import { Check, X, Search, Filter, ChevronDown, Warehouse, PackagePlus, CirclePlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";


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
];

const productCategories = ["All", "Electronics", "Office", "Furniture"];
const warehouseLocations = ["All", "Jakarta", "Tangerang", "Surabaya", "Bandung"];

const warehouses = [
  {
    code: "WH001",
    name: "Main Warehouse",
    location: "Tangerang",
    totalStock: 100,
  },
  {
    code: "WH002",
    name: "Secondary Warehouse",
    location: "Jakarta",
    totalStock: 50,
  },
];

const units = ["Unit", "Box", "Pack", "Piece"];

const Products = () => {
  const [selectedProductCategory, setSelectedProductCategory] = React.useState("All");
  const [selectedWarehouseLocation, setSelectedWarehouseLocation] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = useState("Products");  // Track active tab
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Filter products based on category and search query
  const filteredProducts = products.filter(
    (product) =>
      (selectedProductCategory === "All" || product.category === selectedProductCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter warehouses based on location
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      (selectedWarehouseLocation === "All" || warehouse.location === selectedWarehouseLocation)
  );

  // Calculate pagination for products
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startProductIndex = (currentPage - 1) * itemsPerPage;
  const endProductIndex = startProductIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startProductIndex, endProductIndex);

  // Format currency in Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const dropdownOptions = [
    {
      label: "Add New Product",
      action: () => navigate("/add-product"),
      icon: <PackagePlus size={16} color="#F97316" />,
    },
    {
      label: "Add New Warehouse",
      action: () => navigate("/add-warehouse"),
      icon: <Warehouse size={16} color="#8B5CF6" />,
    },
    {
      label: "Adjust Stock",
      action: () => navigate("/adjust-stock"),
      icon: <CirclePlus size={16} color="#0EA5E9" />,
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="text-white/80">Manage your company Products</p>
        </div>

        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              {/* Tab Navigation Box: Positioned above the table */}
              <div className="border p-4 rounded-md mb-6" style={{ backgroundColor: "#F4F2FF" }}>
                <div className="flex gap-6">
                  <button
                    className={`px-4 py-2 rounded-md ${activeTab === "Products" ? "bg-white text-indigo-500 border-b-4 border-indigo-500" : "text-gray-500"}`}
                    onClick={() => setActiveTab("Products")}
                  >
                    Products
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${activeTab === "Warehouses" ? "bg-white text-indigo-500 border-b-4 border-indigo-500" : "text-gray-500"}`}
                    onClick={() => setActiveTab("Warehouses")}
                  >
                    Warehouses
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "Products" && (
                <div>
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
                      <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <ChevronDropdown options={dropdownOptions} />
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
                          <TableCell>{product.unit}</TableCell>
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
                </div>
              )}

              {activeTab === "Warehouses" && (
                <div>
                  <div className="flex justify-between gap-4 mb-6">
                    <div className="flex gap-4 flex-1">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search warehouses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedWarehouseLocation} onValueChange={setSelectedWarehouseLocation}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouseLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <ChevronDropdown options={dropdownOptions} />
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Warehouse Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Total Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWarehouses.map((warehouse) => (
                        <TableRow key={warehouse.code}>
                          <TableCell>{warehouse.code}</TableCell>
                          <TableCell>{warehouse.name}</TableCell>
                          <TableCell>{warehouse.location}</TableCell>
                          <TableCell>{warehouse.totalStock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
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
                  {[...Array(totalProductPages)].map((_, i) => (
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
                        setCurrentPage((prev) => Math.min(prev + 1, totalProductPages))
                      }
                      className={currentPage === totalProductPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Products;
