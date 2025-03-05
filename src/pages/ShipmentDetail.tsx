
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Share2, Package, Truck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Purchase, PURCHASES_STORAGE_KEY } from "@/types/purchase";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

const ShipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipmentData = () => {
      try {
        const storedPurchases = localStorage.getItem(PURCHASES_STORAGE_KEY);
        if (storedPurchases) {
          const parsedPurchases = JSON.parse(storedPurchases);
          const foundShipment = parsedPurchases.find((p: any) => p.id === id && p.type === "shipment");
          
          if (foundShipment) {
            // Convert date strings to Date objects
            foundShipment.date = new Date(foundShipment.date);
            foundShipment.dueDate = foundShipment.dueDate ? new Date(foundShipment.dueDate) : null;
            setShipment(foundShipment);
          }
        }
      } catch (error) {
        console.error("Error loading shipment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!shipment) {
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
              <p className="text-center py-8">Shipment not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-6">
          <div className="flex items-center">
            <Link to="/purchases" className="mr-4">
              <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-white flex items-center">
                <Package className="mr-2 h-5 w-5" /> 
                {shipment.number}
              </h1>
              <p className="text-white/80 text-sm">Shipment created on {format(shipment.date, 'PP')}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Shipment Details</h2>
              <p className="text-gray-500">View and manage shipment information</p>
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
                <CardTitle>Shipment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Shipment Number</p>
                    <p className="font-medium">{shipment.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Creation Date</p>
                    <p className="font-medium">{format(shipment.date, 'PP')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected Delivery</p>
                    <p className="font-medium">{shipment.dueDate ? format(shipment.dueDate, 'PP') : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-sm inline-block mt-1 ${
                      shipment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tracking Information</CardTitle>
                <Truck className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-medium">TRK-{Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Carrier</p>
                    <p className="font-medium">Express Logistics</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-medium">Warehouse #3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <p>123 Delivery Street, Shipping City, 12345</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipment Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-right py-3 px-4">Quantity</th>
                        <th className="text-right py-3 px-4">Weight (kg)</th>
                        <th className="text-right py-3 px-4">Dimensions (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipment.items && shipment.items.length > 0 ? (
                        shipment.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{item.name}</td>
                            <td className="text-right py-3 px-4">{item.quantity}</td>
                            <td className="text-right py-3 px-4">{(item.quantity * 0.5).toFixed(1)}</td>
                            <td className="text-right py-3 px-4">30 x 20 x 15</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-500">
                            No items in this shipment
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span>{shipment.itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Weight</span>
                    <span>{(shipment.itemCount * 0.5).toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Class</span>
                    <span>Standard</span>
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
                    <p>{shipment.approver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                    <span className={`px-2 py-1 rounded-full text-xs inline-block ${
                      shipment.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      shipment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {shipment.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {shipment.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700">
                      Handle with care. Fragile items included in this shipment.
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

export default ShipmentDetail;
