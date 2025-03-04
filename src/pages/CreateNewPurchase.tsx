
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import the components
import { PurchaseInformationForm } from "@/components/purchases/PurchaseInformationForm";
import { PurchaseItemsForm } from "@/components/purchases/PurchaseItemsForm";
import { PurchaseFormHeader } from "@/components/purchases/PurchaseFormHeader";
import { Purchase, PurchaseItem, PurchaseType, PurchaseStatus, PurchasePriority, PURCHASES_STORAGE_KEY } from "@/types/purchase";

const CreateNewPurchase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type") as PurchaseType || "invoice";

  const [purchaseType, setPurchaseType] = useState<PurchaseType>(typeFromUrl);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [number, setNumber] = useState("");
  const [approver, setApprover] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<PurchaseStatus>("pending");
  const [priority, setPriority] = useState<PurchasePriority>("Medium");
  const [tags, setTags] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form
  useEffect(() => {
    const requiredFieldsFilled = 
      date !== "" && 
      number !== "" && 
      approver !== "";
    
    const itemsValid = items.length > 0 && 
      items.every(item => item.name !== "" && item.quantity > 0);
    
    setIsFormValid(requiredFieldsFilled && itemsValid);
  }, [date, number, approver, items]);

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

    // Create new purchase object
    const newPurchase: Purchase = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(date),
      number,
      approver,
      dueDate: dueDate ? new Date(dueDate) : null,
      status,
      itemCount: items.length,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
      type: purchaseType,
      items,
    };

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
          dueDate: purchase.dueDate ? new Date(purchase.dueDate) : null
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PurchaseFormHeader purchaseType={purchaseType} />

        <div className="p-6 max-w-5xl mx-auto">
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
                priority={priority}
                setPriority={setPriority}
                tags={tags}
                setTags={setTags}
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
        </div>
      </div>
    </div>
  );
};

export default CreateNewPurchase;
