
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { usePurchaseById } from "@/hooks/usePurchases";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceSummary } from "@/components/invoice/InvoiceSummary";
import { VendorInformation } from "@/components/invoice/VendorInformation";
import { InvoiceItems } from "@/components/invoice/InvoiceItems";
import { PaymentInformation } from "@/components/invoice/PaymentInformation";
import { AdditionalInformation } from "@/components/invoice/AdditionalInformation";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Try to get the type from URL or default to invoice
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") || "invoice";
  
  const { data: purchase, isLoading, error } = usePurchaseById(id || "", type);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-md shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Purchase Not Found</h2>
            <p className="text-gray-500">The purchase you're looking for doesn't exist or may have been deleted.</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to safely get property with fallback
  const getPurchaseProperty = (property: string, fallback: any = '') => {
    return (purchase as any)[property] ?? fallback;
  };

  // Transform the purchase data to match the expected format
  const transformedPurchase = {
    id: purchase.id,
    number: `${type.toUpperCase().substring(0, 3)}-${getPurchaseProperty('number', '0000')}`,
    date: new Date(getPurchaseProperty('date', new Date())),
    dueDate: getPurchaseProperty('due_date') ? new Date(getPurchaseProperty('due_date')) : null,
    status: getPurchaseProperty('status', 'pending'),
    approver: getPurchaseProperty('approver') || getPurchaseProperty('requested_by', ''),
    priority: getPurchaseProperty('urgency', 'Medium'),
    tags: getPurchaseProperty('tags', []),
    items: getPurchaseProperty('items', [])
  };

  const isPaid = transformedPurchase.status === "completed";
  const isOverdue = transformedPurchase.status === "pending" && transformedPurchase.dueDate && new Date() > transformedPurchase.dueDate;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <InvoiceHeader number={transformedPurchase.number} date={transformedPurchase.date} />

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <InvoiceSummary 
              number={transformedPurchase.number}
              date={transformedPurchase.date}
              dueDate={transformedPurchase.dueDate}
              status={transformedPurchase.status}
              isOverdue={isOverdue}
              isPaid={isPaid}
            />

            <VendorInformation />

            <InvoiceItems 
              items={transformedPurchase.items}
              isPaid={isPaid}
            />

            <PaymentInformation 
              isPaid={isPaid}
              isOverdue={isOverdue}
              date={transformedPurchase.date}
            />

            <AdditionalInformation 
              approver={transformedPurchase.approver}
              priority={transformedPurchase.priority}
              tags={transformedPurchase.tags}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
