
import { Sidebar } from "@/components/Sidebar";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseContent } from "@/components/purchases/PurchaseContent";

const Purchases = () => {
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
