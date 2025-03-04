
/**
 * Generates a default purchase number based on the type
 */
export const generateDefaultPurchaseNumber = (type: string): string => {
  const prefix = type === "invoice" ? "INV-" :
               type === "shipment" ? "SH-" :
               type === "order" ? "ORD-" :
               type === "offer" ? "OFR-" : "REQ-";
  return `${prefix}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
};

/**
 * Get the display label for a purchase type
 */
export const getPurchaseTypeLabel = (type: "invoice" | "shipment" | "order" | "offer" | "request"): string => {
  const typeLabels = {
    invoice: "Invoice",
    shipment: "Shipment",
    order: "Order",
    offer: "Offer",
    request: "Request"
  };
  
  return typeLabels[type];
};

/**
 * Get the initial form data for a purchase dialog
 */
export const getInitialFormData = (defaultType: "invoice" | "shipment" | "order" | "offer" | "request") => ({
  date: new Date().toISOString().split('T')[0],
  number: generateDefaultPurchaseNumber(defaultType),
  approver: "",
  dueDate: "",
  status: "pending",
  itemCount: 0,
  priority: "Medium",
  tags: [""],
  type: defaultType,
});
