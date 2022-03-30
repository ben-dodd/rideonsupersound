// Packages
import { useState } from "react";
import { useAtom } from "jotai";
import dayjs from "dayjs";
import UTC from "dayjs/plugin/utc";

// DB
import {
  useCustomers,
  useInventory,
  useLogs,
  useRegisterID,
} from "@/lib/swr-hooks";
import { viewAtom, cartAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import {
  ModalButton,
  SaleTransactionObject,
  PaymentMethodTypes,
  CustomerObject,
} from "@/lib/types";

// Functions
import { getSaleVars } from "@/lib/data-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import { saveLog } from "@/lib/db-functions";

export default function Cash() {
  dayjs.extend(UTC);
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { inventory } = useInventory();
  const { customers } = useCustomers();
  const { registerID } = useRegisterID();
  const { logs, mutateLogs } = useLogs();

  const { totalRemaining } = getSaleVars(cart, inventory);

  // State
  const isRefund = totalRemaining < 0;
  const [cashReceived, setCashReceived] = useState(
    `${Math.abs(totalRemaining).toFixed(2)}`
  );
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const changeToGive = (parseFloat(cashReceived) - totalRemaining)?.toFixed(2);
  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled:
        submitting ||
        parseFloat(cashReceived) <= 0 ||
        (isRefund && parseFloat(cashReceived) > Math.abs(totalRemaining)) ||
        cashReceived === "" ||
        isNaN(parseFloat(cashReceived)),
      loading: submitting,
      onClick: () => {
        setSubmitting(true);
        let transaction: SaleTransactionObject = {
          date: dayjs.utc().format(),
          sale_id: cart?.id,
          clerk_id: clerk?.id,
          payment_method: PaymentMethodTypes.Cash,
          amount: isRefund
            ? parseFloat(cashReceived) * -100
            : parseFloat(cashReceived) >= totalRemaining
            ? totalRemaining * 100
            : parseFloat(cashReceived) * 100,
          cash_received: parseFloat(cashReceived) * 100,
          change_given: isRefund
            ? null
            : parseFloat(cashReceived) > totalRemaining
            ? (parseFloat(cashReceived) - totalRemaining) * 100
            : null,
          register_id: registerID,
          is_refund: isRefund,
        };
        let transactions = cart?.transactions || [];
        transactions.push(transaction);
        setCart({ ...cart, transactions });
        setSubmitting(false);
        saveLog(
          {
            log: `$${parseFloat(cashReceived)?.toFixed(2)} ${
              isRefund ? `cash refunded to` : `cash taken from`
            } ${
              cart?.customer_id
                ? customers?.filter(
                    (c: CustomerObject) => c?.id === cart?.customer_id
                  )[0]?.name
                : "customer"
            }${cart?.id ? ` (sale #${cart?.id}).` : ""}.${
              parseFloat(changeToGive) > 0
                ? ` $${changeToGive} change given.`
                : ""
            }`,
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        );
        setView({ ...view, cashPaymentDialog: false });
        setAlert({
          open: true,
          type: "success",
          message: `$${parseFloat(cashReceived)?.toFixed(2)} ${
            isRefund
              ? `CASH REFUNDED.`
              : `CASH TAKEN.${
                  parseFloat(changeToGive) > 0
                    ? ` $${changeToGive} CHANGE GIVEN.`
                    : ""
                }`
          }`,
        });
      },
      text: "COMPLETE",
    },
  ];

  return (
    <Modal
      open={view?.cashPaymentDialog}
      closeFunction={() => setView({ ...view, cashPaymentDialog: false })}
      title={isRefund ? `CASH REFUND` : `CASH PAYMENT`}
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
        <div className="text-center">{`Remaining to ${
          isRefund ? "refund" : "pay"
        }: $${Math.abs(totalRemaining)?.toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cashReceived === "" || parseFloat(cashReceived) === 0
            ? "..."
            : parseFloat(cashReceived) < 0
            ? "NO NEGATIVES ALLOWED"
            : isNaN(parseFloat(cashReceived))
            ? "NUMBERS ONLY PLEASE"
            : isRefund && parseFloat(cashReceived) > Math.abs(totalRemaining)
            ? "TOO MUCH CASH REFUNDED"
            : isRefund
            ? "ALL GOOD!"
            : parseFloat(cashReceived) > totalRemaining
            ? `GIVE $${changeToGive} IN CHANGE`
            : parseFloat(cashReceived) < Math.abs(totalRemaining)
            ? `AMOUNT SHORT BY $${(
                totalRemaining - parseFloat(cashReceived)
              )?.toFixed(2)}`
            : "ALL GOOD!"}
        </div>
      </>
    </Modal>
  );
}
