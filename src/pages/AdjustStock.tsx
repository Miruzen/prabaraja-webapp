
import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdjustStock = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/products")}
            className="text-white hover:bg-white/10 rounded-full p-2 mr-4"
            aria-label="Back to Products"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Adjust Stock</h1>
            <p className="text-white/80">This feature is coming soon!</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    </div>
  );
};

export default AdjustStock;
