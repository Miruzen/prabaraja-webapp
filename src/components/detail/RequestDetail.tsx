
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Share2, FileQuestion, CheckSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Purchase, PURCHASES_STORAGE_KEY } from "@/types/purchase";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestData = () => {
      try {
        const storedPurchases = localStorage.getItem(PURCHASES_STORAGE_KEY);
        if (storedPurchases) {
          const parsedPurchases = JSON.parse(storedPurchases);
          const foundRequest = parsedPurchases.find((p: any) => p.id === id && p.type === "request");
          
          if (foundRequest) {
            // Convert date strings to Date objects
            foundRequest.date = new Date(foundRequest.date);
            foundRequest.dueDate = foundRequest.dueDate ? new Date(foundRequest.dueDate) : null;
            setRequest(foundRequest);
          }
        }
      } catch (error) {
        console.error("Error loading request data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!request) {
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
              <p className="text-center py-8">Request not found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const requestStages = [
    { name: "Submitted", completed: true, date: format(request.date, 'PP') },
    { name: "Under Review", completed: request.status !== "pending", date: format(new Date(request.date.getTime() + 86400000), 'PP') },
    { name: "Approved", completed: request.status === "completed", date: request.status === "completed" ? format(new Date(request.date.getTime() + 172800000), 'PP') : "" },
    { name: "Fulfilled", completed: false, date: "" }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
          <div className="flex items-center">
            <Link to="/purchases" className="mr-4">
              <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-white flex items-center">
                <FileQuestion className="mr-2 h-5 w-5" /> 
                {request.number}
              </h1>
              <p className="text-white/80 text-sm">Purchase Request submitted on {format(request.date, 'PP')}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Request Details</h2>
              <p className="text-gray-500">View and manage purchase request information</p>
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
                <CardTitle>Request Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Request Number</p>
                    <p className="font-medium">{request.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submission Date</p>
                    <p className="font-medium">{format(request.date, 'PP')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Required By</p>
                    <p className="font-medium">{request.dueDate ? format(request.dueDate, 'PP') : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-sm inline-block mt-1 ${
                      request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Request Progress</CardTitle>
                <Clock className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-px bg-gray-200"></div>
                  <ul className="space-y-6">
                    {requestStages.map((stage, index) => (
                      <li key={index} className="relative pl-10">
                        <div className={`absolute left-0 top-1.5 h-7 w-7 rounded-full border-2 flex items-center justify-center ${
                          stage.completed 
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-500' 
                            : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}>
                          {stage.completed && <CheckSquare className="h-4 w-4" />}
                        </div>
                        <div>
                          <h4 className={`font-medium ${stage.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {stage.name}
                          </h4>
                          {stage.date && (
                            <p className="text-sm text-gray-500">{stage.date}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requested Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-right py-3 px-4">Quantity</th>
                        <th className="text-right py-3 px-4">Est. Unit Cost</th>
                        <th className="text-right py-3 px-4">Est. Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.items && request.items.length > 0 ? (
                        request.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{item.name}</td>
                            <td className="text-right py-3 px-4">{item.quantity}</td>
                            <td className="text-right py-3 px-4">{formatCurrency(item.price)}</td>
                            <td className="text-right py-3 px-4">{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-500">
                            No items in this request
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Total Requested Items</span>
                    <span>{request.itemCount}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Estimated Total Cost</span>
                    <span>
                      {request.items && request.items.length > 0 
                        ? formatCurrency(request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
                        : formatCurrency(0)}
                    </span>
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
                    <p className="text-sm text-gray-500 mb-1">Requested By</p>
                    <p>Mark Johnson (Engineering Department)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Approved By</p>
                    <p>{request.approver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                    <span className={`px-2 py-1 rounded-full text-xs inline-block ${
                      request.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {request.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Justification</p>
                    <p className="text-gray-700">
                      These items are required for the upcoming project XYZ. Current inventory is depleted and we need these supplies to continue operations.
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

export default RequestDetail;
