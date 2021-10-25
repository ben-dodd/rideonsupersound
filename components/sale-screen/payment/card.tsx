import { useState } from "react";
import Modal from "@/components/container/modal";
import { useAtom } from "jotai";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  clerkAtom,
} from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { useSaleTransactionsForSale } from "@/lib/swr-hooks";
import { saveSaleTransaction } from "@/lib/db-functions";
import { ModalButton } from "@/lib/types";

export default function Cash({ isNew }) {
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const { mutateSaleTransactions } = useSaleTransactionsForSale(sale?.id);
  const [submitting, setSubmitting] = useState(false);

  const [cardPayment, setCardPayment] = useState(`${sale?.remainingBalance}`);

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
          sale,
          clerk,
          cardPayment,
          "card",
          mutateSaleTransactions,
          setSale
        );
        setSubmitting(false);
        setView({ ...view, cardPaymentDialog: false });
      },
      text: "COMPLETE",
    },
  ];
  return (
    <Modal
      open={view?.cardPaymentDialog}
      closeFunction={() => setView({ ...view, cardPaymentDialog: false })}
      title={"CARD PAYMENT"}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={cardPayment}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setCardPayment(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          sale?.remainingBalance || 0
        ).toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cardPayment === "" || parseFloat(cardPayment) === 0
            ? "..."
            : isNaN(parseFloat(cardPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cardPayment) > sale?.remainingBalance
            ? `PAYMENT TOO HIGH`
            : parseFloat(cardPayment) < sale?.remainingBalance
            ? `AMOUNT SHORT BY $${(
                sale?.remainingBalance - parseFloat(cardPayment)
              ).toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
