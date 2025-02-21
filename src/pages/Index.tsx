
import { Sidebar } from "@/components/Sidebar";
import { 
  FileText, 
  ShoppingBag, 
  Receipt, 
  Package, 
  BarChart, 
  CreditCard 
} from "lucide-react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 gap-3 border border-gray-100"
  >
    <div className="text-blue-500">
      {icon}
    </div>
    <span className="text-gray-700 text-sm">{label}</span>
  </button>
);

const Index = () => {
  const handleAction = (action: string) => {
    console.log(`Action clicked: ${action}`);
  };

  const actions = [
    { icon: <Receipt size={24} />, label: "Create sales invoice", action: "sales-invoice" },
    { icon: <ShoppingBag size={24} />, label: "Create sales order", action: "sales-order" },
    { icon: <FileText size={24} />, label: "Create purchase invoice", action: "purchase-invoice" },
    { icon: <Package size={24} />, label: "Add new product", action: "new-product" },
    { icon: <BarChart size={24} />, label: "See profit & loss report", action: "profit-loss" },
    { icon: <CreditCard size={24} />, label: "Create expense transaction", action: "expense" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-white via-white to-[#28abe2] bg-[length:200%_100%] bg-[100%] p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-2">Hello, Lutfiana Widya</h1>
            <p className="text-gray-600">What activity do you want to do?</p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action) => (
              <ActionButton
                key={action.action}
                icon={action.icon}
                label={action.label}
                onClick={() => handleAction(action.action)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
