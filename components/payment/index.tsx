import PaymentTable from "./payment-table";
import BatchPaymentDialog from "./batch-payment-dialog";
import CashPaymentDialog from "./cash-payment-dialog";
import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

export default function PaymentsScreen() {
  const [page] = useAtom(pageAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "payments" ? "hidden" : ""
      }`}
    >
      <PaymentTable />
      <BatchPaymentDialog />
      <CashPaymentDialog />
    </div>
  );
}
