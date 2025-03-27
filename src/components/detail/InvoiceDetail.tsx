
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { Purchase, PURCHASES_STORAGE_KEY } from "@/types/purchase";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceSummary } from "@/components/invoice/InvoiceSummary";
import { VendorInformation } from "@/components/invoice/VendorInformation";
import { InvoiceItems } from "@/components/invoice/InvoiceItems";
import { PaymentInformation } from "@/components/invoice/PaymentInformation";
import { AdditionalInformation } from "@/components/invoice/AdditionalInformation";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = () => {  
      try {
        const storedPurchases = localStorage.getItem(PURCHASES_STORAGE_KEY);
        if (storedPurchases) {
          const parsedPurchases = JSON.parse(storedPurchases);
          const foundInvoice = parsedPurchases.find((p: any) => p.id === id && p.type === "invoice");
          
          if (foundInvoice) {
            // Convert date strings to Date objects
            foundInvoice.date = new Date(foundInvoice.date);
            foundInvoice.dueDate = foundInvoice.dueDate ? new Date(foundInvoice.dueDate) : null;
            setInvoice(foundInvoice);
          }
        }
      } catch (error) {
        console.error("Error loading invoice data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!invoice) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-md shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
            <p className="text-gray-500">The invoice you're looking for doesn't exist or may have been deleted.</p>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "completed";
  const isOverdue = invoice.status === "pending" && invoice.dueDate && new Date() > invoice.dueDate;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <InvoiceHeader number={invoice.number} date={invoice.date} />

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <InvoiceSummary 
              number={invoice.number}
              date={invoice.date}
              dueDate={invoice.dueDate}
              status={invoice.status}
              isOverdue={isOverdue}
              isPaid={isPaid}
            />

            <VendorInformation />

            <InvoiceItems 
              items={invoice.items || []}
              isPaid={isPaid}
            />

            <PaymentInformation 
              isPaid={isPaid}
              isOverdue={isOverdue}
              date={invoice.date}
            />

            <AdditionalInformation 
              approver={invoice.approver}
              priority={invoice.priority}
              tags={invoice.tags}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
