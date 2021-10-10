import { useState } from "react";
import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom, clerkAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { useSaleTransactionsForSale } from "@/lib/swr-hooks";
import { saveSaleTransaction } from "@/lib/db-functions";
import CloseButton from "@/components/button/close-button";

export default function Cash() {
  const [clerk] = useAtom(clerkAtom);
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const { mutateSaleTransactions } = useSaleTransactionsForSale(cart?.id);

  const [cardPayment, setCardPayment] = useState(
    `${paymentDialog?.remainingBalance}`
  );
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal
      open={paymentDialog?.method === "card"}
      onClose={() => setPaymentDialog(null)}
    >
      <CloseButton closeFunction={() => setPaymentDialog(null)} />
      <div className="p-4">
        <div className="text-center text-4xl font-bold py-2">CARD PAYMENT</div>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={cardPayment}
          autoFocus
          selectOnFocus
          onChange={(e: any) => setCardPayment(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          paymentDialog?.remainingBalance || 0
        ).toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cardPayment === "" || parseFloat(cardPayment) === 0
            ? "..."
            : isNaN(parseFloat(cardPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cardPayment) > paymentDialog?.remainingBalance
            ? `PAYMENT TOO HIGH`
            : parseFloat(cardPayment) < paymentDialog?.remainingBalance
            ? `AMOUNT SHORT BY $${(
                paymentDialog?.remainingBalance - parseFloat(cardPayment)
              ).toFixed(2)}`
            : "ALL GOOD!"}
        </div>
        <button
          className="dialog-action__ok-button mb-8"
          disabled={
            submitting ||
            parseFloat(cardPayment) === 0 ||
            cardPayment <= "" ||
            isNaN(parseFloat(cardPayment))
          }
          onClick={async () => {
            setSubmitting(true);
            await saveSaleTransaction(
              cart,
              clerk,
              cardPayment,
              paymentDialog?.remainingBalance,
              "card",
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
