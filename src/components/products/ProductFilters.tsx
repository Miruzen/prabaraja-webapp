    import React from "react";
    import { Search } from "lucide-react";
    import { Input } from "@/components/ui/input";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    interface ProductFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedProductCategory: string;
    setSelectedProductCategory: (category: string) => void;
    productCategories: string[];
    }

    export const ProductFilters: React.FC<ProductFiltersProps> = ({
    searchQuery,
    setSearchQuery,
    selectedProductCategory,
    setSelectedProductCategory,
    productCategories,
    }) => {
    return (
        <div className="flex gap-4 flex-1">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            />
        </div>
        <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
            <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
            {productCategories.map((category) => (
                <SelectItem key={category} value={category}>
                {category}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </div>
    );
    };