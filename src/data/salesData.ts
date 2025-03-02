
export interface SalesData {
  id: string;
  date: string;
  number: string;
  customer: string;
  dueDate: string;
  status: string;
  total: string;
}

export const salesData: SalesData[] = [
  // Paid examples (5)
  {
    id: "10005",
    date: "18/02/2025",
    number: "Sales Invoice #10005",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    total: "Rp 13.440"
  },
  {
    id: "10004",
    date: "18/02/2025",
    number: "Sales Invoice #10004",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    total: "Rp 133.440"
  },
  {
    id: "10003",
    date: "14/02/2025",
    number: "Sales Invoice #10003",
    customer: "Nanda goaw putra",
    dueDate: "16/03/2025",
    status: "Paid",
    total: "Rp 106.560"
  },
  {
    id: "10002",
    date: "10/02/2025",
    number: "Sales Invoice #10002",
    customer: "Sutejo Enterprises",
    dueDate: "10/02/2025",
    status: "Paid",
    total: "Rp 245.000"
  },
  {
    id: "10001",
    date: "05/02/2025",
    number: "Sales Invoice #10001",
    customer: "Pak Budi Store",
    dueDate: "05/02/2025",
    status: "Paid",
    total: "Rp 89.750"
  },
  
  // Unpaid examples (5)
  {
    id: "10006",
    date: "22/02/2025",
    number: "Sales Invoice #10006",
    customer: "Toko Makmur",
    dueDate: "10/03/2025",
    status: "Unpaid",
    total: "Rp 320.500"
  },
  {
    id: "10007",
    date: "23/02/2025",
    number: "Sales Invoice #10007",
    customer: "CV Berkah",
    dueDate: "15/03/2025",
    status: "Unpaid",
    total: "Rp 175.200"
  },
  {
    id: "10008",
    date: "25/02/2025",
    number: "Sales Invoice #10008",
    customer: "PT Maju Jaya",
    dueDate: "25/03/2025",
    status: "Unpaid",
    total: "Rp 425.750"
  },
  {
    id: "10009",
    date: "26/02/2025",
    number: "Sales Invoice #10009",
    customer: "Ibu Sari Catering",
    dueDate: "26/03/2025",
    status: "Unpaid",
    total: "Rp 92.800"
  },
  {
    id: "10010",
    date: "28/02/2025",
    number: "Sales Invoice #10010",
    customer: "Warung Padang",
    dueDate: "28/03/2025",
    status: "Unpaid",
    total: "Rp 65.000"
  },
  
  // Late Payment examples (5)
  {
    id: "9995",
    date: "10/01/2025",
    number: "Sales Invoice #9995",
    customer: "Supermarket Indah",
    dueDate: "10/02/2025",
    status: "Late Payment",
    total: "Rp 456.000"
  },
  {
    id: "9996",
    date: "15/01/2025",
    number: "Sales Invoice #9996",
    customer: "Restoran Sedap",
    dueDate: "15/02/2025",
    status: "Late Payment",
    total: "Rp 215.700"
  },
  {
    id: "9997",
    date: "18/01/2025",
    number: "Sales Invoice #9997",
    customer: "Toko Elektronik",
    dueDate: "18/02/2025",
    status: "Late Payment",
    total: "Rp 650.250"
  },
  {
    id: "9998",
    date: "20/01/2025",
    number: "Sales Invoice #9998",
    customer: "Apotek Sehat",
    dueDate: "20/02/2025",
    status: "Late Payment",
    total: "Rp 125.400"
  },
  {
    id: "9999",
    date: "25/01/2025",
    number: "Sales Invoice #9999",
    customer: "PT Textile Indonesia",
    dueDate: "25/02/2025",
    status: "Late Payment",
    total: "Rp 875.000"
  },
  
  // Awaiting Payment examples (5)
  {
    id: "10011",
    date: "01/03/2025",
    number: "Sales Invoice #10011",
    customer: "Hotel Merdeka",
    dueDate: "15/03/2025",
    status: "Awaiting Payment",
    total: "Rp 520.000"
  },
  {
    id: "10012",
    date: "02/03/2025",
    number: "Sales Invoice #10012",
    customer: "Toko Bangunan Jaya",
    dueDate: "16/03/2025",
    status: "Awaiting Payment",
    total: "Rp 327.500"
  },
  {
    id: "10013",
    date: "03/03/2025",
    number: "Sales Invoice #10013",
    customer: "Bengkel Motor Cepat",
    dueDate: "17/03/2025",
    status: "Awaiting Payment",
    total: "Rp 85.300"
  },
  {
    id: "10014",
    date: "04/03/2025",
    number: "Sales Invoice #10014",
    customer: "Salon Cantik",
    dueDate: "18/03/2025",
    status: "Awaiting Payment",
    total: "Rp 142.500"
  },
  {
    id: "10015",
    date: "05/03/2025",
    number: "Sales Invoice #10015",
    customer: "Klinik Hewan",
    dueDate: "19/03/2025",
    status: "Awaiting Payment",
    total: "Rp 275.800"
  }
];
