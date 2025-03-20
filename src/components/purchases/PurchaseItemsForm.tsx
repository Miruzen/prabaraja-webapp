import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PurchaseItem } from "@/types/purchase";
import { useEffect } from "react"; // Add useEffect

interface PurchaseItemsFormProps {
  items: PurchaseItem[];
  setItems: (items: PurchaseItem[]) => void;
  onTotalChange?: (total: number) => void; // Add this prop
}

export function PurchaseItemsForm({ items, setItems, onTotalChange }: PurchaseItemsFormProps) {
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

  // Notify parent when total changes
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(calculateTotal());
    }
  }, [items, onTotalChange]);

  return (
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
  );
}