// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom } from "@/lib/atoms";

// Components
import CustomerTable from "./customer-table";
import CustomerScreen from "./customer-screen";

// REVIEW add customer-screen

export default function CustomersScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "customers" ? "hidden" : ""
      }`}
    >
      {page === "customers" && <CustomerTable />}
    </div>
  );
}
