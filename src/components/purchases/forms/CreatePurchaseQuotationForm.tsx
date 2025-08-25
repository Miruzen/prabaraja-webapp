import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, FileText, User, Package, Plus, Building2, Calculator, Receipt } from "lucide-react";
import { toast } from "sonner";
import { formatInputCurrency, parseInputCurrency, formatCurrency } from "@/lib/utils";
import { useContacts, useCreateContact } from "@/hooks/useContacts";
import { SalesTaxCalculation } from "@/components/sales/SalesTaxCalculation";

interface QuotationItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
}

type QuotationStatus = "Unpaid" | "Paid" | "Awaiting Payment" | "Late Payment";

interface CreatePurchaseQuotationFormProps {
  onSubmit: (data: any) => void;
}

export function CreatePurchaseQuotationForm({ onSubmit }: CreatePurchaseQuotationFormProps) {
  const navigate = useNavigate();
  const { data: contacts } = useContacts();
  const createContactMutation = useCreateContact();
  
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [quotationNumber, setQuotationNumber] = useState("");
  const [quotationDate, setQuotationDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [status, setStatus] = useState<QuotationStatus>("Unpaid");
  const [terms, setTerms] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', name: '', quantity: 1, price: 0, discount: 0 }
  ]);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // New vendor dialog state
  const [isNewVendorDialogOpen, setIsNewVendorDialogOpen] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  
  // Tax calculation state
  const [taxData, setTaxData] = useState({
    dpp: 0,
    ppn: 0,
    pph: 0,
    grandTotal: 0
  });

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

  // Get vendor options
  const vendorContacts = contacts?.filter(contact => contact.category === "Vendor") || [];
  
  // Validate form
  useEffect(() => {
    const validateForm = () => {
      const commonFieldsValid = 
        (selectedVendorId !== "" || vendorName !== "") && 
        quotationNumber !== "" && 
        quotationDate !== "" &&
        validUntil !== "";
        
      const itemsValid = items.length > 0 && 
        items.every(item => item.name !== "" && item.quantity > 0 && item.price > 0);
      
      return commonFieldsValid && itemsValid;
    };
    
    setIsFormValid(validateForm());
  }, [selectedVendorId, vendorName, quotationNumber, quotationDate, validUntil, items]);

  // Calculate subtotal with consideration for discounts
  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const itemSubtotal = item.quantity * item.price;
      if (item.discount && item.discount > 0) {
        return total + (itemSubtotal - (itemSubtotal * (item.discount / 100)));
      }
      return total + itemSubtotal;
    }, 0);
  };
  
  // Format price display for inputs
  const formatPriceDisplay = (price: number) => {
    return formatInputCurrency(price.toString());
  };

  // Handle item changes
  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };
  
  // Handle price changes with formatting
  const handlePriceChange = (index: number, value: string) => {
    const numericValue = parseInputCurrency(value);
    updateItem(index, 'price', numericValue);
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
  
  // Handle vendor selection
  const handleVendorChange = (vendorId: string) => {
    if (vendorId === "create_new") {
      setIsNewVendorDialogOpen(true);
      setSelectedVendorId("");
      setVendorName("");
    } else {
      setSelectedVendorId(vendorId);
      const selectedVendor = vendorContacts.find(v => v.id === vendorId);
      setVendorName(selectedVendor?.name || "");
    }
  };
  
  // Handle new vendor creation
  const handleCreateNewVendor = async () => {
    try {
      await createContactMutation.mutateAsync({
        category: "Vendor",
        name: newVendorData.name,
        email: newVendorData.email,
        phone: newVendorData.phone,
        address: newVendorData.address,
        number: Date.now()
      });
      
      setVendorName(newVendorData.name);
      setIsNewVendorDialogOpen(false);
      setNewVendorData({ name: "", email: "", phone: "", address: "" });
      toast.success("Vendor created successfully!");
    } catch (error) {
      toast.error("Failed to create vendor");
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
        vendorName: selectedVendorId ? vendorContacts.find(v => v.id === selectedVendorId)?.name : vendorName,
        quotationDate,
        validUntil,
        status,
        items,
        total: taxData.grandTotal || calculateSubtotal(),
        terms: terms || null,
        taxData
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <form onSubmit={handleSubmit} className="space-y-8 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-7 w-7" />
            Create Purchase Quotation
          </h1>
          <p className="mt-2 opacity-90">Request quotes from vendors with detailed specifications</p>
        </div>

        {/* Vendor Information */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Building2 className="h-5 w-5" />
              Vendor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="vendorSelect" className="text-sm font-medium text-gray-700">Vendor *</Label>
                <Select value={selectedVendorId} onValueChange={handleVendorChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select vendor or create new" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorContacts.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          {vendor.name}
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="create_new">
                      <div className="flex items-center gap-2 text-green-600">
                        <Plus className="h-4 w-4" />
                        Create New Vendor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!selectedVendorId && (
                  <Input
                    className="mt-2"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="Or enter vendor name manually"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="quotationNumber" className="text-sm font-medium text-gray-700">Quotation Number *</Label>
                <Input
                  id="quotationNumber"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  placeholder="Auto-generated"
                  className="mt-1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotation Details */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <CalendarDays className="h-5 w-5" />
              Quotation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="quotationDate" className="text-sm font-medium text-gray-700">Quotation Date *</Label>
                <Input
                  id="quotationDate"
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="validUntil" className="text-sm font-medium text-gray-700">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status *</Label>
                <Select value={status} onValueChange={(value: QuotationStatus) => setStatus(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Unpaid
                      </div>
                    </SelectItem>
                    <SelectItem value="Paid">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Paid
                      </div>
                    </SelectItem>
                    <SelectItem value="Awaiting Payment">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Awaiting Payment
                      </div>
                    </SelectItem>
                    <SelectItem value="Late Payment">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Late Payment
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="terms" className="text-sm font-medium text-gray-700">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter terms and conditions (optional)"
                rows={3}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Package className="h-5 w-5" />
              Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="col-span-5">
                    <Label className="text-sm font-medium text-gray-700">Item Name *</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Enter item name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Qty *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Price *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatPriceDisplay(item.price)}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      placeholder="0"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-700">Discount (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount || 0}
                      onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={addItem}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>
        
        {/* Tax Calculation */}
        <Card className="border-l-4 border-l-orange-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Calculator className="h-5 w-5" />
              Tax Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <SalesTaxCalculation 
              subtotal={calculateSubtotal()} 
              onTaxChange={setTaxData}
            />
          </CardContent>
        </Card>
        
        {/* Quotation Summary */}
        <Card className="border-l-4 border-l-indigo-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <Receipt className="h-5 w-5" />
              Quotation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">DPP/VOT:</span>
                <span className="font-medium">{formatCurrency(taxData.dpp)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">PPN (VAT):</span>
                <span className="font-medium text-green-600">+{formatCurrency(taxData.ppn)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">PPH:</span>
                <span className="font-medium text-red-600">-{formatCurrency(taxData.pph)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-indigo-200">
                <span className="text-lg font-bold text-indigo-800">Grand Total:</span>
                <span className="text-xl font-bold text-indigo-800">
                  {formatCurrency(taxData.grandTotal || calculateSubtotal())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/purchases")}
            className="px-8 py-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-2"
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Quotation
          </Button>
        </div>
      </form>

      {/* New Vendor Dialog */}
      <Dialog open={isNewVendorDialogOpen} onOpenChange={setIsNewVendorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Create New Vendor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="newVendorName">Vendor Name *</Label>
              <Input
                id="newVendorName"
                value={newVendorData.name}
                onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                placeholder="Enter vendor name"
                required
              />
            </div>
            <div>
              <Label htmlFor="newVendorEmail">Email *</Label>
              <Input
                id="newVendorEmail"
                type="email"
                value={newVendorData.email}
                onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <Label htmlFor="newVendorPhone">Phone *</Label>
              <Input
                id="newVendorPhone"
                value={newVendorData.phone}
                onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <Label htmlFor="newVendorAddress">Address *</Label>
              <Textarea
                id="newVendorAddress"
                value={newVendorData.address}
                onChange={(e) => setNewVendorData({ ...newVendorData, address: e.target.value })}
                placeholder="Enter address"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsNewVendorDialogOpen(false);
                  setNewVendorData({ name: "", email: "", phone: "", address: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateNewVendor}
                disabled={!newVendorData.name || !newVendorData.email || !newVendorData.phone || !newVendorData.address}
                className="bg-green-600 hover:bg-green-700"
              >
                Create Vendor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}