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
  const [submitting, setSubmitting] = useState(false);

  const [cardPayment, setCardPayment] = useState(
    `${paymentDialog?.remainingBalance}`
  );

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(cardPayment) === 0 ||
        cardPayment <= "" ||
        isNaN(parseFloat(cardPayment)),
      onClick: async () => {
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
      },
      text: "COMPLETE",
    },
  ];
  return (
    <Modal
      open={paymentDialog?.method === "card"}
      closeFunction={() => setPaymentDialog(null)}
      title={"CARD PAYMENT"}
      buttons={buttons}
    >
      <>
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
      </>
    </Modal>
  );
}
