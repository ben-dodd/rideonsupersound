// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useLogs,
  useContacts,
} from "@/lib/swr-hooks";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  clerkAtom,
  alertAtom,
} from "@/lib/atoms";
import { ModalButton, ContactObject } from "@/lib/types";

// Functions
import { saveSaleTransaction, saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function Cash({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { mutateSaleTransactions } = useSaleTransactionsForSale(sale?.id);
  const { mutateLogs } = useLogs();
  const { contacts } = useContacts();

  // State
  const [cashReceived, setCashReceived] = useState(`${sale?.totalRemaining}`);
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const changeToGive = (
    parseFloat(cashReceived) - sale?.totalRemaining
  )?.toFixed(2);
  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(cashReceived) === 0 ||
        cashReceived <= "" ||
        isNaN(parseFloat(cashReceived)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        const id = await saveSaleTransaction(
          sale,
          clerk,
          cashReceived,
          "cash",
          mutateSaleTransactions,
          setSale
        );
        setSubmitting(false);
        setView({ ...view, cashPaymentDialog: false });
        saveLog(
          {
            log: `$${parseFloat(cashReceived)?.toFixed(2)} cash taken from ${
              sale?.contact_id
                ? contacts?.filter(
                    (c: ContactObject) => c?.id === sale?.contact_id
                  )[0]?.name
                : "customer"
            } (sale #${sale?.id}).${
              parseFloat(changeToGive) > 0
                ? ` $${changeToGive} change given.`
                : ""
            }`,
            clerk_id: clerk?.id,
            table_id: "sale_transaction",
            row_id: id,
          },
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `$${parseFloat(cashReceived)?.toFixed(
            2
          )} CASH TAKEN. $${changeToGive} CHANGE GIVEN.`,
        });
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
            ? `GIVE $${changeToGive} IN CHANGE`
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
