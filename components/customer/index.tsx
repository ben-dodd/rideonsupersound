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
import CustomerTable from "./customer-table";
import CustomerScreen from "./customer-screen";
import SaleItemScreen from "@/components/sale-screen/sale-item-screen";
import CreateCustomerSidebar from "./create-customer-sidebar";
import HoldDialog from "@/components/hold/hold-dialog";

// REVIEW add customer-screen

export default function CustomersScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [view] = useAtom(viewAtom);
  const [loadedHoldId] = useAtom(loadedHoldIdAtom);
  const [loadedSaleId] = useAtom(loadedSaleIdAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "customers" ? "hidden" : ""
      }`}
    >
      {page === "customers" && <CustomerTable />}
      {loadedHoldId?.customers && <HoldDialog />}
      {loadedSaleId?.customers && <SaleItemScreen />}
      <CreateCustomerSidebar />
    </div>
  );
}
