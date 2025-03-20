import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseType, PurchaseStatus } from "@/types/purchase";

interface PurchaseInformationFormProps {
  purchaseType: PurchaseType;
  setPurchaseType: (type: PurchaseType) => void;
  date: string;
  setDate: (date: string) => void;
  number: string;
  setNumber: (number: string) => void;
  approver: string;
  setApprover: (approver: string) => void;
  dueDate: string;
  setDueDate: (dueDate: string) => void;
  status: PurchaseStatus;
  setStatus: (status: PurchaseStatus) => void;
  tags: string;
  setTags: (tags: string) => void;
  
  // Type-specific fields
  trackingNumber?: string;
  setTrackingNumber?: (trackingNumber: string) => void;
  carrier?: string;
  setCarrier?: (carrier: string) => void;
  shippingDate?: string;
  setShippingDate?: (shippingDate: string) => void;
  orderDate?: string;
  setOrderDate?: (orderDate: string) => void;
  discountTerms?: string;
  setDiscountTerms?: (discountTerms: string) => void;
  expiryDate?: string;
  setExpiryDate?: (expiryDate: string) => void;
  requestedBy?: string;
  setRequestedBy?: (requestedBy: string) => void;
  urgency?: string;
  setUrgency?: (urgency: string) => void;
}

export function PurchaseInformationForm({
  purchaseType,
  setPurchaseType,
  date,
  setDate,
  number,
  setNumber,
  approver,
  setApprover,
  dueDate,
  setDueDate,
  status,
  setStatus,
  tags,
  setTags,
  // Type-specific fields
  trackingNumber,
  setTrackingNumber,
  carrier,
  setCarrier,
  shippingDate,
  setShippingDate,
  orderDate,
  setOrderDate,
  discountTerms,
  setDiscountTerms,
  expiryDate,
  setExpiryDate,
  requestedBy,
  setRequestedBy,
  urgency,
  setUrgency,
}: PurchaseInformationFormProps) {
  // Set the appropriate number prefix based on type
  useEffect(() => {
    const prefix = 
      purchaseType === "invoice" ? "INV-" :
      purchaseType === "shipment" ? "SH-" :
      purchaseType === "order" ? "ORD-" :
      purchaseType === "offer" ? "OFR-" : "REQ-";
    setNumber(`${prefix}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`);
  }, [purchaseType, setNumber]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Purchase Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={purchaseType}
            onValueChange={(value: PurchaseType) => {
              setPurchaseType(value);
            }}
          >
            <SelectTrigger>
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

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Number</Label>
          <Input
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        {/* Type-specific fields */}
        {purchaseType === "shipment" && setTrackingNumber && setCarrier && setShippingDate && (
          <>
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingDate">Shipping Date</Label>
              <Input
                id="shippingDate"
                type="date"
                value={shippingDate}
                onChange={(e) => setShippingDate(e.target.value)}
              />
            </div>
          </>
        )}

        {purchaseType === "order" && setOrderDate && (
          <div className="space-y-2">
            <Label htmlFor="orderDate">Order Date</Label>
            <Input
              id="orderDate"
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
        )}

        {purchaseType === "offer" && setDiscountTerms && setExpiryDate && (
          <>
            <div className="space-y-2">
              <Label htmlFor="discountTerms">Discount Terms</Label>
              <Input
                id="discountTerms"
                value={discountTerms}
                onChange={(e) => setDiscountTerms(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </>
        )}

        {purchaseType === "request" && setRequestedBy && setUrgency && (
          <>
            <div className="space-y-2">
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={urgency}
                onValueChange={(value) => setUrgency(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Common fields for all types */}
        <div className="space-y-2">
          <Label htmlFor="approver">Approver</Label>
          <Input
            id="approver"
            value={approver}
            onChange={(e) => setApprover(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value: PurchaseStatus) =>
              setStatus(value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>
    </div>
  );
}