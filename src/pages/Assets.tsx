
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Sidebar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetsTable } from "@/components/AssetsTable";
import { SoldAssetsTable } from "@/components/SoldAssetsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAssetDialog } from "@/components/AddAssetDialog";

const Assets = () => {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar>
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
            <div className="flex justify-end">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2" />
                Add Assets
              </Button>
            </div>
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
                  <SelectItem value="5">5 items per page</SelectItem>
                  <SelectItem value="10">10 items per page</SelectItem>
                  <SelectItem value="15">15 items per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tables */}
          <Tabs defaultValue="current" className="w-full">
            <TabsList>
              <TabsTrigger value="current">Current Assets</TabsTrigger>
              <TabsTrigger value="sold">Sold Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              <AssetsTable itemsPerPage={Number(itemsPerPage)} search={search} />
            </TabsContent>
            <TabsContent value="sold">
              <SoldAssetsTable itemsPerPage={Number(itemsPerPage)} search={search} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </Sidebar>
      <AddAssetDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Assets;
