    import React from "react";

    interface TabNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    }

    export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border p-4 rounded-md mb-6" style={{ backgroundColor: "#F4F2FF" }}>
        <div className="flex gap-6">
            <button
            className={`px-4 py-2 rounded-md ${activeTab === "Products" ? "bg-white text-indigo-500 border-b-4 border-indigo-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("Products")}
            >
            Products
            </button>
            <button
            className={`px-4 py-2 rounded-md ${activeTab === "Warehouses" ? "bg-white text-indigo-500 border-b-4 border-indigo-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("Warehouses")}
            >
            Warehouses
            </button>
        </div>
        </div>
    );
    };