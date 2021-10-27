import SaleScreen from "@/components/sale-screen";
import SaleTable from "@/components/sale/sale-table";
import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

export default function SalesScreen() {
  const [page] = useAtom(pageAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "sales" ? "hidden" : ""
      }`}
    >
      {" "}
      <SaleTable />
      <SaleScreen isNew={false} />
    </div>
  );
}
