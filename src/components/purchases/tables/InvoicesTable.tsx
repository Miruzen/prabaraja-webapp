    // src/components/purchases/tables/InvoicesTable.tsx
    import { format } from "date-fns";
    import { Circle, MoreVertical, Edit, CreditCard, Trash, Check, X } from "lucide-react";
    import { Link } from "react-router-dom";
    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table";
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
    import { Button } from "@/components/ui/button";
    import { cn } from "@/lib/utils";
    import { InvoicePurchase } from "@/types/purchase";

    interface InvoicesTableProps {
    invoices: InvoicePurchase[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onReceivePayment?: (id: string) => void;
    }

    export function InvoicesTable({ 
    invoices, 
    onDelete, 
    onEdit,
    onReceivePayment 
    }: InvoicesTableProps) {
    return (
        <div className="border rounded-lg">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {invoices.map((invoice) => {
                const paidAmount = invoice.paidAmount || 0;
                const balance = invoice.amount - paidAmount;

                return (
                <TableRow key={invoice.id}>
                    <TableCell>{format(invoice.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                    <Link
                        to={`/invoices/${invoice.id}`}
                        className="text-indigo-600 hover:underline"
                    >
                        {invoice.number}
                    </Link>
                    </TableCell>
                    <TableCell>
                    {invoice.dueDate ? format(invoice.dueDate, "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                    <span className={cn(
                        "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                        {
                        "bg-yellow-100 text-yellow-800": invoice.status === "pending",
                        "bg-green-100 text-green-800": invoice.status === "completed",
                        "bg-red-100 text-red-800": invoice.status === "cancelled",
                        "bg-blue-100 text-blue-800": invoice.status === "Half-paid",
                        }
                    )}>
                        <Circle className={cn(
                        "h-2 w-2",
                        {
                            "fill-yellow-500": invoice.status === "pending",
                            "fill-green-500": invoice.status === "completed",
                            "fill-red-500": invoice.status === "cancelled",
                            "fill-blue-500": invoice.status === "Half-paid",
                        }
                        )} />
                        {invoice.status}
                    </span>
                    </TableCell>
                    <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                    }).format(invoice.amount)}
                    </TableCell>
                    <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                    }).format(paidAmount)}
                    </TableCell>
                    <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                    }).format(balance)}
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit(invoice.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        
                        {(invoice.status === "pending" || invoice.status === "Half-paid") && (
                            <DropdownMenuItem 
                            onClick={() => onReceivePayment?.(invoice.id)}
                            className="text-green-600"
                            >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Receive Payment
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem 
                            onClick={() => onDelete(invoice.id)}
                            className="text-red-600"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                );
            })}
            </TableBody>
        </Table>
        </div>
    );
    }