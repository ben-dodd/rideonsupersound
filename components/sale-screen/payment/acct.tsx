// Packages
import { useState, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleTransactionsForSale,
  useSaleItemsForSale,
  useSaleInventory,
  useVendorTotalPayments,
  useVendorTotalSales,
  useVendorFromCustomer,
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
import {
  ModalButton,
  SaleTransactionObject,
  PaymentMethodTypes,
} from "@/lib/types";

// Functions
import { getTotalOwing, getSaleVars } from "@/lib/data-functions";
import { saveSaleTransaction, saveLog } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

export default function Acct({ isNew }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [sale] = useAtom(isNew ? newSaleObjectAtom : loadedSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { vendor } = useVendorFromCustomer(sale?.customer_id);
  const { registerID } = useRegisterID();
  const { totalPayments } = useVendorTotalPayments(sale?.customer_id);
  const { totalSales } = useVendorTotalSales(sale?.customer_id);
  const { transactions, mutateSaleTransactions } = useSaleTransactionsForSale(
    sale?.id
  );
  const { items } = useSaleItemsForSale(sale?.id);
  const { saleInventory } = useSaleInventory();
  const { logs, mutateLogs } = useLogs();

  const { totalRemaining } = getSaleVars(items, transactions, saleInventory);

  // State
  const [acctPayment, setAcctPayment] = useState(`${totalRemaining}`);
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
        parseFloat(acctPayment) > totalRemaining ||
        totalOwing < parseFloat(acctPayment) ||
        parseFloat(acctPayment) === 0 ||
        acctPayment <= "" ||
        isNaN(parseFloat(acctPayment)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let transaction: SaleTransactionObject = {
          sale_id: sale?.id,
          clerk_id: clerk?.id,
          payment_method: PaymentMethodTypes.Account,
          amount:
            parseFloat(acctPayment) >= totalRemaining
              ? totalRemaining * 100
              : parseFloat(acctPayment) * 100,
          register_id: registerID,
        };
        const id = await saveSaleTransaction(
          transaction,
          transactions,
          mutateSaleTransactions,
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
          logs,
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
          totalRemaining || 0
        )?.toFixed(2)}`}</div>
        <div className="text-center font-bold">
          {`Remaining in account: $${totalOwing?.toFixed(2)}`}
        </div>
        <div className="text-center text-xl font-bold my-4">
          {acctPayment === "" || parseFloat(acctPayment) === 0
            ? "..."
            : isNaN(parseFloat(acctPayment))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(acctPayment) > totalRemaining
            ? `PAYMENT TOO HIGH`
            : totalOwing < parseFloat(acctPayment)
            ? `NOT ENOUGH IN ACCOUNT`
            : parseFloat(acctPayment) < totalRemaining
            ? `AMOUNT SHORT BY $${(
                totalRemaining - parseFloat(acctPayment)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
