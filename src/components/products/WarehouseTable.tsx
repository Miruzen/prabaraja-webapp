    import React from "react";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Warehouse } from "@/types/products";

    interface WarehouseTableProps {
    warehouses: Warehouse[];
    }

    export const WarehouseTable: React.FC<WarehouseTableProps> = ({ warehouses }) => {
    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Warehouse Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Total Stock</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {warehouses.map((warehouse) => (
            <TableRow key={warehouse.code}>
                <TableCell>{warehouse.code}</TableCell>
                <TableCell>{warehouse.name}</TableCell>
                <TableCell>{warehouse.location}</TableCell>
                <TableCell>{warehouse.totalStock}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    );
    };