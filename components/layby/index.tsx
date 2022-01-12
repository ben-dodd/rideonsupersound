// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom, loadedSaleIdAtom } from "@/lib/atoms";

// Components
import SaleItemScreen from "@/components/sale-screen/sale-item-screen";
import LaybyTable from "@/components/layby/layby-table";

// REVIEW add filter buttons to table for laybys etc.

export default function LaybyScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [loadedSaleId] = useAtom(loadedSaleIdAtom);

  // SWR
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "laybys" ? "hidden" : ""
      }`}
    >
      {" "}
      {page === "laybys" && <LaybyTable />}
      {loadedSaleId[page] && <SaleItemScreen />}
    </div>
  );
}
