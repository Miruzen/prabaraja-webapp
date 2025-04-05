
import { Sidebar } from "@/components/Sidebar";
import { PurchaseHeader } from "@/components/purchases/PurchaseHeader";
import { PurchaseContent } from "@/components/purchases/PurchaseContent";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Purchases = () => {
  const location = useLocation();
  
  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseHeader />
        <PurchaseContent />
      </div>
    </div>
  );
};

export default Purchases;
