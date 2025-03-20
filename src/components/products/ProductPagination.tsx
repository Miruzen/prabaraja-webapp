    import React from "react";
    import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    } from "@/components/ui/pagination";

    interface ProductPaginationProps {
    currentPage: number;
    totalProductPages: number;
    setCurrentPage: (page: number) => void;
    }

    export const ProductPagination: React.FC<ProductPaginationProps> = ({
    currentPage,
    totalProductPages,
    setCurrentPage,
    }) => {
    return (
        <Pagination>
        <PaginationContent>
            <PaginationItem>
            <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
            </PaginationItem>
            {[...Array(totalProductPages)].map((_, i) => (
            <PaginationItem key={i + 1}>
                <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
                >
                {i + 1}
                </PaginationLink>
            </PaginationItem>
            ))}
            <PaginationItem>
            <PaginationNext
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalProductPages))}
                className={currentPage === totalProductPages ? "pointer-events-none opacity-50" : ""}
            />
            </PaginationItem>
        </PaginationContent>
        </Pagination>
    );
    };