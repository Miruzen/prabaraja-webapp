
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface Asset {
  detail: string;
  warrantyDeadline: string;
  price: number;
}

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (asset: Asset) => void;
}

export const AddAssetDialog = ({ open, onOpenChange, onSubmit }: AddAssetDialogProps) => {
  const [assetDetail, setAssetDetail] = useState("");
  const [price, setPrice] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assetDetail || !price || !warrantyDate) {
      toast.error("Please fill in all fields");
      return;
    }

    onSubmit({
      detail: assetDetail,
      warrantyDeadline: warrantyDate,
      price: Number(price),
    });

    toast.success("Asset added successfully");

    // Reset form
    setAssetDetail("");
    setPrice("");
    setWarrantyDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="assetDetail" className="text-sm font-medium">
              Asset Detail
            </label>
            <Input
              id="assetDetail"
              value={assetDetail}
              onChange={(e) => setAssetDetail(e.target.value)}
              placeholder="Enter asset details"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Purchase Price (Rp)
            </label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter purchase price"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="warrantyDate" className="text-sm font-medium">
              Warranty Deadline
            </label>
            <Input
              id="warrantyDate"
              type="date"
              value={warrantyDate}
              onChange={(e) => setWarrantyDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
