import { Sidebar } from "@/components/Sidebar";

const MasterData = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Master Data</h1>
          <p className="text-white/80">Manage your master data and reference information</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Chart of Accounts</h3>
              <p className="text-gray-600 mb-4">Manage your accounting chart of accounts structure</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Manage COA
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Tax Settings</h3>
              <p className="text-gray-600 mb-4">Configure tax rates and calculation methods</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Manage Taxes
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <p className="text-gray-600 mb-4">Manage product and expense categories</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Manage Categories
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Units</h3>
              <p className="text-gray-600 mb-4">Define measurement units for products</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Manage Units
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Payment Terms</h3>
              <p className="text-gray-600 mb-4">Configure payment terms and conditions</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Manage Terms
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">User Roles</h3>
              <p className="text-gray-600 mb-4">Manage user roles and permissions</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Manage Roles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterData;