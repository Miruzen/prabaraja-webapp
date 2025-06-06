
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const ArusKas = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Arus Kas</h1>
          <p className="text-white/80">Cash flow statement</p>
        </div>

        {/* Content Area - Scrollable */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-medium mb-4">Cash Flow Statement</h2>
              <p className="text-gray-500">Cash flow report content will be displayed here.</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ArusKas;
