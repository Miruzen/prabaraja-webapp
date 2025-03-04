
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { getPurchaseTypeLabel } from "@/utils/purchaseDialogUtils";

interface PurchaseDialogFooterProps {
  type: "invoice" | "shipment" | "order" | "offer" | "request";
}

export function PurchaseDialogFooter({ type }: PurchaseDialogFooterProps) {
  return (
    <DialogFooter>
      <Button type="submit">Add {getPurchaseTypeLabel(type)}</Button>
    </DialogFooter>
  );
}
