// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom } from "@/lib/atoms";

// Components
import PaymentTable from "./payment-table";
import BatchPaymentDialog from "./batch-payment-dialog";
import CashPaymentDialog from "./cash-payment-dialog";

export default function PaymentsScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "payments" ? "hidden" : ""
      }`}
    >
      {page === "payments" && <PaymentTable />}
      <BatchPaymentDialog />
      <CashPaymentDialog />
    </div>
  );
}
