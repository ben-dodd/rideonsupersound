import { useState } from "react";
import Modal from "@/components/container/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom, saleAtom, clerkAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { useSaleTransactionsForSale } from "@/lib/swr-hooks";
import { saveSaleTransaction } from "@/lib/db-functions";
import { ModalButton } from "@/lib/types";

export default function Cash({ isCart }) {
  const [clerk] = useAtom(clerkAtom);
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  const [cart, setCart] = useAtom(isCart ? cartAtom : saleAtom);
  const { mutateSaleTransactions } = useSaleTransactionsForSale(cart?.id);
  const [cashReceived, setCashReceived] = useState(
    `${paymentDialog?.remainingBalance}`
  );
  const [submitting, setSubmitting] = useState(false);
  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(cashReceived) === 0 ||
        cashReceived <= "" ||
        isNaN(parseFloat(cashReceived)),
      onClick: async () => {
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
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={paymentDialog?.method === "cash"}
      closeFunction={() => setPaymentDialog(null)}
      title={"CASH PAYMENT"}
      buttons={buttons}
    >
      <>
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
      </>
    </Modal>
  );
}
