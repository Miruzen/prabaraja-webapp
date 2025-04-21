import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomerInfoSection from "@/components/sales/CustomerInfoSection";
import SalesItemsSection from "@/components/sales/SalesItemsSection";
import { getLatestInvoiceNumber, formatPriceWithSeparator, findContactIdByName } from "@/utils/salesUtils";
import { salesData } from "@/data/salesData";

interface SalesItemType {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const CreateNewSales = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [items, setItems] = useState<SalesItemType[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Get the latest invoice number when component mounts
    const lastInvoiceNumber = getLatestInvoiceNumber();
    const numericPart = parseInt(lastInvoiceNumber);
    const nextInvoiceNumber = (numericPart + 1).toString();
    setInvoiceNumber(nextInvoiceNumber);
  }, []);

  useEffect(() => {
    const requiredFieldsFilled = 
      customerName !== "" && 
      invoiceNumber !== "" && 
      invoiceDate !== "" && 
      dueDate !== "";
    
    const itemsValid = items.length > 0 && 
      items.every(item => item.name !== "" && item.quantity > 0);
    
    setIsFormValid(requiredFieldsFilled && itemsValid);
  }, [customerName, invoiceNumber, invoiceDate, dueDate, items]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const formatPrice = (price: number) => {
    return formatPriceWithSeparator(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Format the invoice date properly for consistency
    let formattedInvoiceDate;
    if (invoiceDate) {
      const date = new Date(invoiceDate);
      formattedInvoiceDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } else {
      // Fallback to today if no date provided
      const today = new Date();
      formattedInvoiceDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    }
    
    // Format due date properly
    let formattedDueDate;
    if (dueDate) {
      const date = new Date(dueDate);
      formattedDueDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } else {
      formattedDueDate = formattedInvoiceDate; // Default to invoice date if not provided
    }
    
    // Find or create contact ID for the customer
    const customerId = findContactIdByName(customerName);
    
    // Create the new invoice with properly formatted data
    const newInvoice = {
      id: invoiceNumber,
      date: formattedInvoiceDate,
      number: `Sales Invoice #${invoiceNumber}`,
      customer: customerName,
      customerId: customerId, // Add the customerId
      dueDate: formattedDueDate,
      status: status.charAt(0).toUpperCase() + status.slice(1),
      total: `Rp ${formatPrice(calculateTotal())}`
    };

    // Add the new invoice to the beginning of the salesData array
    salesData.unshift(newInvoice);

    console.log("Added new invoice:", newInvoice);
    console.log("Updated salesData length:", salesData.length);

    toast.success("Sales invoice created successfully!");
    navigate("/sales");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Create New Sales</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <CustomerInfoSection 
                customerName={customerName}
                setCustomerName={setCustomerName}
                invoiceNumber={invoiceNumber}
                setInvoiceNumber={setInvoiceNumber}
                invoiceDate={invoiceDate}
                setInvoiceDate={setInvoiceDate}
                dueDate={dueDate}
                setDueDate={setDueDate}
                status={status}
                setStatus={setStatus}
              />

              <SalesItemsSection 
                items={items}
                setItems={setItems}
                calculateTotal={calculateTotal}
                formatPrice={formatPrice}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/sales')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 text-white"
                  disabled={!isFormValid}
                >
                  Create Invoice
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewSales;
