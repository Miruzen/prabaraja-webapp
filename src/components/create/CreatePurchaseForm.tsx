
import { useState } from "react";
import { PurchaseType } from "@/types/purchase";
import { PurchaseInformationForm } from "@/components/purchases/PurchaseInformationForm";
import { PurchaseItemsForm } from "@/components/purchases/PurchaseItemsForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreatePurchaseFormProps {
  purchaseType: PurchaseType;
  setPurchaseType: (type: PurchaseType) => void;
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

export function CreatePurchaseForm({ 
  purchaseType, 
  setPurchaseType, 
  onSubmit,
  isLoading = false 
}: CreatePurchaseFormProps) {
  const [formData, setFormData] = useState({
    type: purchaseType,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "pending",
    approver: "",
    tags: [],
    items: [],
    taxCalculationMethod: false,
    ppnPercentage: 11,
    pphPercentage: 2,
    pphType: "",
    dpp: 0,
    ppn: 0,
    pph: 0,
    grandTotal: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PurchaseInformationForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        purchaseType={purchaseType}
        setPurchaseType={setPurchaseType}
      />
      
      <PurchaseItemsForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Purchase
        </Button>
      </div>
    </form>
  );
}
