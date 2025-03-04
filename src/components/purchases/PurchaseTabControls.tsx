
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PurchaseTabControlsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function PurchaseTabControls({
  activeTab,
  setActiveTab,
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
    </div>
  );
}
