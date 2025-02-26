
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
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search transactions..." className="pl-9" />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              All Status
            </span>
          </SelectItem>
          <SelectItem value="pending">
            <span className="flex items-center gap-2">
              <Circle className={cn("h-3 w-3 fill-current text-yellow-500")} />
              Pending
            </span>
          </SelectItem>
          <SelectItem value="completed">
            <span className="flex items-center gap-2">
              <Circle className={cn("h-3 w-3 fill-current text-green-500")} />
              Completed
            </span>
          </SelectItem>
          <SelectItem value="cancelled">
            <span className="flex items-center gap-2">
              <Circle className={cn("h-3 w-3 fill-current text-red-500")} />
              Cancelled
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        More Filters
      </Button>
    </div>
  );
}
