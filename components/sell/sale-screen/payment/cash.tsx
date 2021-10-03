import { useState } from "react";
import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom, clerkAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { useSaleTransactions } from "@/lib/swr-hooks";
import { saveSaleTransaction } from "@/lib/db-functions";
import CloseButton from "@/components/button/close-button";

export default function Cash() {
  const [clerk] = useAtom(clerkAtom);
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const { mutateSaleTransactions } = useSaleTransactions(cart?.id);
  const [cashReceived, setCashReceived] = useState(
    `${paymentDialog?.remainingBalance}`
  );
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal
      open={paymentDialog?.method === "cash"}
      onClose={() => setPaymentDialog(null)}
    >
      <CloseButton closeFunction={() => setPaymentDialog(null)} />
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
          paymentDialog?.remainingBalance || 0
        ).toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cashReceived === "" || parseFloat(cashReceived) === 0
            ? "..."
            : isNaN(parseFloat(cashReceived))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cashReceived) > paymentDialog?.remainingBalance
            ? `GIVE $${(
                parseFloat(cashReceived) - paymentDialog?.remainingBalance
              ).toFixed(2)} IN CHANGE`
            : parseFloat(cashReceived) < paymentDialog?.remainingBalance
            ? `AMOUNT SHORT BY $${(
                paymentDialog?.remainingBalance - parseFloat(cashReceived)
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
            await saveSaleTransaction(
              cart,
              clerk,
              cashReceived,
              paymentDialog?.remainingBalance,
              "cash",
              mutateSaleTransactions,
              setCart
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
