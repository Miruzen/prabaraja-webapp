
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, MapPin, DollarSign, Wallet } from "lucide-react";
import { formatPriceWithSeparator } from "@/utils/salesUtils";

// This would come from your API/database in a real app
const contacts = [
  {
    id: 1,
    category: "Customer",
    name: "PT Maju Jaya",
    number: "CUST-001",
    email: "contact@majujaya.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Sudirman No. 123, Jakarta",
  },
  {
    id: 2,
    category: "Vendor",
    name: "CV Sukses Makmur",
    number: "VEN-001",
    email: "info@suksesmakmur.com",
    phone: "+62 812 9876 5432",
    address: "Jl. Gatot Subroto No. 45, Bandung",
  },
  {
    id: 3,
    category: "Employee",
    name: "Budi Santoso",
    number: "EMP-001",
    email: "budi.s@company.com",
    phone: "+62 812 1122 3344",
    address: "Jl. Melati No. 67, Surabaya",
  },
];

// Mock transaction data
const salesTransactions = [
  { 
    id: "S001", 
    contactId: 1, 
    date: "2023-07-12", 
    invoiceNumber: "INV-2023-001", 
    amount: 5000000, 
    status: "Paid",
    items: [
      { id: 1, name: "Office Supplies", quantity: 10, price: 250000, total: 2500000 },
      { id: 2, name: "Computer Equipment", quantity: 1, price: 2500000, total: 2500000 },
    ]
  },
  { 
    id: "S002", 
    contactId: 1, 
    date: "2023-08-15", 
    invoiceNumber: "INV-2023-015", 
    amount: 7500000, 
    status: "Paid",
    items: [
      { id: 1, name: "Software License", quantity: 5, price: 1500000, total: 7500000 },
    ]
  },
  { 
    id: "S003", 
    contactId: 2, 
    date: "2023-07-20", 
    invoiceNumber: "INV-2023-008", 
    amount: 3500000, 
    status: "Paid",
    items: [
      { id: 1, name: "Raw Materials", quantity: 100, price: 35000, total: 3500000 },
    ]
  },
];

const purchaseTransactions = [
  { 
    id: "P001", 
    contactId: 2, 
    date: "2023-06-10", 
    invoiceNumber: "PO-2023-001", 
    amount: 4500000, 
    status: "Paid",
    items: [
      { id: 1, name: "Industrial Equipment", quantity: 1, price: 4500000, total: 4500000 },
    ]
  },
  { 
    id: "P002", 
    contactId: 2, 
    date: "2023-07-05", 
    invoiceNumber: "PO-2023-012", 
    amount: 2200000, 
    status: "Paid",
    items: [
      { id: 1, name: "Office Furniture", quantity: 5, price: 440000, total: 2200000 },
    ]
  },
];

const ContactDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  
  // Find the contact by ID
  const contactId = parseInt(id || "0");
  const contact = contacts.find(c => c.id === contactId);
  
  if (!contact) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <Button variant="outline" onClick={() => navigate("/contacts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold">Contact not found</h2>
            <p className="mt-2 text-gray-500">The contact you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    );
  }
  
  // Filter transactions for this contact
  const sales = salesTransactions.filter(t => t.contactId === contactId);
  const purchases = purchaseTransactions.filter(t => t.contactId === contactId);
  
  // Calculate total income and expenses
  const totalIncome = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalExpenses = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <Button 
            variant="outline" 
            className="mb-4 bg-white" 
            onClick={() => navigate("/contacts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">{contact.name}</h1>
              <p className="text-white/80">{contact.number} • {contact.category}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Total Income
                </CardTitle>
                <CardDescription>Money received from this contact</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">Rp {formatPriceWithSeparator(totalIncome)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-red-500" />
                  Total Expenses
                </CardTitle>
                <CardDescription>Money paid to this contact</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">Rp {formatPriceWithSeparator(totalExpenses)}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="info">Contact Information</TabsTrigger>
              {contact.category === "Customer" && (
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
              )}
              {contact.category === "Vendor" && (
                <TabsTrigger value="supplied">Supplied Items</TabsTrigger>
              )}
              {contact.category === "Customer" || contact.category === "Vendor" ? null : (
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              )}
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                  <CardDescription>Basic information about {contact.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Email Address</h4>
                      <p>{contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Phone Number</h4>
                      <p>{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Address</h4>
                      <p>{contact.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {contact.category === "Customer" && (
              <TabsContent value="purchases">
                <Card>
                  <CardHeader>
                    <CardTitle>Items Purchased</CardTitle>
                    <CardDescription>Products purchased by {contact.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sales.flatMap(sale => 
                          sale.items.map(item => (
                            <TableRow key={`${sale.id}-${item.id}`}>
                              <TableCell>{sale.invoiceNumber}</TableCell>
                              <TableCell>{sale.date}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>Rp {formatPriceWithSeparator(item.price)}</TableCell>
                              <TableCell>Rp {formatPriceWithSeparator(item.total)}</TableCell>
                            </TableRow>
                          ))
                        )}
                        {sales.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                              No purchases found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {contact.category === "Vendor" && (
              <TabsContent value="supplied">
                <Card>
                  <CardHeader>
                    <CardTitle>Items Supplied</CardTitle>
                    <CardDescription>Products or services supplied by {contact.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PO #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchases.flatMap(purchase => 
                          purchase.items.map(item => (
                            <TableRow key={`${purchase.id}-${item.id}`}>
                              <TableCell>{purchase.invoiceNumber}</TableCell>
                              <TableCell>{purchase.date}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>Rp {formatPriceWithSeparator(item.price)}</TableCell>
                              <TableCell>Rp {formatPriceWithSeparator(item.total)}</TableCell>
                            </TableRow>
                          ))
                        )}
                        {purchases.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                              No supplied items found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>All financial transactions with {contact.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction Type</TableHead>
                        <TableHead>Reference #</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...sales.map(s => ({...s, type: "Sale"})), ...purchases.map(p => ({...p, type: "Purchase"}))]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>{transaction.invoiceNumber}</TableCell>
                            <TableCell className={transaction.type === "Sale" ? "text-green-600" : "text-red-600"}>
                              {transaction.type === "Sale" ? "+" : "-"}Rp {formatPriceWithSeparator(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {transaction.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      {sales.length === 0 && purchases.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                            No transaction history found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ContactDetails;
