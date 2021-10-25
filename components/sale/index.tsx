import SaleScreen from "@/components/sale-screen";
import SaleTable from "@/components/sale/sale-table";

export default function SalesScreen() {
  return (
    <div className="flex relative overflow-x-hidden bg-white text-black">
      <SaleTable />
      <SaleScreen isNew={false} />
    </div>
  );
}
