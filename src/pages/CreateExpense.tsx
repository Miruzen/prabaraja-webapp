
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Calendar, FileQuestion } from "lucide-react";
import { Expense, ExpenseItem, ExpenseStatus, DEFAULT_EXPENSE_CATEGORIES, EXPENSES_STORAGE_KEY } from "@/types/expense";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

const CreateExpense = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [status, setStatus] = useState<ExpenseStatus>("Paid");
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: '1', name: '', quantity: 1, amount: 0 }
  ]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categories, setCategories] = useState<string[]>(DEFAULT_EXPENSE_CATEGORIES);
  const [isFormValid, setIsFormValid] = useState(false);

  // Calculate total
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.amount, 0);
  };

  // Format the total as currency
  const formattedTotal = formatCurrency(calculateTotal());

  // Add a new item
  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, amount: 0 }
    ]);
  };

  // Remove an item
  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast.error("You need at least one item");
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  // Update item value
  const updateItem = (id: string, field: keyof ExpenseItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Add new category
  const handleAddNewCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, newCategory.trim()]);
      setCategory(newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  // Form validation
  useEffect(() => {
    const isValid = 
      date !== "" && 
      category !== "" && 
      beneficiary !== "" && 
      items.length > 0 && 
      items.every(item => item.name.trim() !== "" && item.quantity > 0 && item.amount > 0);
    
    setIsFormValid(isValid);
  }, [date, category, beneficiary, items]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Generate a unique expense number
    const expenseNumber = `Expense #${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Create the expense object
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-'),
      number: expenseNumber,
      category,
      beneficiary,
      status,
      items,
      total: formattedTotal
    };

    // Get existing expenses from localStorage
    const existingExpensesString = localStorage.getItem(EXPENSES_STORAGE_KEY);
    let existingExpenses: Expense[] = [];
    
    if (existingExpensesString) {
      try {
        existingExpenses = JSON.parse(existingExpensesString);
      } catch (error) {
        console.error("Error parsing expenses from localStorage:", error);
      }
    }

    // Add new expense to the beginning of the array
    const updatedExpenses = [newExpense, ...existingExpenses];
    
    // Store in localStorage
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updatedExpenses));

    toast.success("Expense created successfully!");
    navigate("/expenses");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Create New Expense</h1>
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Expense Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Expense Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <div className="flex gap-2">
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                            <SelectItem value="add-new">+ Add new category</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Dialog open={isAddingCategory || category === "add-new"} onOpenChange={(open) => {
                          setIsAddingCategory(open);
                          if (!open && category === "add-new") {
                            setCategory("");
                          }
                        }}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Label htmlFor="new-category">Category Name</Label>
                              <Input
                                id="new-category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="mt-2"
                                placeholder="Enter category name"
                              />
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => {
                                setIsAddingCategory(false);
                                if (category === "add-new") {
                                  setCategory("");
                                }
                              }}>
                                Cancel
                              </Button>
                              <Button type="button" onClick={handleAddNewCategory}>
                                Add Category
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="beneficiary">Beneficiary</Label>
                      <Input
                        id="beneficiary"
                        value={beneficiary}
                        onChange={(e) => setBeneficiary(e.target.value)}
                        required
                        placeholder="Enter beneficiary name"
                      />
                    </div>

                    <div className="space-y-2 ">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(value) => setStatus(value as ExpenseStatus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Paid">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Paid</span>
                        </div>
                        </SelectItem>
                          <SelectItem value="Require Approval">
                            <div className="flex items-center gap-2">
                              <FileQuestion className="h-4 w-4 text-red-500" /> 
                              <span>Require Approval</span>
                            </div>
                            </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Expense Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                          <Input
                            id={`item-name-${item.id}`}
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            placeholder="Enter item name"
                            required
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`item-quantity-${item.id}`}>Quantity</Label>
                          <Input
                            id={`item-quantity-${item.id}`}
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            required
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor={`item-amount-${item.id}`}>Amount</Label>
                          <Input
                            id={`item-amount-${item.id}`}
                            type="number"
                            value={item.amount}
                            min={0}
                            onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                            required
                          />
                        </div>
                        <div className="w-32">
                          <Label>Subtotal</Label>
                          <div className="h-10 flex items-center">
                            {formatCurrency(item.quantity * item.amount)}
                          </div>
                        </div>
                        <div className="pt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addItem}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>

                    <div className="flex justify-end pt-4 border-t mt-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="text-xl font-semibold">{formattedTotal}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/expenses')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-indigo-600 text-white"
                  disabled={!isFormValid}
                >
                  Create Expense
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExpense;
