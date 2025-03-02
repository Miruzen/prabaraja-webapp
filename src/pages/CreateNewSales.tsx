
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomerInfoSection from "@/components/sales/CustomerInfoSection";
import SalesItemsSection from "@/components/sales/SalesItemsSection";
import { getLatestInvoiceNumber, formatPriceWithSeparator } from "@/utils/salesUtils";
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

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const newInvoice = {
      id: invoiceNumber,
      date: formattedDate,
      number: `Sales Invoice #${invoiceNumber}`,
      customer: customerName,
      dueDate: new Date(dueDate).toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '/'),
      status: status.charAt(0).toUpperCase() + status.slice(1),
      total: `Rp ${formatPrice(calculateTotal())}`
    };

    // Add the new invoice to the beginning of the salesData array
    salesData.unshift(newInvoice);

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
