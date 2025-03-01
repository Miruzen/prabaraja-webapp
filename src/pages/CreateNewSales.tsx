
import { useState } from "react";
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
import { Calendar, X } from "lucide-react";
import { toast } from "sonner";

interface SalesItemType {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!customerName || !invoiceNumber || !invoiceDate || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if items are filled
    const emptyItems = items.some(item => !item.name);
    if (emptyItems) {
      toast.error("Please fill in all item names");
      return;
    }

    // Here you would typically save the invoice data
    toast.success("Sales invoice created successfully!");
    navigate("/sales");
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
              {/* Customer Information */}
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
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="awaiting">Awaiting Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
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
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
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
                      Add Item
                    </Button>
                    
                    <div className="flex justify-end mt-6">
                      <div className="w-1/3 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/sales')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 text-white">
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
