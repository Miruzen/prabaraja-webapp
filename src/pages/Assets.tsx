
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
import { AssetsTable } from "@/components/assets/AssetsTable";
import { SoldAssetsTable } from "@/components/assets/SoldAssetsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { DeleteAssetDialog } from "@/components/assets/DeleteAssetDialog";
import { toast } from "sonner";

interface Asset {
  id: string;
  dateAdded: string;
  detail: string;
  warrantyDeadline: string;
  price: number;
  depreciation: number;
}

interface SoldAsset {
  id: string;
  dateSold: string;
  detail: string;
  transactionNo: string;
  boughtPrice: number;
  sellingPrice: number;
}

const Assets = () => {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [soldAssets, setSoldAssets] = useState<SoldAsset[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const handleAddAsset = (newAsset: Omit<Asset, "id" | "dateAdded" | "depreciation">) => {
    const asset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
      detail: newAsset.detail,
      warrantyDeadline: newAsset.warrantyDeadline,
      price: Number(newAsset.price),
      depreciation: Number(newAsset.price) * 0.2,
    };
    setAssets([...assets, asset]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteAsset = (id: string) => {
    setAssetToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (assetToDelete) {
      setAssets(assets.filter(asset => asset.id !== assetToDelete));
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
      toast.success("Asset deleted successfully");
    }
  };

  const handleDeleteSoldAsset = (id: string) => {
    toast.warning("Are you sure you want to delete this sold asset record?", {
      action: {
        label: "Delete",
        onClick: () => {
          setSoldAssets(soldAssets.filter(asset => asset.id !== id));
          toast.success("Sold asset record deleted successfully");
        },
      },
      cancel: {
        label: "No",
        onClick: () => {
          toast.info("Deletion cancelled");
        },
      },
    });
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
                <div className="flex justify-end">
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  Add Assets<Plus className="mr-2" />
                </Button>
              </div>
              </div>
            </div>

            {/* Tables */}
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
                <SoldAssetsTable 
                  itemsPerPage={Number(itemsPerPage)} 
                  search={search}
                  soldAssets={soldAssets}
                  onDeleteSoldAsset={handleDeleteSoldAsset}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <AddAssetDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onSubmit={handleAddAsset}
      />
      <DeleteAssetDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Assets;
