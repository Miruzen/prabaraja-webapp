
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdjustStock = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Adjust Stock</h1>
      <p className="mb-8 text-muted-foreground">This feature is coming soon!</p>
      <Button onClick={() => navigate("/products")}>Back to Products</Button>
    </div>
  );
};

export default AdjustStock;
