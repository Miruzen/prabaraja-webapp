
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { warehouses, warehouseLocations } from "@/data/productData";

function generateNextWarehouseCode() {
  if (!warehouses.length) return "WH001";
  const lastWarehouse = warehouses[warehouses.length - 1];
  const codeNum = parseInt(lastWarehouse.code.replace("WH", "")) + 1;
  return `WH${codeNum.toString().padStart(3, "0")}`;
}

const AddWarehouse = () => {
  const navigate = useNavigate();
  const warehouseCode = useMemo(() => generateNextWarehouseCode(), []);
  const [name, setName] = useState("");
  const [location, setLocation] = useState(warehouseLocations[1] || "");
  const [totalStock, setTotalStock] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Warehouse added! (Demo only)");
    navigate("/products");
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col items-center py-10">
        <h2 className="text-2xl font-semibold mb-2">Add New Warehouse</h2>
        <p className="mb-8 text-muted-foreground">Fill out the form to add a warehouse.</p>
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold mb-1">Warehouse Code</label>
                <Input value={warehouseCode} readOnly />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <select
                  className="w-full border rounded-md py-2 px-3 text-sm mt-1"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                >
                  {warehouseLocations.filter(loc => loc !== "All").map(loc => (
                    <option value={loc} key={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Total Stock</label>
                <Input type="number" value={totalStock} min={0} onChange={e => setTotalStock(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => navigate("/products")}>
                  Cancel
                </Button>
                <Button type="submit">Add Warehouse</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddWarehouse;

