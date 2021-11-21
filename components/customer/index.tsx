// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom, viewAtom, loadedHoldIdAtom } from "@/lib/atoms";

// Components
import CustomerTable from "./customer-table";
import CustomerScreen from "./customer-screen";
import CreateCustomerSidebar from "./create-customer-sidebar";
import HoldDialog from "@/components/hold/hold-dialog";

// REVIEW add customer-screen

export default function CustomersScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [view] = useAtom(viewAtom);
  const [loadedHoldId] = useAtom(loadedHoldIdAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "customers" ? "hidden" : ""
      }`}
    >
      {page === "customers" && <CustomerTable />}
      {loadedHoldId?.customers && <HoldDialog />}
      <CreateCustomerSidebar />
    </div>
  );
}
