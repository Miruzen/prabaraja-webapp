
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseContent } from "@/components/purchases/PurchaseContent";
import { useInvoices } from "@/hooks/usePurchases";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const { data: invoices, isLoading, error } = useInvoices();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <PurchaseHeader />
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading purchases...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <PurchaseHeader />
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-600">Error loading purchases: {error.message}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseHeader />
        <div className="p-6">
          <PurchaseContent invoices={invoices || []} />
        </div>
      </div>
    </div>
  );
};

export default Purchases;
