    import { PackagePlus, Warehouse, CirclePlus } from "lucide-react";
    import { DropdownOption } from "@/types/products";
    import { useNavigate } from "react-router-dom";

    const DropdownComponent = () => {
    const navigate = useNavigate(); // useNavigate should be inside the component

    // Define dropdown options inside the component so navigate is accessible
    const dropdownOptions: DropdownOption[] = [
        {
        label: "Add New Product",
        action: () => navigate("/add-product"),
        icon: <PackagePlus size={16} color="#F97316" />,
        },
        {
        label: "Add New Warehouse",
        action: () => navigate("/add-warehouse"),
        icon: <Warehouse size={16} color="#8B5CF6" />,
        },
        {
        label: "Adjust Stock",
        action: () => navigate("/adjust-stock"),
        icon: <CirclePlus size={16} color="#0EA5E9" />,
        },
    ];

    return (
        <div>
        {dropdownOptions.map((option, index) => (
            <div
            key={index}
            onClick={option.action}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: "8px" }}
            >
            {option.icon}
            <span>{option.label}</span>
            </div>
        ))}
        </div>
    );
    };

    export default DropdownComponent;
