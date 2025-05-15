import { Search, Plus, FileText, Truck, DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

interface SalesFiltersProps {
  filterCategory: FilterCategory;
  setFilterCategory: (value: FilterCategory) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const navigate = useNavigate();

const handleCreateNew = (type: string) => {
  navigate("/create-new-sales", { state: { type } });
};

export const SalesFilters = ({
  filterCategory,
  setFilterCategory,
  searchValue,
  setSearchValue
}: SalesFiltersProps) => {
  return (
    <div className="flex justify-between items-center space-x-4">
      <div className="flex space-x-2 items-center">
        <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as FilterCategory)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unpaid">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span>Unpaid</span>
              </div>
            </SelectItem>
            <SelectItem value="paid">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Paid</span>
              </div>
            </SelectItem>
            <SelectItem value="late">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Late Payment</span>
              </div>
            </SelectItem>
            <SelectItem value="awaiting">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span>Awaiting Payment</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2 items-center">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-300"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex items-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Create New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md">
              <DropdownMenuItem onClick={() => handleCreateNew("delivery")} className="flex items-center cursor-pointer hover:bg-indigo-100">
                <FileText className="mr-2 h-4 w-4 text-purple-500" /> Sales Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateNew("order")} className="flex items-center cursor-pointer hover:bg-indigo-100">
                <Truck className="mr-2 h-4 w-4 text-orange-500" /> Order & Delivery
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateNew("quotation")} className="flex items-center cursor-pointer hover:bg-indigo-100">
                <FileText className="mr-2 h-4 w-4 text-blue-500" /> Quotation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
