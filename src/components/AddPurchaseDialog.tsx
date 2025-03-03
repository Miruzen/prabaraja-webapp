
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    date: string;
    number: string;
    approver: string;
    dueDate: string;
    status: "pending" | "completed" | "cancelled";
    itemCount: number;
    priority: "High" | "Medium" | "Low";
    tags: string[];
    type: "invoice" | "shipment" | "order" | "offer" | "request";
  }) => void;
  defaultType?: "invoice" | "shipment" | "order" | "offer" | "request";
}

export function AddPurchaseDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  defaultType = "invoice" 
}: AddPurchaseDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    number: "",
    approver: "",
    dueDate: "",
    status: "pending",
    itemCount: 0,
    priority: "Medium",
    tags: [""],
    type: defaultType,
  });

  // Update form data when defaultType changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: defaultType,
      number: generateDefaultNumber(defaultType)
    }));
  }, [defaultType, open]);

  const generateDefaultNumber = (type: string) => {
    const prefix = type === "invoice" ? "INV-" :
                 type === "shipment" ? "SH-" :
                 type === "order" ? "ORD-" :
                 type === "offer" ? "OFR-" : "REQ-";
    return `${prefix}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: formData.status as "pending" | "completed" | "cancelled",
      priority: formData.priority as "High" | "Medium" | "Low",
      type: formData.type as "invoice" | "shipment" | "order" | "offer" | "request"
    });
    onOpenChange(false);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      number: "",
      approver: "",
      dueDate: "",
      status: "pending",
      itemCount: 0,
      priority: "Medium",
      tags: [""],
      type: defaultType,
    });
  };

  const typeLabels = {
    invoice: "Invoice",
    shipment: "Shipment",
    order: "Order",
    offer: "Offer",
    request: "Request"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {typeLabels[formData.type as keyof typeof typeLabels]}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "invoice" | "shipment" | "order" | "offer" | "request") => {
                  setFormData({ 
                    ...formData, 
                    type: value,
                    number: generateDefaultNumber(value)
                  });
                }}
              >
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Number
              </Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="col-span-3"
                placeholder={generateDefaultNumber(formData.type)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="approver" className="text-right">
                Approver
              </Label>
              <Input
                id="approver"
                value={formData.approver}
                onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "completed" | "cancelled") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemCount" className="text-right">
                Items
              </Label>
              <Input
                id="itemCount"
                type="number"
                value={formData.itemCount}
                onChange={(e) => setFormData({ ...formData, itemCount: Number(e.target.value) })}
                className="col-span-3"
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "High" | "Medium" | "Low") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(", ") })}
                className="col-span-3"
                placeholder="Comma-separated tags"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add {typeLabels[formData.type as keyof typeof typeLabels]}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
