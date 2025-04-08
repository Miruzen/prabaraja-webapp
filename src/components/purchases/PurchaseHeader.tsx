
import { Link } from "react-router-dom";

export function PurchaseHeader() {
  return (
    <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
      <div className="max-w-full mx-auto">
        <div>
          <h1 className="text-2xl font-semibold text-white">Purchases</h1>
          <p className="text-white/80">Manage your purchase transactions</p>
        </div>
      </div>
    </div>
  );
}
