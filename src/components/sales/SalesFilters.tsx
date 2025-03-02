
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react";

type FilterCategory = "all" | "unpaid" | "paid" | "late" | "awaiting";

interface SalesFiltersProps {
  filterCategory: FilterCategory;
  setFilterCategory: (value: FilterCategory) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const SalesFilters = ({
  filterCategory,
  setFilterCategory,
  searchValue,
  setSearchValue
}: SalesFiltersProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
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
      
      <div className="flex flex-col space-y-2 items-end">
        <Button 
          className="bg-indigo-600 text-white"
          onClick={() => navigate('/create-new-sales')}
        >
          <Plus className="mr-1 h-4 w-4" />
          Create new sales
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
