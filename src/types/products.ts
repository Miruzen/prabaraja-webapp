export interface Product {
    code: string;
    category: string;
    name: string;
    totalStock: number;
    minStock: number;
    unit: string;
    buyPrice: number;
    sellPrice: number;
    status: string;
    }
    
    export interface Warehouse {
        code: string;
        name: string;
        location: string;
        totalStock: number;
    }
    
    export interface DropdownOption {
        label: string;
        action: () => void;
        icon: JSX.Element;
    }