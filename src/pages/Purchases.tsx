
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseContent } from "@/components/purchases/PurchaseContent";
import { useNavigate } from "react-router-dom";
import { PurchaseType } from "@/types/purchase";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState<string>("invoice");
  const navigate = useNavigate();

  const handleAddPurchase = (type: PurchaseType) => {
    navigate("/create-new-purchase", { state: { type } });
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseHeader showAddButton={false} />
        <div className="p-6">
          <PurchaseContent onAddPurchase={handleAddPurchase} />
        </div>
      </div>
    </div>
  );
};

export default Purchases;
