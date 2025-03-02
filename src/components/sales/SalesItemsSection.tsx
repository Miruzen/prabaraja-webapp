
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface SalesItemType {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SalesItemsSectionProps {
  items: SalesItemType[];
  setItems: React.Dispatch<React.SetStateAction<SalesItemType[]>>;
  calculateTotal: () => number;
  formatPrice: (price: number) => string;
}

const SalesItemsSection = ({ 
  items, 
  setItems, 
  calculateTotal,
  formatPrice
}: SalesItemsSectionProps) => {
  
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

  return (
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
  );
};

export default SalesItemsSection;
