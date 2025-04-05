
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PurchaseType } from "@/types/purchase";

export function PurchaseHeader() {
  const navigate = useNavigate();

  const handleAddNew = (type: PurchaseType) => {
    navigate(`/create-new-purchase?type=${type}`);
  };

  return (
    <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Purchases</h1>
          <p className="text-white/80">Manage your purchase transactions</p>
        </div>
        <div>
          <Button 
            onClick={() => handleAddNew("invoice")} 
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>
      </div>
    </div>
  );
}
