import { useState, useMemo } from "react";
import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom, clerkAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import {
  useInventory,
  useSaleTransactions,
  useVendorTotalPayments,
  useVendorTotalSales,
  useVendorFromContact,
} from "@/lib/swr-hooks";
import {
  getTotalPrice,
  getRemainingBalance,
  getTotalOwing,
} from "@/lib/data-functions";
import { saveTransactionToDatabase } from "@/lib/db-functions";

export default function Acct() {
  const [clerk] = useAtom(clerkAtom);
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const { inventory } = useInventory();
  const { vendor } = useVendorFromContact(cart?.contact_id);
  const { totalPayments } = useVendorTotalPayments(cart?.contact_id);
  const { totalSales } = useVendorTotalSales(cart?.contact_id);
  const { transactions, mutateSaleTransactions } = useSaleTransactions(
    cart?.id
  );
  const totalPrice = useMemo(() => getTotalPrice(cart, inventory), [
    cart,
    inventory,
  ]);
  const remainingBalance = useMemo(
    () => getRemainingBalance(totalPrice, transactions) / 100,
    [totalPrice, transactions]
  );
  const totalOwing = useMemo(
    () =>
      totalPayments && totalSales
        ? getTotalOwing(totalPayments, totalSales) / 100
        : 0,
    [totalPayments, totalSales]
  );
  const [acctPayment, setAcctPayment] = useState(`${remainingBalance}`);
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal
      open={paymentDialog === "acct"}
      onClose={() => setPaymentDialog(null)}
    >
      <div className="p-4">
        <div className="text-center text-4xl font-bold py-2">
          ACCOUNT PAYMENT
        </div>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={acctPayment}
          autoFocus
          selectOnFocus
          onChange={(e: any) => setAcctPayment(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          remainingBalance || 0
        ).toFixed(2)}`}</div>
        <div className="text-center font-bold">
          {`Remaining in account: $${totalOwing.toFixed(2)}`}
        </div>
        <div className="text-center text-xl font-bold my-4">
          {acctPayment === "" || parseFloat(acctPayment) === 0
            ? "..."
            : isNaN(parseFloat(acctPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(acctPayment) > remainingBalance
            ? `PAYMENT TOO HIGH`
            : totalOwing < parseFloat(acctPayment)
            ? `NOT ENOUGH IN ACCOUNT`
            : parseFloat(acctPayment) < remainingBalance
            ? `AMOUNT SHORT BY $${(
                remainingBalance - parseFloat(acctPayment)
              ).toFixed(2)}`
            : "ALL GOOD!"}
        </div>
        <button
          className="dialog-action__ok-button mb-8"
          disabled={
            submitting ||
            parseFloat(acctPayment) > remainingBalance ||
            totalOwing < parseFloat(acctPayment) ||
            parseFloat(acctPayment) === 0 ||
            acctPayment <= "" ||
            isNaN(parseFloat(acctPayment))
          }
          onClick={async () => {
            setSubmitting(true);
            await saveTransactionToDatabase(
              cart,
              clerk,
              acctPayment,
              remainingBalance,
              "acct",
              mutateSaleTransactions,
              setCart,
              vendor
            );
            setSubmitting(false);
            setPaymentDialog(null);
          }}
        >
          COMPLETE
        </button>
      </div>
    </Modal>
  );
}
