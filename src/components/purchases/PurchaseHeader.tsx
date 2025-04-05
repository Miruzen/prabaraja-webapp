
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function PurchaseHeader() {
  return (
    <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Purchases</h1>
          <p className="text-white/80">Manage your purchase transactions</p>
        </div>
        <Link to="/create-new-purchase">
          <Button className="bg-white text-indigo-600 hover:bg-gray-100">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>
    </div>
  );
}
