    // src/components/purchases/tables/OrdersTable.tsx
    import { format } from "date-fns";
    import { Circle, MoreVertical, Edit, Trash } from "lucide-react";
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
    import { OrderPurchase } from "@/types/purchase";

    interface OrdersTableProps {
    orders: OrderPurchase[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    }

    export function OrdersTable({ orders, onDelete, onEdit }: OrdersTableProps) {
    return (
        <div className="border rounded-lg">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Discount Terms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {orders.map((order) => (
                <TableRow key={order.id}>
                <TableCell>
                    {order.orderDate ? format(order.orderDate, "dd/MM/yyyy") : "-"}
                </TableCell>
                <TableCell>
                    <Link
                    to={`/orders/${order.id}`}
                    className="text-indigo-600 hover:underline"
                    >
                    {order.number}
                    </Link>
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>
                    {order.discountTerms || (
                    <span className="text-gray-400">None</span>
                    )}
                </TableCell>
                <TableCell>
                    <span className={cn(
                    "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    {
                        "bg-yellow-100 text-yellow-800": order.status === "pending",
                        "bg-green-100 text-green-800": order.status === "completed",
                        "bg-red-100 text-red-800": order.status === "cancelled",
                    }
                    )}>
                    <Circle className={cn(
                        "h-2 w-2",
                        {
                        "fill-yellow-500": order.status === "pending",
                        "fill-green-500": order.status === "completed",
                        "fill-red-500": order.status === "cancelled",
                        }
                    )} />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </TableCell>
                <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    }).format(order.amount)}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit(order.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                        onClick={() => onDelete(order.id)}
                        className="text-red-600"
                        >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    );
    }