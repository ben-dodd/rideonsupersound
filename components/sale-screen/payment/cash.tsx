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
  const [cashReceived, setCashReceived] = useState(`${sale?.totalRemaining}`);
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
          sale,
          clerk,
          cashReceived,
          "cash",
          mutateSaleTransactions,
          setSale
        );
        setSubmitting(false);
        setView({ ...view, cashPaymentDialog: false });
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={view?.cashPaymentDialog}
      closeFunction={() => setView({ ...view, cashPaymentDialog: false })}
      title={"CASH PAYMENT"}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={cashReceived}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setCashReceived(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          sale?.totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cashReceived === "" || parseFloat(cashReceived) === 0
            ? "..."
            : isNaN(parseFloat(cashReceived))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cashReceived) > sale?.totalRemaining
            ? `GIVE $${(
                parseFloat(cashReceived) - sale?.totalRemaining
              )?.toFixed(2)} IN CHANGE`
            : parseFloat(cashReceived) < sale?.totalRemaining
            ? `AMOUNT SHORT BY $${(
                sale?.totalRemaining - parseFloat(cashReceived)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
