
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import CustomerInfoSection from "@/components/sales/CustomerInfoSection";
import SalesItemsSection from "@/components/sales/SalesItemsSection";
import { getLatestInvoiceNumber, formatPriceWithSeparator, findContactIdByName } from "@/utils/salesUtils";
import { salesData } from "@/data/salesData";
import { v4 as uuidv4 } from 'uuid';

interface SalesItemType {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
}

// Mock data for product catalog
const productCatalog = [
  { id: "prod-1", name: "Laptop Dell XPS 13", price: 15000000 },
  { id: "prod-2", name: "iPhone 15 Pro", price: 18000000 },
  { id: "prod-3", name: "Samsung Galaxy S24", price: 12000000 },
  { id: "prod-4", name: "Mechanical Keyboard", price: 1500000 },
  { id: "prod-5", name: "Wireless Mouse", price: 500000 },
  { id: "prod-6", name: "27-inch Monitor", price: 3500000 },
  { id: "prod-7", name: "Wireless Earbuds", price: 2000000 },
  { id: "prod-8", name: "USB-C Hub", price: 750000 }
];

interface LocationState {
  type: "delivery" | "order" | "quotation";
}

const CreateNewSales = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type = "delivery" } = (location.state as LocationState) || {};
  
  const [customerName, setCustomerName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(type === "order" ? "pending_payment" : "unpaid");
  const [items, setItems] = useState<SalesItemType[]>([
    { id: '1', name: '', quantity: 1, price: 0, discount: 0 }
  ]);
  
  // For Order & Delivery specific fields
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  
  // For Quotation specific fields
  const [validUntil, setValidUntil] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  
  const [isFormValid, setIsFormValid] = useState(false);

  // Get page title based on type
  const getPageTitle = () => {
    switch(type) {
      case "delivery":
        return "Create Sales Invoice";
      case "order":
        return "Create Order & Delivery";
      case "quotation":
        return "Create Quotation";
      default:
        return "Create New Sales";
    }
  };

  useEffect(() => {
    // Generate a unique order number when creating a new Order & Delivery
    if (type === "order") {
      const orderPrefix = "ORD";
      const timestamp = new Date().getTime().toString().slice(-6);
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const generatedOrderNum = `${orderPrefix}-${timestamp}-${randomNum}`;
      setInvoiceNumber(generatedOrderNum);
    } else {
      // Get the latest invoice/order/quote number when component mounts
      const lastInvoiceNumber = getLatestInvoiceNumber();
      const numericPart = parseInt(lastInvoiceNumber || "0");
      const nextInvoiceNumber = (numericPart + 1).toString();
      setInvoiceNumber(nextInvoiceNumber);
    }
    
    // Set current date as default for invoice date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setInvoiceDate(formattedDate);
    
    // Set default due date 14 days from now
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);
    setDueDate(dueDate.toISOString().split('T')[0]);
    
    // For quotation, set valid until date 30 days from now
    if (type === "quotation") {
      const validUntilDate = new Date();
      validUntilDate.setDate(today.getDate() + 30);
      setValidUntil(validUntilDate.toISOString().split('T')[0]);
    }
    
    // For order, set delivery date 7 days from now
    if (type === "order") {
      const deliveryDate = new Date();
      deliveryDate.setDate(today.getDate() + 7);
      setDueDate(deliveryDate.toISOString().split('T')[0]);
      setStatus("pending_payment");
    }
  }, [type]);

  useEffect(() => {
    // Validate form based on type
    const validateForm = () => {
      const commonFieldsValid = 
        customerName !== "" && 
        invoiceNumber !== "" && 
        invoiceDate !== "";
        
      const itemsValid = items.length > 0 && 
        items.every(item => item.name !== "" && item.quantity > 0 && item.price > 0);
      
      switch(type) {
        case "delivery":
          return commonFieldsValid && dueDate !== "" && itemsValid;
          
        case "order":
          return commonFieldsValid && 
            dueDate !== "" && 
            customerAddress !== "" && 
            customerPhone !== "" &&
            customerEmail !== "" &&
            shippingMethod !== "" &&
            paymentMethod !== "" &&
            itemsValid;
            
        case "quotation":
          return commonFieldsValid && validUntil !== "" && itemsValid;
          
        default:
          return false;
      }
    };
    
    setIsFormValid(validateForm());
  }, [customerName, invoiceNumber, invoiceDate, dueDate, items, type, customerAddress, customerPhone, customerEmail, shippingMethod, paymentMethod, validUntil]);

  // Calculate total with consideration for discounts
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemSubtotal = item.quantity * item.price;
      if (item.discount && item.discount > 0) {
        return total + (itemSubtotal - (itemSubtotal * (item.discount / 100)));
      }
      return total + itemSubtotal;
    }, 0);
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
    
    // Create the appropriate document based on type
    let documentTitle;
    let documentStatus;
    
    switch(type) {
      case "delivery":
        documentTitle = `Sales Invoice #${invoiceNumber}`;
        documentStatus = status.charAt(0).toUpperCase() + status.slice(1);
        break;
      case "order":
        documentTitle = `Order #${invoiceNumber}`;
        documentStatus = status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
        break;
      case "quotation":
        documentTitle = `Quotation #${invoiceNumber}`;
        documentStatus = "Sent";
        break;
      default:
        documentTitle = `Sales Document #${invoiceNumber}`;
        documentStatus = "Created";
    }
    
    // Create the new document with properly formatted data
    const newDocument = {
      id: invoiceNumber,
      date: formattedInvoiceDate,
      number: documentTitle,
      customer: customerName,
      customerId: customerId,
      dueDate: formattedDueDate,
      status: documentStatus,
      total: `Rp ${formatPrice(calculateTotal())}`
    };

    // Add additional data based on type
    if (type === "order") {
      Object.assign(newDocument, {
        customerPhone,
        customerEmail,
        customerAddress,
        shippingMethod,
        paymentMethod,
        trackingNumber,
        notes
      });
    } else if (type === "quotation") {
      Object.assign(newDocument, {
        validUntil,
        termsAndConditions
      });
    }

    // Add the new document to the beginning of the salesData array
    salesData.unshift(newDocument);

    console.log(`Added new ${type}:`, newDocument);
    console.log("Updated salesData length:", salesData.length);

    toast.success(`${getPageTitle()} created successfully!`);
    navigate("/sales");
  };

  // Render additional fields based on the document type
  const renderTypeSpecificFields = () => {
    switch(type) {
      case "order":
        return (
          <div className="space-y-4 bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-medium">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="trackingNumber" className="text-sm font-medium">Tracking Number (Optional)</label>
                <input
                  type="text"
                  id="trackingNumber"
                  className="w-full p-2 border rounded-md"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number if available"
                />
              </div>
            </div>
          </div>
        );
      case "quotation":
        return (
          <div className="space-y-4 bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-medium">Quotation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="validUntil" className="text-sm font-medium">Valid Until</label>
                <input
                  type="date"
                  id="validUntil"
                  className="w-full p-2 border rounded-md"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="termsAndConditions" className="text-sm font-medium">Terms and Conditions</label>
                <textarea
                  id="termsAndConditions"
                  className="w-full p-2 border rounded-md"
                  value={termsAndConditions}
                  onChange={(e) => setTermsAndConditions(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={() => navigate("/sales")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-semibold text-white">{getPageTitle()}</h1>
          </div>
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
                type={type}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerEmail={customerEmail}
                setCustomerEmail={setCustomerEmail}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                notes={notes}
                setNotes={setNotes}
              />

              {/* Render type-specific fields */}
              {renderTypeSpecificFields()}

              <SalesItemsSection 
                items={items}
                setItems={setItems}
                calculateTotal={calculateTotal}
                formatPrice={formatPrice}
                allowProductSearch={type === "order"}
                availableProducts={productCatalog}
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
                  Create {type === "delivery" ? "Invoice" : type === "order" ? "Order" : "Quotation"}
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
