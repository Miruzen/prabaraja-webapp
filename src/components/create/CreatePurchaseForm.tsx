import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import the components
import { PurchaseInformationForm } from "@/components/purchases/PurchaseInformationForm";
import { PurchaseItemsForm } from "@/components/purchases/PurchaseItemsForm";
import { Purchase, PurchaseItem, PurchaseType, PurchaseStatus, PURCHASES_STORAGE_KEY } from "@/types/purchase";

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
  const [amount, setAmount] = useState(0); // Add amount state

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
  const [urgency, setUrgency] = useState("Medium");
  
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form
  useEffect(() => {
    const requiredFieldsFilled = 
      date !== "" && 
      number !== "" && 
      approver !== "";
    
    const itemsValid = items.length > 0 && 
      items.every(item => item.name !== "" && item.quantity > 0);
    
    // Additional validation for type-specific required fields
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

    // Base purchase object with common fields
    const basePurchase = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(date),
      number,
      approver,
      dueDate: dueDate ? new Date(dueDate) : null,
      status,
      itemCount: items.length,
      amount, // Add amount field
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
      type: purchaseType,
      items,
    };

    // Add type-specific fields
    let newPurchase: Purchase = { ...basePurchase };
    
    if (purchaseType === "shipment") {
      newPurchase = {
        ...basePurchase,
        trackingNumber,
        carrier,
        shippingDate: new Date(shippingDate),
      };
    } else if (purchaseType === "order") {
      newPurchase = {
        ...basePurchase,
        orderDate: new Date(orderDate),
      };
    } else if (purchaseType === "offer") {
      newPurchase = {
        ...basePurchase,
        discountTerms,  
        expiryDate: new Date(expiryDate),
      };
    } else if (purchaseType === "request") {
      newPurchase = {
        ...basePurchase,
        requestedBy,
        urgency,
      };
    }

    // Get existing purchases from localStorage
    const existingPurchasesString = localStorage.getItem(PURCHASES_STORAGE_KEY);
    let existingPurchases: Purchase[] = [];
    
    if (existingPurchasesString) {
      try {
        // Parse the JSON string and ensure dates are properly converted back to Date objects
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
          // Type-specific fields
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
          setUrgency={setUrgency}
        />

        {/* Items Section */}
        <PurchaseItemsForm 
          items={items}
          setItems={setItems}
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