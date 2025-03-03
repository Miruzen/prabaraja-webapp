
import { salesData } from "../data/salesData";

// Function to get the latest invoice number from the actual sales data
export const getLatestInvoiceNumber = () => {
  const sortedData = [...salesData].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  return sortedData.length > 0 ? sortedData[0].id : "10000";
};

// Function to format price with Indonesian locale
export const formatPriceWithSeparator = (price: number) => {
  return price.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
