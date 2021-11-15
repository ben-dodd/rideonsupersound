// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useStockInventory,
  useLogs,
  useCustomers,
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
import { ModalButton, CustomerObject, PaymentMethodTypes } from "@/lib/types";

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
  const [sale, setSale] = useAtom(
    isNew ? newSaleObjectAtom : loadedSaleObjectAtom
  );
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { transactions } = useSaleTransactionsForSale(sale?.id);
  const { items } = useSaleItemsForSale(sale?.id);
  const { inventory } = useStockInventory();

  const { totalRemaining } = getSaleVars(items, transactions, inventory);

  // State
  const [refundAmount, setRefundAmount] = useState(`${totalRemaining}`);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodTypes.Cash);
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const buttons: ModalButton[] = [
    // {
    //   type: "ok",
    //   disabled:
    //     submitting ||
    //     parseFloat(cashReceived) === 0 ||
    //     cashReceived <= "" ||
    //     isNaN(parseFloat(cashReceived)),
    //   loading: submitting,
    //   onClick: async () => {
    //     setSubmitting(true);
    //     const id = await saveSaleTransaction(
    //       sale,
    //       clerk,
    //       cashReceived,
    //       "cash",
    //       registerID,
    //       mutateSaleTransactions,
    //       setSale
    //     );
    //     setSubmitting(false);
    //     setView({ ...view, cashPaymentDialog: false });
    //     mutateCashGiven();
    //     mutateCashReceived();
    //     saveLog(
    //       {
    //         log: `$${parseFloat(refundAmount)?.toFixed(2)} refunded to ${
    //           sale?.customer_id
    //             ? customers?.filter(
    //                 (c: CustomerObject) => c?.id === sale?.customer_id
    //               )[0]?.name
    //             : "customer"
    //         } (sale #${sale?.id}).`,
    //         clerk_id: clerk?.id,
    //         table_id: "sale_transaction",
    //         row_id: id,
    //       },
    //       mutateLogs
    //     );
    //     setAlert({
    //       open: true,
    //       type: "success",
    //       message: `$${parseFloat(refundAmount)?.toFixed(2)} REFUNDED.`,
    //     });
    //   },
    //   text: "COMPLETE",
    // },
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
          value={refundAmount}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setRefundAmount(e.target.value)}
        />
        <div className="flex">
          <button
            className="square-button"
            disabled={totalRemaining === 0}
            onClick={() => setPaymentMethod(PaymentMethodTypes.Cash)}
          >
            CASH
          </button>
          <button
            className="square-button"
            disabled={totalRemaining === 0}
            onClick={() => setPaymentMethod(PaymentMethodTypes.Card)}
          >
            CARD
          </button>
          <button
            className="square-button"
            disabled={!sale?.customer_id || totalRemaining === 0}
            onClick={() => setPaymentMethod(PaymentMethodTypes.Account)}
          >
            ACCT
          </button>
        </div>
      </>
    </Modal>
  );
}
