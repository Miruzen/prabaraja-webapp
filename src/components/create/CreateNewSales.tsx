import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Truck, User, Calendar, CreditCard, Package, Tag, MapPin, FileText, Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import CustomerInfoSection from "@/components/sales/CustomerInfoSection";
import SalesItemsSection from "@/components/sales/SalesItemsSection";
import { getLatestInvoiceNumber, formatPriceWithSeparator, findContactIdByName } from "@/utils/salesUtils";
import { salesData } from "@/data/salesData";
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

// Status data with colors and icons
const statusOptions = {
  pending_payment: { 
    label: "Pending Payment", 
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    color: "bg-amber-100 text-amber-800 border-amber-200" 
  },
  in_progress: { 
    label: "In Progress", 
    icon: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
    color: "bg-blue-100 text-blue-800 border-blue-200" 
  },
  shipped: { 
    label: "Shipped", 
    icon: <Truck className="h-4 w-4 text-purple-500" />,
    color: "bg-purple-100 text-purple-800 border-purple-200" 
  },
  delivered: { 
    label: "Delivered", 
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    color: "bg-green-100 text-green-800 border-green-200" 
  },
  cancelled: { 
    label: "Cancelled", 
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    color: "bg-red-100 text-red-800 border-red-200" 
  }
};

// Shipping method data with icons
const shippingMethods = [
  { value: "standard_courier", label: "Standard Courier", icon: <Truck className="h-4 w-4 text-blue-500" /> },
  { value: "express_courier", label: "Express Courier", icon: <Truck className="h-4 w-4 text-purple-600" /> },
  { value: "in_store_pickup", label: "In-store Pickup", icon: <MapPin className="h-4 w-4 text-green-500" /> },
  { value: "self_delivery", label: "Self-Delivery", icon: <Package className="h-4 w-4 text-amber-500" /> }
];

// Payment method data with icons
const paymentMethods = [
  { value: "credit_card", label: "Credit Card", icon: <CreditCard className="h-4 w-4 text-blue-500" /> },
  { value: "bank_transfer", label: "Bank Transfer", icon: <FileText className="h-4 w-4 text-green-500" /> },
  { value: "cash_on_delivery", label: "Cash on Delivery", icon: <Package className="h-4 w-4 text-amber-500" /> },
  { value: "digital_wallet", label: "Digital Wallet", icon: <User className="h-4 w-4 text-purple-500" /> }
];

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

  // Get the current status object from options
  const getCurrentStatusObject = () => {
    return statusOptions[status] || statusOptions.pending_payment;
  };

  // Render additional fields based on the document type
  const renderTypeSpecificFields = () => {
    switch(type) {
      case "order":
        return (
          <div className="space-y-4 bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-medium">Shipping Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="trackingNumber" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-500" />
                  Tracking Number (Optional)
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  className="w-full p-2 border rounded-md"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number if available"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  Order Status
                </label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getCurrentStatusObject().icon}
                        <span>{getCurrentStatusObject().label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusOptions).map(([value, { label, icon }]) => (
                      <SelectItem 
                        key={value} 
                        value={value}
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2">
                          {icon}
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="shippingMethod" className="text-sm font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4 text-indigo-500" />
                  Shipping Method
                </label>
                <Select
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select shipping method">
                      {shippingMethod && (
                        <div className="flex items-center gap-2">
                          {shippingMethods.find(m => m.value === shippingMethod)?.icon}
                          <span>{shippingMethods.find(m => m.value === shippingMethod)?.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {shippingMethods.map(({ value, label, icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          {icon}
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-indigo-500" />
                  Payment Method
                </label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method">
                      {paymentMethod && (
                        <div className="flex items-center gap-2">
                          {paymentMethods.find(m => m.value === paymentMethod)?.icon}
                          <span>{paymentMethods.find(m => m.value === paymentMethod)?.label}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(({ value, label, icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          {icon}
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case "quotation":
        return (
          <div className="space-y-4 bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium">Quotation Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="validUntil" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Valid Until
                </label>
                <input
                  type="date"
                  id="validUntil"
                  className="w-full p-2 border rounded-md"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="termsAndConditions" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Terms and Conditions
                </label>
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
        {type === "delivery" ? (
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
        ) : type === "order" ? (
          <div className="bg-gradient-to-b from-[#9333EA] to-[#D946EF] p-6">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => navigate("/sales")}
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <Truck size={24} className="text-white" />
                  {getPageTitle()}
                </h1>
                <p className="text-white/80 text-sm">Create and track orders for customers</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-[#60A5FA] to-[#34D399] p-6">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => navigate("/sales")}
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <FileText size={24} className="text-white" />
                  {getPageTitle()}
                </h1>
                <p className="text-white/80 text-sm">Create price quotes for potential customers</p>
              </div>
            </div>
          </div>
        )}

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

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-medium">Order Items</h2>
                </div>
                <SalesItemsSection 
                  items={items}
                  setItems={setItems}
                  calculateTotal={calculateTotal}
                  formatPrice={formatPrice}
                  allowProductSearch={type === "order"}
                  availableProducts={productCatalog}
                />
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-medium">Order Summary</h2>
                  </div>
                  <Badge className={getCurrentStatusObject().color}>
                    <div className="flex items-center gap-1">
                      {getCurrentStatusObject().icon}
                      <span>{getCurrentStatusObject().label}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="flex justify-end mt-4 space-x-4">
                  <h3 className="text-lg font-medium">Total: Rp {formatPrice(calculateTotal())}</h3>
                </div>
              </div>

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
                  className={type === "order" ? "bg-purple-600 text-white hover:bg-purple-700" : 
                           type === "quotation" ? "bg-blue-600 text-white hover:bg-blue-700" : 
                           "bg-indigo-600 text-white hover:bg-indigo-700"}
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
