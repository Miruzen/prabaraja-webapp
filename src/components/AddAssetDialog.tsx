
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

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAssetDialog = ({ open, onOpenChange }: AddAssetDialogProps) => {
  const [assetDetail, setAssetDetail] = useState("");
  const [price, setPrice] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add asset handling logic here
    onOpenChange(false);
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
