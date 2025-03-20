import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import  ChevronDropdown  from "@/components/ChevronDropdown";
import { Card, CardContent } from "@/components/ui/card";
import { TabNavigation } from "@/components/products/TabNavigation";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductTable } from "@/components/products/ProductTable";
import { WarehouseTable } from "@/components/products/WarehouseTable";
import { WarehouseFilters } from "@/components/products/WarehouseFilters";
import { ProductPagination } from "@/components/products/ProductPagination";
import { products, warehouses, productCategories, warehouseLocations } from "@/data/productData";
import { useDropdownOptions } from "@/components/products/DropdownOptions"; // Import the hook

const Products = () => {
  const [activeTab, setActiveTab] = useState("Products");
  const [selectedProductCategory, setSelectedProductCategory] = useState("All");
  const [selectedWarehouseLocation, setSelectedWarehouseLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use the hook to get dropdown options
  const dropdownOptions = useDropdownOptions();

  // Filter products and warehouses
  const filteredProducts = products.filter(
    (product) =>
      (selectedProductCategory === "All" || product.category === selectedProductCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      (selectedWarehouseLocation === "All" || warehouse.location === selectedWarehouseLocation)
  );

  // Pagination logic
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startProductIndex = (currentPage - 1) * itemsPerPage;
  const endProductIndex = startProductIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startProductIndex, endProductIndex);

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
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === "Products" && (
                <div>
                  <div className="flex justify-between gap-4 mb-6">
                    <ProductFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      selectedProductCategory={selectedProductCategory}
                      setSelectedProductCategory={setSelectedProductCategory}
                      productCategories={productCategories}
                    />
                    <ChevronDropdown options={dropdownOptions} />
                  </div>

                  <ProductTable products={currentProducts} />
                  <ProductPagination
                    currentPage={currentPage}
                    totalProductPages={totalProductPages}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}

              {activeTab === "Warehouses" && (
                <div>
                  <div className="flex justify-between gap-4 mb-6">
                    <WarehouseFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      selectedWarehouseLocation={selectedWarehouseLocation}
                      setSelectedWarehouseLocation={setSelectedWarehouseLocation}
                      warehouseLocations={warehouseLocations}
                    />
                    <ChevronDropdown options={dropdownOptions} />
                  </div>

                  <WarehouseTable warehouses={filteredWarehouses} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Products;