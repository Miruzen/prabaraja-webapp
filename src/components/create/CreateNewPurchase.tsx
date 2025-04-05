
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { PurchaseFormHeader } from "@/components/purchases/PurchaseFormHeader";
import { CreatePurchaseForm } from "@/components/create/CreatePurchaseForm";
import { PurchaseType } from "@/types/purchase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreateNewPurchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type") as PurchaseType || "invoice";
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(typeFromUrl);

  const handleGoBack = () => {
    navigate('/purchases');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseFormHeader purchaseType={purchaseType} />

        <div className="p-6 max-w-5xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-gray-500 hover:text-gray-700" 
              onClick={handleGoBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchases
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <CreatePurchaseForm 
              purchaseType={purchaseType}
              setPurchaseType={setPurchaseType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPurchase;
