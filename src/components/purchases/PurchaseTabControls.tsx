
import { Plus, FileText, Truck, ShoppingCart, Tag, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PurchaseTabControlsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  onAddNew: (type: "invoice" | "shipment" | "order" | "offer" | "request") => void;
}

export function PurchaseTabControls({
  activeTab,
  setActiveTab,
  onAddNew,
}: PurchaseTabControlsProps) {
  return (
    <div className="flex justify-between items-center">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2" />
            Add New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 z-50 bg-white">
          <DropdownMenuItem onClick={() => onAddNew("invoice")} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4 text-purple-500" />
            <span>New Invoice</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddNew("shipment")} className="cursor-pointer">
            <Truck className="mr-2 h-4 w-4 text-orange-500" />
            <span>New Shipment</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddNew("order")} className="cursor-pointer">
            <ShoppingCart className="mr-2 h-4 w-4 text-blue-500" />
            <span>New Order</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddNew("offer")} className="cursor-pointer">
            <Tag className="mr-2 h-4 w-4 text-green-500" />
            <span>New Offer</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddNew("request")} className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4 text-pink-500" />
            <span>New Request</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
