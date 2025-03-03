
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
  priority: PurchasePriority;
  tags: string[];
  type: PurchaseType;
  items: PurchaseItem[];
}
