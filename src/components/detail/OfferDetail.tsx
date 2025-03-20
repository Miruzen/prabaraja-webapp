
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Share2, Tag, Clock, PercentCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Purchase, PURCHASES_STORAGE_KEY } from "@/types/purchase";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

const OfferDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferData = () => {
      try {
        const storedPurchases = localStorage.getItem(PURCHASES_STORAGE_KEY);
        if (storedPurchases) {
          const parsedPurchases = JSON.parse(storedPurchases);
          const foundOffer = parsedPurchases.find((p: any) => p.id === id && p.type === "offer");
          
          if (foundOffer) {
            // Convert date strings to Date objects
            foundOffer.date = new Date(foundOffer.date);
            foundOffer.dueDate = foundOffer.dueDate ? new Date(foundOffer.dueDate) : null;
            setOffer(foundOffer);
          }
        }
      } catch (error) {
        console.error("Error loading offer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!offer) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <Link to="/purchases" className="mb-6 inline-block">
            <Button variant="outline" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchases
            </Button>
          </Link>
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8">Offer not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate standard price and discounted price
  const standardPrice = offer.items && offer.items.length > 0
    ? offer.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;

  // Apply a 15% discount as an example
  const discountPercentage = 15;
  const discountAmount = standardPrice * (discountPercentage / 100);
  const finalPrice = standardPrice - discountAmount;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
          <div className="flex items-center">
            <Link to="/purchases" className="mr-4">
              <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-white flex items-center">
                <Tag className="mr-2 h-5 w-5" /> 
                {offer.number}
              </h1>
              <p className="text-white/80 text-sm">Offer received on {format(offer.date, 'PP')}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Offer Details</h2>
              <p className="text-gray-500">View and manage supplier offer information</p>
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
                <CardTitle>Offer Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Offer Number</p>
                    <p className="font-medium">{offer.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Received Date</p>
                    <p className="font-medium">{format(offer.date, 'PP')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valid Until</p>
                    <p className="font-medium">{offer.dueDate ? format(offer.dueDate, 'PP') : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-sm inline-block mt-1 ${
                      offer.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Offer Terms</CardTitle>
                <PercentCircle className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-medium">XYZ Trading Group</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Offer Type</p>
                    <p className="font-medium">Volume Discount</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discount</p>
                    <p className="font-medium text-green-600">{discountPercentage}% off standard pricing</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Offer Conditions</p>
                    <p className="font-medium">Minimum order quantity: 50 units</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-500">Valid For</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <p className="font-medium">
                        {offer.dueDate 
                          ? `${Math.max(0, Math.ceil((offer.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days remaining` 
                          : 'Undefined period'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Offered Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-right py-3 px-4">Quantity</th>
                        <th className="text-right py-3 px-4">Standard Price</th>
                        <th className="text-right py-3 px-4">Offer Price</th>
                        <th className="text-right py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offer.items && offer.items.length > 0 ? (
                        offer.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{item.name}</td>
                            <td className="text-right py-3 px-4">{item.quantity}</td>
                            <td className="text-right py-3 px-4">{formatCurrency(item.price * 1.15)}</td>
                            <td className="text-right py-3 px-4">{formatCurrency(item.price)}</td>
                            <td className="text-right py-3 px-4">{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-gray-500">
                            No items in this offer
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Standard Price</span>
                    <span className="line-through text-gray-500">{formatCurrency(standardPrice * 1.15)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-{formatCurrency(standardPrice * 0.15)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Offer Price</span>
                    <span>{formatCurrency(standardPrice)}</span>
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
                    <p className="text-sm text-gray-500 mb-1">Approved By</p>
                    <p>{offer.approver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                    <span className={`px-2 py-1 rounded-full text-xs inline-block ${
                      offer.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      offer.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {offer.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {offer.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700">
                      This special offer is available for a limited time. Supplier has indicated willingness to negotiate further on bulk orders.
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

export default OfferDetail;
