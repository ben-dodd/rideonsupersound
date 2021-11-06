// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom, loadedSaleObjectAtom } from "@/lib/atoms";

// Components
import SaleScreen from "@/components/sale-screen";
import SaleTable from "@/components/sale/sale-table";

// REVIEW add filter buttons to table for laybys etc.

export default function SalesScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [loadedSale] = useAtom(loadedSaleObjectAtom);

  // SWR
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "sales" ? "hidden" : ""
      }`}
    >
      {" "}
      {page === "sales" && <SaleTable />}
      {loadedSale?.id && <SaleScreen isNew={false} />}
    </div>
  );
}
