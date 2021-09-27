import { useState, useMemo } from "react";
import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom, clerkAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { useInventory, useSaleTransactions } from "@/lib/swr-hooks";
import { getTotalPrice, getRemainingBalance } from "@/lib/data-functions";
import { saveTransactionToDatabase } from "@/lib/db-functions";

export default function Cash() {
  const [clerk] = useAtom(clerkAtom);
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  const [cart] = useAtom(cartAtom);
  const { inventory } = useInventory();
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
  const [cashReceived, setCashReceived] = useState(`${remainingBalance}`);
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal
      open={paymentDialog === "cash"}
      onClose={() => setPaymentDialog(null)}
    >
      <div className="p-4">
        <div className="text-center text-4xl font-bold py-2">CASH PAYMENT</div>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={cashReceived}
          autoFocus
          selectOnFocus
          onChange={(e: any) => setCashReceived(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          remainingBalance || 0
        ).toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cashReceived === "" || parseFloat(cashReceived) === 0
            ? "..."
            : isNaN(parseFloat(cashReceived))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cashReceived) > remainingBalance
            ? `GIVE $${(parseFloat(cashReceived) - remainingBalance).toFixed(
                2
              )} IN CHANGE`
            : parseFloat(cashReceived) < remainingBalance
            ? `AMOUNT SHORT BY $${(
                remainingBalance - parseFloat(cashReceived)
              ).toFixed(2)}`
            : "ALL GOOD!"}
        </div>
        <button
          className="dialog-action__ok-button mb-8"
          disabled={
            submitting ||
            parseFloat(cashReceived) === 0 ||
            cashReceived <= "" ||
            isNaN(parseFloat(cashReceived))
          }
          onClick={async () => {
            setSubmitting(true);
            await saveTransactionToDatabase(
              cart,
              clerk,
              cashReceived,
              remainingBalance,
              "cash",
              mutateSaleTransactions
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
