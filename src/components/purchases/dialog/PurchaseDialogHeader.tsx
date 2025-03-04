
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPurchaseTypeLabel } from "@/utils/purchaseDialogUtils";

interface PurchaseDialogHeaderProps {
  type: "invoice" | "shipment" | "order" | "offer" | "request";
}

export function PurchaseDialogHeader({ type }: PurchaseDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>Add New {getPurchaseTypeLabel(type)}</DialogTitle>
    </DialogHeader>
  );
}
