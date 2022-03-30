// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom, viewAtom } from "@/lib/atoms";

// Components
import PaymentTable from "./payment-table";
import CashPaymentDialog from "./cash-payment-dialog";
import BatchPaymentScreen from "./batch-payment-screen";
import TransferVendorPaymentDialog from "./transfer-payment-dialog";

export default function PaymentsScreen() {
  // Atoms
  const [page] = useAtom(pageAtom);
  const [view] = useAtom(viewAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "payments" ? "hidden" : ""
      }`}
    >
      {page === "payments" && <PaymentTable />}
      {/* {view?.batchVendorPaymentDialog && <BatchPaymentDialog />} */}
      {view?.cashVendorPaymentDialog && <CashPaymentDialog />}
      {view?.batchVendorPaymentScreen && <BatchPaymentScreen />}
      {view?.transferVendorPaymentDialog && <TransferVendorPaymentDialog />}
    </div>
  );
}
