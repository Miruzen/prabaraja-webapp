    import { useNavigate, useLocation } from "react-router-dom";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";
    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table";
    import { Sidebar } from "@/components/Sidebar";
    import { Wallet, FileText, Banknote } from "lucide-react"; // Import icons

    interface InvoiceItem {
    name: string;
    quantity: number;
    price: number;
    }

    interface LocationState {
    transaction: {
        id: string;
        items: InvoiceItem[];
    };
    }

    export function ReceivePaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    if (!state?.transaction) {
        return <div>No transaction data found.</div>;
    }

    const { items } = state.transaction;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Payment received!");
        navigate("/purchases"); // Redirect back to purchases page after submission
    };

    return (
        <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
            <h1 className="text-2xl font-semibold text-white">Receive Payment</h1>
            <p className="text-white/80">Record payment for the selected invoice</p>
            </div>

            {/* Form Content */}
            <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Top Part: Payment Details */}
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <Select>
                    <SelectTrigger className="w-full rounded-xl focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Cash Option */}
                        <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-green-500" /> {/* Icon for Cash */}
                            <span>Cash</span>
                        </div>
                        </SelectItem>

                        {/* Proforma Option */}
                        <SelectItem value="proforma">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" /> {/* Icon for Proforma */}
                            <span>Proforma</span>
                        </div>
                        </SelectItem>

                        {/* Bank Option */}
                        <SelectItem value="bank">
                        <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-purple-500" /> {/* Icon for Bank */}
                            <span>Bank</span>
                        </div>
                        </SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">From</label>
                    <Input
                    placeholder="Enter payer's name or details"
                    className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <Input
                    placeholder="Enter recipient's name or details"
                    className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                </div>

                {/* Middle Part: Item List Table */}
                <div>
                <h2 className="text-lg font-semibold mb-4">Item List</h2>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Price</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                            {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                            }).format(item.price * item.quantity)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 h-auto rounded-xl"
                >
                    Submit Payment
                </Button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
    }