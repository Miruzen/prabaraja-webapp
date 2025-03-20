    import React from "react";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Check, X } from "lucide-react";
    import { Product } from "@/types/products";
    import { formatCurrency } from "@/lib/utils";

    interface ProductTableProps {
    products: Product[];
    }

    export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Product Code</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Total Stock</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map((product) => (
            <TableRow key={product.code}>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.totalStock}</TableCell>
                <TableCell>{product.minStock}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>{formatCurrency(product.buyPrice)}</TableCell>
                <TableCell>{formatCurrency(product.sellPrice)}</TableCell>
                <TableCell>
                <span
                    className={`flex items-center gap-2 ${
                    product.status === "In Stock" ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {product.status === "In Stock" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {product.status}
                </span>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    );
    };