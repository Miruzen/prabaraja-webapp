    import { useState } from "react";
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
    import { Wallet, FileText, Banknote, ArrowLeft, Trash, Link as LinkIcon, UploadCloud } from "lucide-react";
    import { Link } from "react-router-dom";
    import { formatCurrency, formatInputCurrency, parseInputCurrency } from "@/lib/utils";

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

    interface Attachment {
    type: "file" | "link";
    name: string;
    url?: string;
    file?: File;
    }

    export function ReceivePaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [paymentAmount, setPaymentAmount] = useState<string>("");
    const [proformaItems, setProformaItems] = useState<InvoiceItem[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [linkUrl, setLinkUrl] = useState<string>("");

    if (!state?.transaction) {
        return (
        <div className="flex items-center justify-center h-screen text-center">
            No transaction data found.
        </div>
        );
    }

    const { items } = state.transaction;

    // Calculate total invoice amount
    const totalInvoiceAmount = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseInputCurrency(paymentAmount);
        console.log("Payment Amount (Number):", numericAmount);
        console.log("Payment received!");
        navigate("/purchases");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 10 * 1024 * 1024) {
        setAttachments((prev) => [
            ...prev,
            { type: "file", name: file.name, file },
        ]);
        } else {
        alert("File size must be less than 10MB.");
        }
    };

    const handleAddLink = () => {
        if (linkUrl) {
        setAttachments((prev) => [
            ...prev,
            { type: "link", name: "External Link", url: linkUrl },
        ]);
        setLinkUrl("");
        }
    };

    const handleDeleteProformaItem = (index: number) => {
        const newItems = [...proformaItems];
        newItems.splice(index, 1);
        setProformaItems(newItems);
    };

    const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = parseInputCurrency(rawValue); // Convert formatted string to number

        // If the input exceeds the total invoice amount, correct it to the total invoice amount
        const correctedValue = Math.min(numericValue, totalInvoiceAmount);

        // Format the corrected value back to a string with thousand separators
        const formattedValue = formatInputCurrency(correctedValue.toString());
        setPaymentAmount(formattedValue);
    };

    const isFormValid = () => {
        if (paymentMethod === "cash" || paymentMethod === "bank") {
        return paymentAmount.trim() !== "";
        } else if (paymentMethod === "proforma") {
        return proformaItems.every(
            (item) => item.name.trim() !== "" && item.quantity > 0 && item.price > 0
        );
        }
        return false;
    };

    return (
        <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto">
            <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
            <div className="flex items-center">
                <Link
                to="/purchases"
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                <ArrowLeft className="h-6 w-6 text-white" />
                </Link>
                <div className="ml-4">
                <h1 className="text-2xl font-semibold text-white">Receive Payment</h1>
                <p className="text-white/80">Record payment for the selected invoice</p>
                </div>
            </div>
            </div>

            <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                            {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>

                <div className="space-y-4">
                <div>
                    <label className="block text-lg font-medium mb-2">Payment Method</label>
                    <Select onValueChange={(value) => setPaymentMethod(value)}>
                    <SelectTrigger className="w-full rounded-xl focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-green-500" />
                            <span>Cash</span>
                        </div>
                        </SelectItem>
                        <SelectItem value="proforma">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>Proforma</span>
                        </div>
                        </SelectItem>
                        <SelectItem value="bank">
                        <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-purple-500" />
                            <span>Bank</span>
                        </div>
                        </SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                {paymentMethod === "cash" || paymentMethod === "bank" ? (
                    <div className="space-y-4">
                    <div>
                        <label className="block text-lg font-medium mb-2">Payment Amount (IDR)</label>
                        <Input
                        type="text"
                        placeholder={`Max amount: ${formatCurrency(totalInvoiceAmount)}`} // Show max amount in placeholder
                        value={paymentAmount}
                        onChange={handlePaymentAmountChange}
                        className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2">Attachment (Optional, max 10MB)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <UploadCloud className="h-12 w-12 text-gray-400" />
                            <p className="text-gray-500">Drop files to upload or click here</p>
                            <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            />
                            <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-indigo-600 hover:text-indigo-700"
                            >
                            Browse files
                            </label>
                        </div>
                        <div className="mt-4">
                            <Input
                            type="text"
                            placeholder="Or paste a link (YouTube, Vimeo)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                            <Button
                            type="button"
                            onClick={handleAddLink}
                            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                            Add Link
                            </Button>
                        </div>
                        <div className="mt-4 space-y-2">
                            {attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                                <div className="flex items-center gap-2">
                                {attachment.type === "file" ? (
                                    <FileText className="h-4 w-4 text-blue-500" />
                                ) : (
                                    <LinkIcon className="h-4 w-4 text-green-500" />
                                )}
                                <span>{attachment.name}</span>
                                </div>
                                <Button
                                type="button"
                                onClick={() => {
                                    const newAttachments = [...attachments];
                                    newAttachments.splice(index, 1);
                                    setAttachments(newAttachments);
                                }}
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                >
                                <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>
                ) : paymentMethod === "proforma" ? (
                    <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Proforma Items</h2>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {proformaItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                <Input
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(e) => {
                                    const newItems = [...proformaItems];
                                    newItems[index].name = e.target.value;
                                    setProformaItems(newItems);
                                    }}
                                />
                                </TableCell>
                                <TableCell>
                                <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => {
                                    const newItems = [...proformaItems];
                                    newItems[index].quantity = parseInt(e.target.value);
                                    setProformaItems(newItems);
                                    }}
                                />
                                </TableCell>
                                <TableCell>
                                <Input
                                    type="number"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => {
                                    const newItems = [...proformaItems];
                                    newItems[index].price = parseFloat(e.target.value);
                                    setProformaItems(newItems);
                                    }}
                                />
                                </TableCell>
                                <TableCell>
                                <Button
                                    type="button"
                                    onClick={() => handleDeleteProformaItem(index)}
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                        <Button
                        type="button"
                        onClick={() =>
                            setProformaItems([...proformaItems, { name: "", quantity: 1, price: 0 }])
                        }
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                        Add Item
                        </Button>
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2">Attachment (Optional, max 10MB)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <UploadCloud className="h-12 w-12 text-gray-400" />
                            <p className="text-gray-500">Drop files to upload or click here</p>
                            <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            />
                            <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-indigo-600 hover:text-indigo-700"
                            >
                            Browse files
                            </label>
                        </div>
                        <div className="mt-4">
                            <Input
                            type="text"
                            placeholder="Or paste a link (YouTube, Vimeo)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                            <Button
                            type="button"
                            onClick={handleAddLink}
                            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                            Add Link
                            </Button>
                        </div>
                        <div className="mt-4 space-y-2">
                            {attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                                <div className="flex items-center gap-2">
                                {attachment.type === "file" ? (
                                    <FileText className="h-4 w-4 text-blue-500" />
                                ) : (
                                    <LinkIcon className="h-4 w-4 text-green-500" />
                                )}
                                <span>{attachment.name}</span>
                                </div>
                                <Button
                                type="button"
                                onClick={() => {
                                    const newAttachments = [...attachments];
                                    newAttachments.splice(index, 1);
                                    setAttachments(newAttachments);
                                }}
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                >
                                <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>
                ) : null}
                </div>

                <div className="flex justify-end">
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 h-auto rounded-xl"
                    disabled={!isFormValid()}
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