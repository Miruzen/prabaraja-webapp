    // src/components/purchases/tables/ShipmentsTable.tsx
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
    import { ShipmentPurchase } from "@/types/purchase";
    import { cn } from "@/lib/utils";

    interface ShipmentsTableProps {
    shipments: ShipmentPurchase[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    }

    export function ShipmentsTable({ shipments, onDelete, onEdit }: ShipmentsTableProps) {
    return (
        <div className="border rounded-lg">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Tracking #</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Shipping Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                <TableCell>{format(shipment.date, "dd/MM/yyyy")}</TableCell>
                <TableCell>
                    <Link 
                    to={`/shipments/${shipment.id}`}
                    className="text-indigo-600 hover:underline"
                    >
                    {shipment.trackingNumber}
                    </Link>
                </TableCell>
                <TableCell>{shipment.carrier}</TableCell>
                <TableCell>{format(shipment.shippingDate, "dd/MM/yyyy")}</TableCell>
                <TableCell>
                    <span className={cn(
                    "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    {
                        "bg-yellow-100 text-yellow-800": shipment.status === "pending",
                        "bg-green-100 text-green-800": shipment.status === "completed",
                        "bg-red-100 text-red-800": shipment.status === "cancelled",
                    }
                    )}>
                    <Circle className={cn(
                        "h-2 w-2",
                        {
                        "fill-yellow-500 text-yellow-500": shipment.status === "pending",
                        "fill-green-500 text-green-500": shipment.status === "completed",
                        "fill-red-500 text-red-500": shipment.status === "cancelled",
                        }
                    )} />
                    {shipment.status}
                    </span>
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit(shipment.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                        onClick={() => onDelete(shipment.id)}
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