
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseContent } from "@/components/purchases/PurchaseContent";
import { useNavigate } from "react-router-dom";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState<string>("invoice");
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseHeader />
        <div className="p-6">
          <PurchaseContent />
        </div>
      </div>
    </div>
  );
};

export default Purchases;
