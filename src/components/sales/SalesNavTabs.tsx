
import { Button } from "@/components/ui/button";

interface SalesNavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SalesNavTabs = ({ activeTab, setActiveTab }: SalesNavTabsProps) => {
  return (
    <div className="flex items-center space-x-6 border-b border-gray-200 pb-4">
      <Button 
        variant="link" 
        className={activeTab === "delivery" ? "text-indigo-600 font-medium" : "text-gray-500"}
        onClick={() => setActiveTab("delivery")}
      >
        Delivery
      </Button>
      <Button 
        variant="link" 
        className={activeTab === "order" ? "text-indigo-600 font-medium" : "text-gray-500"}
        onClick={() => setActiveTab("order")}
      >
        Order
      </Button>
      <Button 
        variant="link" 
        className={activeTab === "quotation" ? "text-indigo-600 font-medium" : "text-gray-500"}
        onClick={() => setActiveTab("quotation")}
      >
        Quotation
      </Button>
    </div>
  );
};
