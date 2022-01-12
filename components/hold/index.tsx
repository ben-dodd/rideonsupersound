// Packages
import { useAtom } from "jotai";

// DB
import {
  pageAtom,
  viewAtom,
  loadedHoldIdAtom,
  loadedSaleIdAtom,
} from "@/lib/atoms";

// Components
import HoldsTable from "./hold-table";
import SaleItemScreen from "@/components/sale-screen/sale-item-screen";
import CreateCustomerSidebar from "../customer/create-customer-sidebar";
import HoldDialog from "@/components/hold/hold-dialog";

export default function HoldsScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [view] = useAtom(viewAtom);
  const [loadedHoldId] = useAtom(loadedHoldIdAtom);
  const [loadedSaleId] = useAtom(loadedSaleIdAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "holds" ? "hidden" : ""
      }`}
    >
      {page === "holds" && <HoldsTable />}
      {loadedHoldId?.holds && <HoldDialog />}
      {loadedSaleId?.holds && <SaleItemScreen />}
      <CreateCustomerSidebar />
    </div>
  );
}
