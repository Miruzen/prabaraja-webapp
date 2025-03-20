
export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type PurchaseType = "invoice" | "shipment" | "order" | "offer" | "request";
export type PurchaseStatus = "pending" | "completed" | "cancelled";
export type PurchasePriority = "High" | "Medium" | "Low";

export interface Purchase {
  id: string;
  date: Date;
  number: string;
  approver: string;
  dueDate: Date | null;
  status: PurchaseStatus;
  itemCount: number;
  amount: number;
  tags: string[];
  type: PurchaseType;
  items: PurchaseItem[];
  
  // Type-specific fields
  trackingNumber?: string;
  carrier?: string;
  shippingDate?: Date | null;
  orderDate?: Date | null;
  discountTerms?: string;
  expiryDate?: Date | null;
  requestedBy?: string;
  urgency?: string;
}

// Local storage keys
export const PURCHASES_STORAGE_KEY = "purchases";
