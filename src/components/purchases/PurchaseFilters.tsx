import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurchaseFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function PurchaseFilters({ statusFilter, onStatusFilterChange }: PurchaseFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search transactions..." className="pl-9" />
      </div>

      {/* Status Filter Dropdown */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status filter" />
        </SelectTrigger>
        <SelectContent>
          {/* All Status Option */}
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              All Status
            </span>
          </SelectItem>

          {/* Pending Option */}
          <SelectItem value="pending">
            <span className="flex items-center gap-2">
              <Circle className={cn("h-3 w-3 fill-current text-yellow-500")} />
              Pending
            </span>
          </SelectItem>

          {/* Half-Paid Option */}
          <SelectItem value="Half-paid">
            <span className="flex items-center gap-2">
              <Circle className={cn("h-3 w-3 fill-current text-blue-500")} />
              Half-Paid
            </span>
          </SelectItem>

          {/* Completed Option */}
          <SelectItem value="completed">
            <span className="flex items-center gap-2">
              <Circle className={cn("h-3 w-3 fill-current text-green-500")} />
              Completed
            </span>
          </SelectItem>

          {/* Cancelled Option */}
          <SelectItem value="cancelled">
            <span className="flex items-center gap-2">
              <Circle className={cn("h-3 w-3 fill-current text-red-500")} />
              Cancelled
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}