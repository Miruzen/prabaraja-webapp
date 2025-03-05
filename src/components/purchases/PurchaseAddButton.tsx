
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Package, 
  ShoppingCart, 
  Tag, 
  FileQuestion,
  Plus
} from "lucide-react";
import { PurchaseType } from "@/types/purchase";

interface PurchaseAddButtonProps {
  onAddPurchase: (type: PurchaseType) => void;
}

export function PurchaseAddButton({ onAddPurchase }: PurchaseAddButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => onAddPurchase("invoice")}>
          <FileText className="mr-2 h-4 w-4 text-purple-500" /> New Invoice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddPurchase("shipment")}>
          <Package className="mr-2 h-4 w-4 text-orange-500" /> New Shipment
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddPurchase("order")}>
          <ShoppingCart className="mr-2 h-4 w-4 text-blue-500" /> New Order
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddPurchase("offer")}>
          <Tag className="mr-2 h-4 w-4 text-green-500" /> New Offer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddPurchase("request")}>
          <FileQuestion className="mr-2 h-4 w-4 text-pink-500" /> New Request
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
