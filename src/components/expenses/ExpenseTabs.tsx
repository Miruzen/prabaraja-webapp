
import { Button } from "@/components/ui/button";

interface ExpenseTabsProps {
  activeTab: "expenses" | "approval";
  onTabChange: (tab: "expenses" | "approval") => void;
}

export const ExpenseTabs = ({ activeTab, onTabChange }: ExpenseTabsProps) => {
  return (
    <div className="flex items-center space-x-6 border-b border-gray-200 pb-4">
      <Button 
        variant="link" 
        className={activeTab === "expenses" ? "text-blue-500 font-medium" : "text-gray-500"}
        onClick={() => onTabChange("expenses")}
      >
        Expenses
      </Button>
      <Button 
        variant="link" 
        className={activeTab === "approval" ? "text-blue-500 font-medium" : "text-gray-500"}
        onClick={() => onTabChange("approval")}
      >
        Require Approval
      </Button>
    </div>
  );
};
