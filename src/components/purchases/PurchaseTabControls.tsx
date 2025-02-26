
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PurchaseTabControlsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  onAddNew: () => void;
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
      <Button onClick={onAddNew}>
        <Plus className="mr-2" />
        Add New
      </Button>
    </div>
  );
}
