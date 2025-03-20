    import { PackagePlus, Warehouse, CirclePlus } from "lucide-react";
    import { DropdownOption } from "@/types/products";

    export const dropdownOptions: DropdownOption[] = [
    {
        label: "Add New Product",
        action: () => console.log("Navigate to /add-product"),
        icon: <PackagePlus size={16} color="#F97316" />,
    },
    {
        label: "Add New Warehouse",
        action: () => console.log("Navigate to /add-warehouse"),
        icon: <Warehouse size={16} color="#8B5CF6" />,
    },
    {
        label: "Adjust Stock",
        action: () => console.log("Navigate to /adjust-stock"),
        icon: <CirclePlus size={16} color="#0EA5E9" />,
    },
    ];