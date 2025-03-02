
import { Button } from "@/components/ui/button";

export const SalesNavTabs = () => {
  return (
    <div className="flex items-center space-x-6 border-b border-gray-200 pb-4">
      <Button variant="link" className="text-indigo-600 font-medium">Delivery</Button>
      <Button variant="link" className="text-gray-500">Order</Button>
      <Button variant="link" className="text-gray-500">Quotation</Button>
    </div>
  );
};
