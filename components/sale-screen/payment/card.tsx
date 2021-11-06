// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useSaleItemsForSale,
  useInventory,
  useContacts,
  useLogs,
  useRegisterID,
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
  const { contacts } = useContacts();
  const { registerID } = useRegisterID();
  const { transactions, mutateSaleTransactions } = useSaleTransactionsForSale(
    sale?.id
  );
  const { items } = useSaleItemsForSale(sale?.id);
  const { inventory } = useInventory();
  const { mutateLogs } = useLogs();

  const { totalRemaining } = getSaleVars(items, transactions, inventory);

  // State
  const [submitting, setSubmitting] = useState(false);
  const [cardPayment, setCardPayment] = useState(`${totalRemaining}`);

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(cardPayment) > totalRemaining ||
        parseFloat(cardPayment) === 0 ||
        cardPayment <= "" ||
        isNaN(parseFloat(cardPayment)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        const id = await saveSaleTransaction(
          sale,
          clerk,
          cardPayment,
          "card",
          registerID,
          false,
          transactions,
          mutateSaleTransactions
        );
        setSubmitting(false);
        setView({ ...view, cardPaymentDialog: false });
        saveLog(
          {
            log: `$${parseFloat(cardPayment)?.toFixed(2)} card payment from ${
              sale?.contact_id
                ? contacts?.filter(
                    (c: ContactObject) => c?.id === sale?.contact_id
                  )[0]?.name
                : "customer"
            } (sale #${sale?.id}).`,
            clerk_id: clerk?.id,
            table_id: "sale_transaction",
            row_id: id,
          },
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `$${parseFloat(cardPayment)?.toFixed(2)} CARD PAYMENT`,
        });
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
          totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cardPayment === "" || parseFloat(cardPayment) === 0
            ? "..."
            : isNaN(parseFloat(cardPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cardPayment) > totalRemaining
            ? `PAYMENT TOO HIGH`
            : parseFloat(cardPayment) < totalRemaining
            ? `AMOUNT SHORT BY $${(
                totalRemaining - parseFloat(cardPayment)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
