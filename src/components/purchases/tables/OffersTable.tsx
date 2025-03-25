    // src/components/purchases/tables/OffersTable.tsx
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
    import { OfferPurchase } from "@/types/purchase";

    interface OffersTableProps {
    offers: OfferPurchase[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    }

    export function OffersTable({ offers, onDelete, onEdit }: OffersTableProps) {
    return (
        <div className="border rounded-lg">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Offer #</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Discount Terms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {offers.map((offer) => (
                <TableRow key={offer.id}>
                <TableCell>{format(offer.date, "dd/MM/yyyy")}</TableCell>
                <TableCell>
                    <Link
                    to={`/offers/${offer.id}`}
                    className="text-indigo-600 hover:underline"
                    >
                    {offer.number}
                    </Link>
                </TableCell>
                <TableCell className={cn({
                    "text-red-500": offer.expiryDate && new Date() > offer.expiryDate
                })}>
                    {offer.expiryDate ? format(offer.expiryDate, "dd/MM/yyyy") : "-"}
                </TableCell>
                <TableCell>{offer.discountTerms}</TableCell>
                <TableCell>
                    <span className={cn(
                    "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    {
                        "bg-yellow-100 text-yellow-800": offer.status === "pending",
                        "bg-green-100 text-green-800": offer.status === "completed",
                        "bg-red-100 text-red-800": offer.status === "cancelled",
                    }
                    )}>
                    <Circle className={cn(
                        "h-2 w-2",
                        {
                        "fill-yellow-500": offer.status === "pending",
                        "fill-green-500": offer.status === "completed",
                        "fill-red-500": offer.status === "cancelled",
                        }
                    )} />
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </span>
                </TableCell>
                <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    }).format(offer.amount)}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit(offer.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                        onClick={() => onDelete(offer.id)}
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