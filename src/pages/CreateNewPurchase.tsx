
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { PurchaseFormHeader } from "@/components/purchases/PurchaseFormHeader";
import { CreatePurchaseForm } from "@/components/purchases/CreatePurchaseForm";
import { PurchaseType } from "@/types/purchase";

const CreateNewPurchase = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type") as PurchaseType || "invoice";
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(typeFromUrl);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseFormHeader purchaseType={purchaseType} />

        <div className="p-6 max-w-5xl mx-auto">
          <CreatePurchaseForm 
            purchaseType={purchaseType}
            setPurchaseType={setPurchaseType}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNewPurchase;
