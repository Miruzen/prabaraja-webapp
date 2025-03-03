
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Truck, ShoppingCart, Tag, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const CreateNewPurchase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type") as "invoice" | "shipment" | "order" | "offer" | "request" || "invoice";

  const [purchaseType, setPurchaseType] = useState<"invoice" | "shipment" | "order" | "offer" | "request">(typeFromUrl);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [number, setNumber] = useState("");
  const [approver, setApprover] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"pending" | "completed" | "cancelled">("pending");
  const [itemCount, setItemCount] = useState(1);
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [tags, setTags] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  
  const [isFormValid, setIsFormValid] = useState(false);

  // Set the appropriate number prefix based on type
  useEffect(() => {
    const prefix = 
      purchaseType === "invoice" ? "INV-" :
      purchaseType === "shipment" ? "SH-" :
      purchaseType === "order" ? "ORD-" :
      purchaseType === "offer" ? "OFR-" : "REQ-";
    setNumber(`${prefix}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`);
  }, [purchaseType]);

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

  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTypeIcon = () => {
    switch (purchaseType) {
      case "invoice": return <FileText className="h-6 w-6 text-purple-500" />;
      case "shipment": return <Truck className="h-6 w-6 text-orange-500" />;
      case "order": return <ShoppingCart className="h-6 w-6 text-blue-500" />;
      case "offer": return <Tag className="h-6 w-6 text-green-500" />;
      case "request": return <HelpCircle className="h-6 w-6 text-pink-500" />;
    }
  };

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
    const newPurchase = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(date),
      number,
      approver,
      dueDate: dueDate ? new Date(dueDate) : null,
      status,
      itemCount: items.length,
      priority,
      tags: tags.split(',').map(tag => tag.trim()),
      type: purchaseType,
      items,
    };

    // In a real application, we would push this to a state manager or make an API call
    // For this example, we'll use localStorage to persist data between page refreshes
    const existingPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const updatedPurchases = [newPurchase, ...existingPurchases];
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));

    toast.success(`${getTypeTitle()} created successfully!`);
    navigate("/purchases");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-purple-400 to-indigo-500 p-6">
          <div className="flex items-center">
            {getTypeIcon()}
            <h1 className="text-2xl font-semibold text-white ml-2">Create New {getTypeTitle()}</h1>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Purchase Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Purchase Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={purchaseType}
                      onValueChange={(value: "invoice" | "shipment" | "order" | "offer" | "request") => {
                        setPurchaseType(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="shipment">Shipment</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="request">Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Number</Label>
                    <Input
                      id="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approver">Approver</Label>
                    <Input
                      id="approver"
                      value={approver}
                      onChange={(e) => setApprover(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value: "pending" | "completed" | "cancelled") =>
                        setStatus(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={priority}
                      onValueChange={(value: "High" | "Medium" | "Low") =>
                        setPriority(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Items</h2>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
                      <div className="col-span-5">
                        <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                        <Input
                          id={`item-name-${item.id}`}
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`item-quantity-${item.id}`}>Qty</Label>
                        <Input
                          id={`item-quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor={`item-price-${item.id}`}>Price</Label>
                        <Input
                          id={`item-price-${item.id}`}
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, "price", parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2 flex justify-end items-end h-full">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-500 h-8"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-xl font-semibold">Rp {formatPrice(calculateTotal())}</div>
                  </div>
                </div>
              </div>

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
