
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { PurchaseFormHeader } from "@/components/purchases/PurchaseFormHeader";
import { CreatePurchaseForm } from "@/components/create/CreatePurchaseForm";
import { PurchaseType } from "@/types/purchase";
import { useCreateInvoice } from "@/hooks/usePurchases";

const CreateNewPurchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type") as PurchaseType || "invoice";
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(typeFromUrl);
  
  const createInvoiceMutation = useCreateInvoice();

  const handleSubmit = async (formData: any) => {
    try {
      const invoiceData = {
        number: Date.now(), // Generate a unique number
        type: formData.type || purchaseType,
        date: formData.date,
        due_date: formData.dueDate,
        status: formData.status || "pending",
        approver: formData.approver,
        tags: formData.tags || [],
        items: formData.items || [],
        tax_calculation_method: formData.taxCalculationMethod || false,
        ppn_percentage: formData.ppnPercentage,
        pph_percentage: formData.pphPercentage,
        pph_type: formData.pphType,
        dpp: formData.dpp,
        ppn: formData.ppn,
        pph: formData.pph,
        grand_total: formData.grandTotal || 0
      };

      await createInvoiceMutation.mutateAsync(invoiceData);
      toast.success("Purchase created successfully");
      navigate("/purchases");
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast.error("Failed to create purchase");
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseFormHeader purchaseType={purchaseType} />

        <div className="p-6 max-w-5xl mx-auto">
          <CreatePurchaseForm 
            purchaseType={purchaseType}
            setPurchaseType={setPurchaseType}
            onSubmit={handleSubmit}
            isLoading={createInvoiceMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNewPurchase;
