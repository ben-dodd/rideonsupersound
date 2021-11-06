// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useSaleItemsForSale,
  useInventory,
  useLogs,
  useContacts,
  useRegisterID,
  useCashGiven,
  useCashReceived,
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
import { getSaleVars } from "@/lib/data-functions";
import { saveSaleTransaction, saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function Cash({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale] = useAtom(isNew ? newSaleObjectAtom : loadedSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { transactions, mutateSaleTransactions } = useSaleTransactionsForSale(
    sale?.id
  );
  const { items } = useSaleItemsForSale(sale?.id);
  const { inventory } = useInventory();
  const { mutateLogs } = useLogs();
  const { contacts } = useContacts();
  const { registerID } = useRegisterID();
  const { mutateCashGiven } = useCashGiven(registerID || 0);
  const { mutateCashReceived } = useCashReceived(registerID || 0);

  const { totalRemaining } = getSaleVars(items, transactions, inventory);

  // State
  const [cashReceived, setCashReceived] = useState(`${totalRemaining}`);
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const changeToGive = (parseFloat(cashReceived) - totalRemaining)?.toFixed(2);
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
          registerID,
          false,
          transactions,
          mutateSaleTransactions
        );
        setSubmitting(false);
        setView({ ...view, cashPaymentDialog: false });
        mutateCashGiven();
        mutateCashReceived();
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
          totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cashReceived === "" || parseFloat(cashReceived) === 0
            ? "..."
            : isNaN(parseFloat(cashReceived))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cashReceived) > totalRemaining
            ? `GIVE $${changeToGive} IN CHANGE`
            : parseFloat(cashReceived) < totalRemaining
            ? `AMOUNT SHORT BY $${(
                totalRemaining - parseFloat(cashReceived)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
