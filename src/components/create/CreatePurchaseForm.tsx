
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PurchaseInformationForm } from "@/components/purchases/PurchaseInformationForm";
import { PurchaseItemsForm } from "@/components/purchases/PurchaseItemsForm";
import { 
  Purchase, 
  PurchaseItem, 
  PurchaseType, 
  PurchaseStatus,
  PURCHASES_STORAGE_KEY,
  PurchasePriority,
  InvoicePurchase,
  ShipmentPurchase,
  OrderPurchase,
  OfferPurchase,
  RequestPurchase
} from "@/types/purchase";

interface CreatePurchaseFormProps {
  purchaseType: PurchaseType;
  setPurchaseType: (type: PurchaseType) => void;
}

export function CreatePurchaseForm({ purchaseType, setPurchaseType }: CreatePurchaseFormProps) {
  const navigate = useNavigate();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [number, setNumber] = useState("");
  const [approver, setApprover] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<PurchaseStatus>("pending");
  const [tags, setTags] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  const [amount, setAmount] = useState(0);

  // Type-specific fields
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [shippingDate, setShippingDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [discountTerms, setDiscountTerms] = useState("");
  const [expiryDate, setExpiryDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  );
  const [requestedBy, setRequestedBy] = useState("");
  const [urgency, setUrgency] = useState<PurchasePriority>("Medium");
  
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form
  useEffect(() => {
    // For invoices, approver is required
    const approverValid = purchaseType === "invoice" ? approver !== "" : true;
    
    const requiredFieldsFilled = 
      date !== "" && 
      number !== "" && 
      approverValid;
    
    const itemsValid = items.length > 0 && 
      items.every(item => item.name !== "" && item.quantity > 0);
    
    let typeSpecificFieldsValid = true;
    
    if (purchaseType === "shipment") {
      typeSpecificFieldsValid = trackingNumber !== "" && carrier !== "" && shippingDate !== "";
    } else if (purchaseType === "order") {
      typeSpecificFieldsValid = orderDate !== "";
    } else if (purchaseType === "offer") {
      typeSpecificFieldsValid = discountTerms !== "" && expiryDate !== "";
    } else if (purchaseType === "request") {
      typeSpecificFieldsValid = requestedBy !== "";
    }
    
    setIsFormValid(requiredFieldsFilled && itemsValid && typeSpecificFieldsValid);
  }, [
    date, number, approver, items, purchaseType, 
    trackingNumber, carrier, shippingDate, 
    orderDate, discountTerms, expiryDate, requestedBy
  ]);

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setAmount(total);
  }, [items]);

  const getTypeTitle = () => {
    switch (purchaseType) {
      case "invoice": return "Invoice";
      case "shipment": return "Shipment";
      case "order": return "Order";
      case "offer": return "Offer";
      case "request": return "Request";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create purchase object based on type
    let newPurchase: Purchase;
    
    // Base common fields
    const baseFields = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(date),
      number,
      status,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
      items,
      amount,
      itemCount: items.length,
    };

    // Create specific purchase type based on the form type
    switch (purchaseType) {
      case "invoice":
        newPurchase = {
          ...baseFields,
          type: "invoice",
          approver,
          dueDate: dueDate ? new Date(dueDate) : new Date(),
        } as InvoicePurchase;
        break;
        
      case "shipment":
        newPurchase = {
          ...baseFields,
          type: "shipment",
          approver: "", // Empty approver for non-invoice types
          trackingNumber,
          carrier,
          shippingDate: new Date(shippingDate),
        } as ShipmentPurchase;
        break;
        
      case "order":
        newPurchase = {
          ...baseFields,
          type: "order",
          approver: "", // Empty approver for non-invoice types
          orderDate: new Date(orderDate),
        } as OrderPurchase;
        break;
        
      case "offer":
        newPurchase = {
          ...baseFields,
          type: "offer",
          approver: "", // Empty approver for non-invoice types
          discountTerms,
          expiryDate: new Date(expiryDate),
        } as OfferPurchase;
        break;
        
      case "request":
        newPurchase = {
          ...baseFields,
          type: "request",
          approver: "", // Empty approver for non-invoice types
          requestedBy,
          urgency,
        } as RequestPurchase;
        break;
        
      default:
        toast.error("Invalid purchase type");
        return;
    }

    // Get existing purchases from localStorage
    const existingPurchasesString = localStorage.getItem(PURCHASES_STORAGE_KEY);
    let existingPurchases: Purchase[] = [];
    
    if (existingPurchasesString) {
      try {
        const parsedPurchases = JSON.parse(existingPurchasesString);
        existingPurchases = parsedPurchases.map((purchase: any) => ({
          ...purchase,
          date: new Date(purchase.date),
          dueDate: purchase.dueDate ? new Date(purchase.dueDate) : null,
          shippingDate: purchase.shippingDate ? new Date(purchase.shippingDate) : null,
          orderDate: purchase.orderDate ? new Date(purchase.orderDate) : null,
          expiryDate: purchase.expiryDate ? new Date(purchase.expiryDate) : null
        }));
      } catch (error) {
        console.error("Error parsing purchases from localStorage:", error);
      }
    }

    // Add new purchase to the beginning of the array
    const updatedPurchases = [newPurchase, ...existingPurchases];
    
    // Store in localStorage
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedPurchases));

    toast.success(`${getTypeTitle()} created successfully!`);
    navigate("/purchases");
  };

  // Helper function for the urgency setter that maintains type safety
  const handleUrgencyChange = (value: string) => {
    if (value === "High" || value === "Medium" || value === "Low") {
      setUrgency(value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Purchase Information */}
        <PurchaseInformationForm 
          purchaseType={purchaseType}
          setPurchaseType={setPurchaseType}
          date={date}
          setDate={setDate}
          number={number}
          setNumber={setNumber}
          approver={approver}
          setApprover={setApprover}
          dueDate={dueDate}
          setDueDate={setDueDate}
          status={status}
          setStatus={setStatus}
          tags={tags}
          setTags={setTags}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
          carrier={carrier}
          setCarrier={setCarrier}
          shippingDate={shippingDate}
          setShippingDate={setShippingDate}
          orderDate={orderDate}
          setOrderDate={setOrderDate}
          discountTerms={discountTerms}
          setDiscountTerms={setDiscountTerms}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
          requestedBy={requestedBy}
          setRequestedBy={setRequestedBy}
          urgency={urgency}
          setUrgency={handleUrgencyChange}
        />

        {/* Items Section */}
        <PurchaseItemsForm 
          items={items}
          setItems={setItems}
          purchaseType={purchaseType}
        />

        <div className="flex justify-end space-x-4">
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate('/purchases')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-indigo-600 text-white"
            disabled={!isFormValid}
          >
            Create {getTypeTitle()}
          </Button>
        </div>
      </div>
    </form>
  );
}
