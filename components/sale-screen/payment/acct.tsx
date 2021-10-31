// Packages
import { useState, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useVendorTotalPayments,
  useVendorTotalSales,
  useVendorFromContact,
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
import { ModalButton } from "@/lib/types";

// Functions
import { getTotalOwing } from "@/lib/data-functions";
import { saveSaleTransaction, saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function Acct({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { vendor } = useVendorFromContact(sale?.contact_id);
  const { registerID } = useRegisterID();
  const { totalPayments } = useVendorTotalPayments(sale?.contact_id);
  const { totalSales } = useVendorTotalSales(sale?.contact_id);
  const { mutateSaleTransactions } = useSaleTransactionsForSale(sale?.id);
  const { mutateLogs } = useLogs();

  // State
  const [acctPayment, setAcctPayment] = useState(`${sale?.totalRemaining}`);
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const totalOwing = useMemo(
    () =>
      totalPayments && totalSales
        ? getTotalOwing(totalPayments, totalSales) / 100
        : 0,
    [totalPayments, totalSales]
  );

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(acctPayment) > sale?.totalRemaining ||
        totalOwing < parseFloat(acctPayment) ||
        parseFloat(acctPayment) === 0 ||
        acctPayment <= "" ||
        isNaN(parseFloat(acctPayment)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        const id = await saveSaleTransaction(
          sale,
          clerk,
          acctPayment,
          "acct",
          registerID,
          mutateSaleTransactions,
          setSale,
          vendor
        );
        setSubmitting(false);
        setView({ ...view, acctPaymentDialog: false });
        saveLog(
          {
            log: `$${parseFloat(acctPayment)?.toFixed(
              2
            )} account payment from vendor ${vendor?.name} (sale #${
              sale?.id
            }).`,
            clerk_id: clerk?.id,
            table_id: "sale_transaction",
            row_id: id,
          },
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `$${parseFloat(acctPayment)?.toFixed(2)} ACCOUNT PAYMENT`,
        });
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={view?.acctPaymentDialog}
      closeFunction={() => setView({ ...view, acctPaymentDialog: false })}
      title={"ACCOUNT PAYMENT"}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={acctPayment}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setAcctPayment(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          sale?.totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center font-bold">
          {`Remaining in account: $${totalOwing?.toFixed(2)}`}
        </div>
        <div className="text-center text-xl font-bold my-4">
          {acctPayment === "" || parseFloat(acctPayment) === 0
            ? "..."
            : isNaN(parseFloat(acctPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(acctPayment) > sale?.totalRemaining
            ? `PAYMENT TOO HIGH`
            : totalOwing < parseFloat(acctPayment)
            ? `NOT ENOUGH IN ACCOUNT`
            : parseFloat(acctPayment) < sale?.totalRemaining
            ? `AMOUNT SHORT BY $${(
                sale?.totalRemaining - parseFloat(acctPayment)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
