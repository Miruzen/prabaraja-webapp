
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, you would fetch the invoice details using the ID
  // This is mocked data for demonstration
  const invoice = {
    id: id,
    number: `Sales Invoice #${id}`,
    date: "18/02/2025",
    customer: "AABVCDD",
    dueDate: "18/02/2025",
    status: "Paid",
    items: [
      {
        name: "Product A",
        quantity: 2,
        price: "Rp 45.000",
        total: "Rp 90.000"
      },
      {
        name: "Service B",
        quantity: 1,
        price: "Rp 43.440",
        total: "Rp 43.440"
      }
    ],
    subtotal: "Rp 133.440",
    tax: "Rp 0",
    total: "Rp 133.440",
    balanceDue: "Rp 0",
    notes: "Thank you for your business!"
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] p-6">
          <div className="flex items-center">
            <Link to="/sales" className="mr-4">
              <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-white">{invoice.number}</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Invoice Details</h2>
              <p className="text-gray-500">View and manage invoice information</p>
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
              <Button variant="outline" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Invoice Number</p>
                    <p className="font-medium">{invoice.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{invoice.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{invoice.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm inline-block mt-1">
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
                <p className="font-medium">{invoice.customer}</p>
                <p className="text-gray-500">Customer ID: CUST-{id}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-right py-3 px-4">Quantity</th>
                        <th className="text-right py-3 px-4">Price</th>
                        <th className="text-right py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="text-right py-3 px-4">{item.quantity}</td>
                          <td className="text-right py-3 px-4">{item.price}</td>
                          <td className="text-right py-3 px-4">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{invoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{invoice.tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{invoice.total}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Balance Due</span>
                    <span>{invoice.balanceDue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{invoice.notes}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
