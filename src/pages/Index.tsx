
import { Sidebar } from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-2">Hello, Lutfiana Widya</h1>
          <p className="text-gray-600 mb-8">What activity do you want to do?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Activity cards will be implemented in the next iteration */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
