
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { PurchaseFormFields } from "./purchases/dialog/PurchaseFormFields";
import { PurchaseDialogHeader } from "./purchases/dialog/PurchaseDialogHeader";
import { PurchaseDialogFooter } from "./purchases/dialog/PurchaseDialogFooter";
import { generateDefaultPurchaseNumber, getInitialFormData } from "@/utils/purchaseDialogUtils";

interface AddPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    date: string;
    number: string;
    approver: string;
    dueDate: string;
    status: "pending" | "completed" | "cancelled";
    itemCount: number;
    priority: "High" | "Medium" | "Low";
    tags: string[];
    type: "invoice" | "shipment" | "order" | "offer" | "request";
  }) => void;
  defaultType?: "invoice" | "shipment" | "order" | "offer" | "request";
}

export function AddPurchaseDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  defaultType = "invoice" 
}: AddPurchaseDialogProps) {
  const [formData, setFormData] = useState(getInitialFormData(defaultType));

  // Update form data when defaultType changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: defaultType,
      number: generateDefaultPurchaseNumber(defaultType)
    }));
  }, [defaultType, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: formData.status as "pending" | "completed" | "cancelled",
      priority: formData.priority as "High" | "Medium" | "Low",
      type: formData.type as "invoice" | "shipment" | "order" | "offer" | "request"
    });
    onOpenChange(false);
    
    // Reset form
    setFormData(getInitialFormData(defaultType));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <PurchaseDialogHeader type={formData.type} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <PurchaseFormFields
            formData={formData}
            setFormData={setFormData}
            generateDefaultNumber={generateDefaultPurchaseNumber}
          />
          <PurchaseDialogFooter type={formData.type} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
