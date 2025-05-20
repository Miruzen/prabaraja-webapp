import { useParams, Link, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { getSalesInvoiceById, parseDateString } from "@/utils/invoiceUtils";
import { SalesData } from "@/data/salesData";

const SalesInvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to handle the back button click
  const handleGoBack = () => {
    // Check if we have a previous page in history
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
      navigate(-1); // Go back to previous page in history
    } else {
      // Default fallback to sales page if no history
      navigate("/sales");
    }
  };

  useEffect(() => {
    const fetchInvoiceData = () => {
      try {
        // Get the sales invoice by ID
        const foundInvoice = getSalesInvoiceById(id || "");
        setInvoice(foundInvoice || null);
      } catch (error) {
        console.error("Error loading sales invoice data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!invoice) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <Button variant="outline" size="sm" className="mb-6" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8">Sales Invoice not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Parse dates
  const invoiceDate = parseDateString(invoice.date);
  const dueDate = parseDateString(invoice.dueDate);

  // Calculate payment status
  const isPaid = invoice.status === "Paid";
  const isOverdue = !isPaid && new Date() > dueDate;

  // Parse total amount
  const totalAmount = invoice.total.replace("Rp ", "").replace(".", "");
  const totalValue = parseFloat(totalAmount.replace(",", "."));

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white mr-4" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-white flex items-center">
                <FileText className="mr-2 h-5 w-5" /> 
                {invoice.number}
              </h1>
              <p className="text-white/80 text-sm">Sales Invoice from {invoice.date}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Invoice Details</h2>
              <p className="text-gray-500">View and manage sales invoice information</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Invoice Summary</span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    isPaid 
                      ? "bg-green-100 text-green-800" 
                      : isOverdue
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {invoice.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Invoice Number</p>
                    <p className="font-medium">{invoice.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Invoice Date</p>
                    <p className="font-medium">{invoice.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                      {invoice.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-sm inline-block mt-1 ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      isOverdue ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-medium">{invoice.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer ID</p>
                    <p className="font-medium">C-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Information</p>
                    <p className="font-medium">customer@example.com</p>
                    <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-700">
                      123 Customer Street<br />
                      Customer City, CC 12345
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className={`font-medium ${isPaid ? 'text-green-600' : isOverdue ? 'text-red-600' : ''}`}>
                      {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">Bank Transfer</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium text-lg">{invoice.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Balance Due</p>
                    <p className={`font-medium ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                      {isPaid ? 'Rp 0' : invoice.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700">
                      Thank you for your business! Please reference invoice number in all communications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoiceDetail;
