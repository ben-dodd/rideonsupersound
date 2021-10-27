import { useState, useMemo } from "react";
import Modal from "@/components/container/modal";
import { useAtom } from "jotai";
import {
  viewAtom,
  newSaleObjectAtom,
  loadedSaleObjectAtom,
  clerkAtom,
} from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { ModalButton } from "@/lib/types";

import {
  useSaleTransactionsForSale,
  useVendorTotalPayments,
  useVendorTotalSales,
  useVendorFromContact,
} from "@/lib/swr-hooks";
import { getTotalOwing } from "@/lib/data-functions";
import { saveSaleTransaction } from "@/lib/db-functions";

export default function Acct({ isNew }) {
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const { vendor } = useVendorFromContact(sale?.contact_id);
  const { totalPayments } = useVendorTotalPayments(sale?.contact_id);
  const { totalSales } = useVendorTotalSales(sale?.contact_id);
  const { mutateSaleTransactions } = useSaleTransactionsForSale(sale?.id);
  const totalOwing = useMemo(
    () =>
      totalPayments && totalSales
        ? getTotalOwing(totalPayments, totalSales) / 100
        : 0,
    [totalPayments, totalSales]
  );
  const [acctPayment, setAcctPayment] = useState(`${sale?.totalRemaining}`);
  const [submitting, setSubmitting] = useState(false);

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
      onClick: async () => {
        setSubmitting(true);
        await saveSaleTransaction(
          sale,
          clerk,
          acctPayment,
          "acct",
          mutateSaleTransactions,
          setSale,
          vendor
        );
        setSubmitting(false);
        setView({ ...view, acctPaymentDialog: false });
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
