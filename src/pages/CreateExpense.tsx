
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  DEFAULT_EXPENSE_CATEGORIES,
  EXPENSES_STORAGE_KEY, 
  ExpenseItem, 
  ExpenseStatus 
} from "@/types/expense";
import { saveExpenses, getExpenses } from "@/utils/expenseUtils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CreateExpense = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [beneficiary, setBeneficiary] = useState<string>("");
  const [status, setStatus] = useState<ExpenseStatus>("Require Approval");
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: uuidv4(), name: "", quantity: 1, amount: 0 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), name: "", quantity: 1, amount: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
      toast.error("At least one item is required");
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ExpenseItem, value: any) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, [field]: field === 'quantity' || field === 'amount' ? Number(value) : value } 
        : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!date || !category || !beneficiary) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.some(item => !item.name || item.amount <= 0)) {
      toast.error("Please fill in all item details with valid amounts");
      return;
    }

    // Create expense object
    const totalAmount = calculateTotal();
    const formattedTotal = `Rp. ${totalAmount.toLocaleString("id-ID")},00`;
    
    const newExpense = {
      id: uuidv4(),
      date: date,
      number: `Expense #${Math.floor(10000 + Math.random() * 90000)}`,
      category,
      beneficiary,
      status,
      items,
      total: formattedTotal
    };

    // Save to localStorage
    const existingExpenses = getExpenses();
    saveExpenses([...existingExpenses, newExpense]);
    
    toast.success("Expense created successfully");
    navigate("/expenses");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Create New Expense</h1>
        </div>

        <div className="p-6">
          <Link to="/expenses" className="inline-block mb-6">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Expenses
            </Button>
          </Link>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Beneficiary</label>
                    <input
                      type="text"
                      value={beneficiary}
                      onChange={(e) => setBeneficiary(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter beneficiary name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Require Approval">Require Approval</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Expense Items</h3>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Item description"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={item.amount}
                            min="0"
                            onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Amount"
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500"
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddItem}
                    >
                      Add Item
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-bold">
                      Rp. {calculateTotal().toLocaleString("id-ID")},00
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2"
                    onClick={() => navigate("/expenses")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 text-white">
                    Save Expense
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateExpense;
