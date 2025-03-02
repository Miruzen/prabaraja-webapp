
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, AlertTriangle, DollarSign } from "lucide-react";

interface CustomerInfoProps {
  customerName: string;
  setCustomerName: (value: string) => void;
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  invoiceDate: string;
  setInvoiceDate: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

const CustomerInfoSection = ({
  customerName,
  setCustomerName,
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
  status,
  setStatus
}: CustomerInfoProps) => {
  
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
  );
};

export default CustomerInfoSection;
