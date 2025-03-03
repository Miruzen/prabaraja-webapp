
import { FileText, Truck, ShoppingCart, Tag, HelpCircle } from "lucide-react";
import { PurchaseType } from "@/types/purchase";

interface PurchaseFormHeaderProps {
  purchaseType: PurchaseType;
}

export function PurchaseFormHeader({ purchaseType }: PurchaseFormHeaderProps) {
  const getTypeIcon = () => {
    switch (purchaseType) {
      case "invoice": return <FileText className="h-6 w-6 text-purple-500" />;
      case "shipment": return <Truck className="h-6 w-6 text-orange-500" />;
      case "order": return <ShoppingCart className="h-6 w-6 text-blue-500" />;
      case "offer": return <Tag className="h-6 w-6 text-green-500" />;
      case "request": return <HelpCircle className="h-6 w-6 text-pink-500" />;
    }
  };

  const getTypeTitle = () => {
    switch (purchaseType) {
      case "invoice": return "Invoice";
      case "shipment": return "Shipment";
      case "order": return "Order";
      case "offer": return "Offer";
      case "request": return "Request";
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-400 to-indigo-500 p-6">
      <div className="flex items-center">
        {getTypeIcon()}
        <h1 className="text-2xl font-semibold text-white ml-2">Create New {getTypeTitle()}</h1>
      </div>
    </div>
  );
}
