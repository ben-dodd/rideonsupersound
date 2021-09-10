import { useState, useMemo } from "react";
import Modal from "@/components/modal";
import { useAtom } from "jotai";
import { paymentDialogAtom, cartAtom } from "@/lib/atoms";
import TextField from "@/components/inputs/text-field";
import { useInventory } from "@/lib/swr-hooks";
import { TransactionObject } from "@/lib/types";
import { getTotalPrice, getRemainingBalance } from "@/lib/data-functions";

export default function Cash() {
  const [paymentDialog, setPaymentDialog] = useAtom(paymentDialogAtom);
  const [cart] = useAtom(cartAtom);
  const { inventory } = useInventory();
  const totalPrice = useMemo(() => getTotalPrice(cart, inventory), [
    cart,
    inventory,
  ]);
  const remainingBalance = useMemo(
    () => getRemainingBalance(cart, totalPrice) / 100,
    [cart, totalPrice]
  );
  const [cashReceived, setCashReceived] = useState(`${remainingBalance}`);
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal
      open={paymentDialog === "cash"}
      onClose={() => setPaymentDialog(null)}
    >
      <div className="p-4">
        <div className="text-center text-4xl font-bold py-2">CASH PAYMENT</div>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={cashReceived}
          autoFocus
          selectOnFocus
          onChange={(e) => setCashReceived(e.target.value)}
        />
        <div className="text-center">{`Remaining to pay: $${(
          remainingBalance || 0
        ).toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cashReceived === "" || parseFloat(cashReceived) === 0
            ? "..."
            : isNaN(parseFloat(cashReceived))
            ? "NUMBERS ONLY PLEASE"
            : parseFloat(cashReceived) > remainingBalance
            ? `GIVE $${(parseFloat(cashReceived) - remainingBalance).toFixed(
                2
              )} IN CHANGE`
            : parseFloat(cashReceived) < remainingBalance
            ? `AMOUNT SHORT BY ${(
                remainingBalance - parseFloat(cashReceived)
              ).toFixed(2)}`
            : "ALL GOOD!"}
        </div>
        <button
          className="dialog-action__ok-button mb-8"
          disabled={
            submitting ||
            parseFloat(cashReceived) === 0 ||
            cashReceived <= "" ||
            isNaN(parseFloat(cashReceived))
          }
          onClick={async () => {
            let transaction: TransactionObject = {
              sale_id: 1,
              clerk_id: 1,
              payment_method: "cash",
              cash_received: parseFloat(cashReceived) * 100,
              amount:
                parseFloat(cashReceived) >= remainingBalance
                  ? remainingBalance * 100
                  : parseFloat(cashReceived) * 100,
              change_given:
                parseFloat(cashReceived) > remainingBalance
                  ? (parseFloat(cashReceived) - remainingBalance) * 100
                  : null,
            };
            setSubmitting(true);
            try {
              const res = await fetch("/api/create-transaction", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
              });
              const json = await res.json();
              if (!res.ok) throw Error(json.message);
            } catch (e) {
              throw Error(e.message);
            }
            setPaymentDialog(null);
            setSubmitting(false);
          }}
        >
          COMPLETE
        </button>
      </div>
    </Modal>
  );
}
