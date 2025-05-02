import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { AssetsTable } from "@/components/assets/AssetsTable";
import { toast } from "sonner";

interface Asset {
  id: string;
  tag: string;
  type: "computer" | "furniture" | "vehicle" | "other";
  name: string;
  model: string;
  assignedTo: {
    name: string;
    department: string;
    avatar?: string;
  };
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  warrantyDeadline: string;
}

const Assets = () => {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      tag: "AST-2023-001",
      type: "computer",
      name: "MacBook Pro",
      model: "M2 16GB",
      assignedTo: {
        name: "John Doe",
        department: "Engineering",
        avatar: "",
      },
      purchaseDate: "2023-05-15",
      purchasePrice: 25000000,
      currentValue: 20000000,
      warrantyDeadline: "2025-05-15",
    },
  ]);

  const handleAddAsset = (newAsset: Omit<Asset, "id" | "currentValue">) => {
    const currentValue = calculateCurrentValue(
      newAsset.purchasePrice, 
      newAsset.purchaseDate
    );
    
    const asset: Asset = {
      ...newAsset, 
      id: Math.random().toString(36).substr(2, 9),
      currentValue,
    };
    
    setAssets([...assets, asset]);
    setIsAddDialogOpen(false);
    toast.success("Asset added successfully");
  };

  const calculateCurrentValue = (price: number, purchaseDate: string) => {
    // Simplified straight-line depreciation (20% per year)
    const years = (new Date().getTime() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.max(0, price * (1 - 0.2 * years));
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    toast.success("Asset deleted successfully");
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-white">Assets</h1>
            <p className="text-white/80">Manage your company assets</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-4">
            {/* Actions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 items</SelectItem>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="15">15 items</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Asset
                </Button>
              </div>
            </div>

            {/* Table */}
            <Tabs defaultValue="current" className="w-full">
              <TabsList>
                <TabsTrigger value="current">Current Assets</TabsTrigger>
                <TabsTrigger value="sold">Sold Assets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                <AssetsTable 
                  itemsPerPage={Number(itemsPerPage)} 
                  search={search} 
                  assets={assets}
                  onDeleteAsset={handleDeleteAsset}
                />
              </TabsContent>

              <TabsContent value="sold">
                <div className="text-center py-8 text-muted-foreground">
                  No sold assets yet
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AddAssetDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onSubmit={handleAddAsset}
        existingAssets={assets}
      />
    </div>
  );
};

export default Assets;