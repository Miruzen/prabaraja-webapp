import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, FileText, User, Package } from "lucide-react";
import { toast } from "sonner";
import { formatPriceWithSeparator } from "@/utils/salesUtils";

interface QuotationItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface CreatePurchaseQuotationFormProps {
  onSubmit: (data: any) => void;
}

export function CreatePurchaseQuotationForm({ onSubmit }: CreatePurchaseQuotationFormProps) {
  const navigate = useNavigate();
  
  const [vendorName, setVendorName] = useState("");
  const [quotationNumber, setQuotationNumber] = useState("");
  const [quotationDate, setQuotationDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [terms, setTerms] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', name: '', quantity: 1, price: 0, discount: 0 }
  ]);
  const [isFormValid, setIsFormValid] = useState(false);

  // Generate quotation number on component mount
  useEffect(() => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const generatedNumber = `PQU-${timestamp}${randomNum}`;
    setQuotationNumber(generatedNumber);
    
    // Set current date as default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setQuotationDate(formattedDate);
    
    // Set valid until date 30 days from now
    const validUntilDate = new Date();
    validUntilDate.setDate(today.getDate() + 30);
    setValidUntil(validUntilDate.toISOString().split('T')[0]);
  }, []);

  // Validate form
  useEffect(() => {
    const validateForm = () => {
      const commonFieldsValid = 
        vendorName !== "" && 
        quotationNumber !== "" && 
        quotationDate !== "" &&
        validUntil !== "";
        
      const itemsValid = items.length > 0 && 
        items.every(item => item.name !== "" && item.quantity > 0 && item.price > 0);
      
      return commonFieldsValid && itemsValid;
    };
    
    setIsFormValid(validateForm());
  }, [vendorName, quotationNumber, quotationDate, validUntil, items]);

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

  // Handle item changes
  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
      discount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const quotationData = {
        type: "quotation",
        number: quotationNumber,
        vendorName,
        quotationDate,
        validUntil,
        status: "pending",
        items,
        total: calculateTotal(),
        terms: terms || null,
      };

      await onSubmit(quotationData);
      toast.success("Purchase Quotation created successfully!");
      navigate("/purchases");

    } catch (error) {
      console.error('Error creating quotation:', error);
      toast.error("Failed to create quotation. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Vendor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter vendor name"
                required
              />
            </div>
            <div>
              <Label htmlFor="quotationNumber">Quotation Number *</Label>
              <Input
                id="quotationNumber"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                placeholder="Auto-generated"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Quotation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quotationDate">Quotation Date *</Label>
              <Input
                id="quotationDate"
                type="date"
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="validUntil">Valid Until *</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Enter terms and conditions (optional)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Item Name *</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={item.discount || 0}
                  onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addItem}>
            Add Item
          </Button>
          
          {/* Total */}
          <div className="text-right border-t pt-4">
            <div className="text-lg font-semibold">
              Total: Rp {formatPriceWithSeparator(calculateTotal())}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/purchases")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!isFormValid}>
          <FileText className="mr-2 h-4 w-4" />
          Create Quotation
        </Button>
      </div>
    </form>
  );
}