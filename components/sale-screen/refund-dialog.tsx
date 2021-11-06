// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
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
  const { registerID } = useRegisterID();
  const { mutateCashGiven } = useCashGiven(registerID || 0);
  const { mutateCashReceived } = useCashReceived(registerID || 0);

  // State
  const [refundAmount, setRefundAmount] = useState(`${sale?.totalRemaining}`);
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
          registerID,
          mutateSaleTransactions,
          setSale
        );
        setSubmitting(false);
        setView({ ...view, cashPaymentDialog: false });
        mutateCashGiven();
        mutateCashReceived();
        saveLog(
          {
            log: `$${parseFloat(refundAmount)?.toFixed(2)} refunded to ${
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
          message: `$${parseFloat(refundAmount)?.toFixed(2)} REFUNDED.`,
        });
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={view?.refundDialog}
      closeFunction={() => setView({ ...view, refundDialog: false })}
      title={"REFUND"}
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
        <div className="flex">
          <button
            className="square-button"
            disabled={sale?.totalRemaining === 0}
            onClick={() => setPaymentMethod("cash")}
          >
            CASH
          </button>
          <button
            className="square-button"
            disabled={sale?.totalRemaining === 0}
            onClick={() => setPaymentMethod("card")}
          >
            CARD
          </button>
          <button
            className="square-button"
            disabled={
              !sale?.contact_id || !vendor || sale?.totalRemaining === 0
            }
            onClick={() => setPaymentMethod("acct")}
          >
            ACCT
          </button>
        </div>
        <CreateableSelect
          inputLabel="Select contact"
          value={sale?.contact_id}
          label={
            (contacts || []).filter(
              (c: ContactObject) => c?.id === sale?.contact_id
            )[0]?.name || ""
          }
          onChange={(contactObject: any) => {
            setSale({
              ...sale,
              contact_id: parseInt(contactObject?.value),
            });
          }}
          onCreateOption={(inputValue: string) => {
            setContact({ name: inputValue });
            setView({ ...view, createContact: true });
          }}
          options={contacts?.map((val: ContactObject) => ({
            value: val?.id,
            label: val?.name || "",
          }))}
        />
      </>
    </Modal>
  );
}
