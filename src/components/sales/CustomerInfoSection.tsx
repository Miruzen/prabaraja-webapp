
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ChevronDropdown from "@/components/ChevronDropdown";
import { Check, ChevronDown, Search } from "lucide-react";

interface CustomerInfoSectionProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  invoiceNumber: string;
  setInvoiceNumber: (number: string) => void;
  invoiceDate: string;
  setInvoiceDate: (date: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  status: string;
  setStatus: (status: string) => void;
  type?: "delivery" | "order" | "quotation";
}

// Mock data for customer search
const customerOptions = [
  "John Doe",
  "Jane Smith",
  "Acme Corp",
  "Tech Solutions",
  "Global Industries",
  "Local Shop",
];

const CustomerInfoSection = ({
  customerName,
  setCustomerName,
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
  status,
  setStatus,
  type = "delivery"
}: CustomerInfoSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerPopover, setShowCustomerPopover] = useState(false);
  
  // Filter customers based on search term
  const filteredCustomers = customerOptions.filter(customer =>
    customer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Status options based on document type
  const getStatusOptions = () => {
    switch(type) {
      case "delivery":
        return [
          { label: "Paid", value: "paid" },
          { label: "Unpaid", value: "unpaid" },
          { label: "Awaiting Payment", value: "awaiting" },
          { label: "Late Payment", value: "late" }
        ];
      case "order":
        return [
          { label: "Processing", value: "processing" },
          { label: "Shipped", value: "shipped" },
          { label: "Delivered", value: "delivered" },
          { label: "Cancelled", value: "cancelled" }
        ];
      case "quotation":
        return [
          { label: "Sent", value: "sent" },
          { label: "Accepted", value: "accepted" },
          { label: "Rejected", value: "rejected" },
          { label: "Expired", value: "expired" }
        ];
      default:
        return [
          { label: "Paid", value: "paid" },
          { label: "Unpaid", value: "unpaid" }
        ];
    }
  };
  
  const statusOptions = getStatusOptions();

  // Get the title based on document type
  const getDocumentTitle = () => {
    switch(type) {
      case "delivery": return "Sales Invoice";
      case "order": return "Order";
      case "quotation": return "Quotation";
      default: return "Document";
    }
  };
  
  // Get the second date field label based on document type
  const getSecondDateLabel = () => {
    switch(type) {
      case "delivery": return "Due Date";
      case "order": return "Delivery Date";
      case "quotation": return "Valid Until";
      default: return "Due Date";
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-medium mb-4">Customer Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer selection */}
        <div className="space-y-2">
          <label htmlFor="customer" className="text-sm font-medium">
            Customer
          </label>
          <Popover open={showCustomerPopover} onOpenChange={setShowCustomerPopover}>
            <PopoverTrigger asChild>
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  id="customer"
                  className="flex-1 p-2 outline-none"
                  placeholder="Select customer"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setSearchTerm(e.target.value);
                    if (!showCustomerPopover) setShowCustomerPopover(true);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 px-2"
                  onClick={() => setShowCustomerPopover(!showCustomerPopover)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-[300px]" align="start">
              <div className="space-y-1">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <Button
                      key={customer}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setCustomerName(customer);
                        setShowCustomerPopover(false);
                      }}
                    >
                      {customer === customerName && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {customer}
                    </Button>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500 py-2">
                    No customers found
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Document number */}
        <div className="space-y-2">
          <label htmlFor="invoiceNumber" className="text-sm font-medium">
            {getDocumentTitle()} Number
          </label>
          <input
            id="invoiceNumber"
            type="text"
            className="w-full p-2 border rounded-md"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        {/* Invoice date */}
        <div className="space-y-2">
          <label htmlFor="invoiceDate" className="text-sm font-medium">
            {getDocumentTitle()} Date
          </label>
          <input
            id="invoiceDate"
            type="date"
            className="w-full p-2 border rounded-md"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>

        {/* Due date / Delivery date / Valid until */}
        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            {getSecondDateLabel()}
          </label>
          <input
            id="dueDate"
            type="date"
            className="w-full p-2 border rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              className="w-full p-2 border rounded-md appearance-none bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoSection;
