
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExpenseTabsProps {
  activeTab: "expenses" | "approval";
  onTabChange: (tab: "expenses" | "approval") => void;
}

export const ExpenseTabs = ({ activeTab, onTabChange }: ExpenseTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={(value) => onTabChange(value as "expenses" | "approval")}>
      <TabsList className="w-full max-w-md border border-gray-200 rounded-lg bg-white p-1">
        <TabsTrigger 
          value="expenses" 
          className={`flex-1 rounded-md py-2 ${activeTab === "expenses" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
        >
          Expenses
        </TabsTrigger>
        <TabsTrigger 
          value="approval" 
          className={`flex-1 rounded-md py-2 ${activeTab === "approval" ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
        >
          Require Approval
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
