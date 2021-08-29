import Pay from "./pay";
import SaleSummary from "./sale-summary";

export default function SaleScreen() {
  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-blue-200 text-black">
      <div className="flex justify-between mb-2 relative">
        <div className="text-lg my-2 tracking-wide self-center">New Sale</div>
      </div>
      <Pay />
      <SaleSummary />
    </div>
  );
}
