import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Calendar, X, Plus, CheckCircle, Clock, AlertTriangle, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface SalesItemType {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const getMockSalesData = () => {
  return [
    {
      id: "10005",
      date: "18/02/2025",
      number: "Sales Invoice #10005",
      customer: "AABVCDD",
      dueDate: "18/02/2025",
      status: "Paid",
      total: "Rp 13.440"
    },
    // ... keep existing code (other mock data entries)
  ];
};

const getLatestInvoiceNumber = () => {
  const salesData = getMockSalesData();
  const sortedData = [...salesData].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  return sortedData.length > 0 ? sortedData[0].id : "10000";
};

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

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: '', quantity: 1, price: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SalesItemType, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

    toast.success("Sales invoice created successfully!");
    navigate("/sales");
  };

  const renderStatusIcon = (statusValue: string) => {
    switch(statusValue) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "unpaid":
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      case "awaiting":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "late":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
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
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input 
                        id="customerName" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                        placeholder="Customer name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                      <Input 
                        id="invoiceNumber" 
                        value={invoiceNumber} 
                        onChange={(e) => setInvoiceNumber(e.target.value)} 
                        placeholder="INV-00001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceDate">Invoice Date *</Label>
                      <div className="relative">
                        <Input 
                          id="invoiceDate" 
                          type="date"
                          value={invoiceDate} 
                          onChange={(e) => setInvoiceDate(e.target.value)} 
                          required
                        />
                        <Calendar className="absolute right-3 top-3 h-4 w-4 pointer-events-none text-gray-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <div className="relative">
                        <Input 
                          id="dueDate" 
                          type="date"
                          value={dueDate} 
                          onChange={(e) => setDueDate(e.target.value)} 
                          required
                        />
                        <Calendar className="absolute right-3 top-3 h-4 w-4 pointer-events-none text-gray-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status">
                            {status && (
                              <div className="flex items-center gap-2">
                                {renderStatusIcon(status)}
                                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-orange-500" />
                              <span>Unpaid</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="paid">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="late">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span>Late Payment</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="awaiting">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-yellow-500" />
                              <span>Awaiting Payment</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5">
                          <Input 
                            placeholder="Item name" 
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="Qty" 
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Price" 
                            prefix="Rp"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          Rp {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={addItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                    
                    <div className="flex justify-end mt-6">
                      <div className="w-1/3 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>Rp {formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span>Rp {formatPrice(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
