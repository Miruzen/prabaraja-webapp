
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProducts, useCreateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

const unitOptions = ["Unit", "pcs", "box", "set", "pack"];

const AddProduct = () => {
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const createProductMutation = useCreateProduct();
  
  // Generate next product number based on existing products
  const nextProductNumber = products.length > 0 
    ? Math.max(...products.map(p => p.number)) + 1 
    : 1;
  
  const productCode = `PRD${nextProductNumber.toString().padStart(3, "0")}`;

  const [category, setCategory] = useState("Electronics");
  const [name, setName] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [unit, setUnit] = useState(unitOptions[0]);
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [status, setStatus] = useState("In Stock");

  // Get unique categories from existing products
  const existingCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const productCategories = existingCategories.length > 0 
    ? existingCategories 
    : ["Electronics", "Office", "Furniture"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !totalStock || !minStock || !buyPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        number: nextProductNumber,
        category,
        name,
        total_stock: parseInt(totalStock),
        min_stock: parseInt(minStock),
        unit,
        buy_price: parseFloat(buyPrice),
        sell_price: sellPrice ? parseFloat(sellPrice) : null,
        status,
      });

      toast.success("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

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
            <h2 className="text-2xl font-semibold text-white">Add New Product</h2>
            <p className="text-white/80">Fill out the form to add a product.</p>
          </div>
        </div>
        <div className="flex flex-col items-center py-10">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold mb-1">Product Code</label>
                  <Input value={productCode} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((cat) => (
                        <SelectItem value={cat} key={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Name *</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Total Stock *</label>
                    <Input type="number" value={totalStock} min={0} onChange={(e) => setTotalStock(e.target.value)} required />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Min Stock *</label>
                    <Input type="number" value={minStock} min={0} onChange={(e) => setMinStock(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Unit</label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map((opt) => (
                        <SelectItem value={opt} key={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Buy Price *</label>
                  <Input type="number" value={buyPrice} min={0} step="0.01" onChange={(e) => setBuyPrice(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Sell Price</label>
                  <Input type="number" value={sellPrice} min={0} step="0.01" onChange={(e) => setSellPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => navigate("/products")}
                    disabled={createProductMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProductMutation.isPending}
                  >
                    {createProductMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
