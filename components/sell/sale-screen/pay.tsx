import { useMemo } from "react";
import { useAtom } from "jotai";
import { useInventory } from "@/lib/swr-hooks";
import { cartAtom, paymentDialogAtom } from "@/lib/atoms";
import {
  getTotalPrice,
  getTotalStoreCut,
  getRemainingBalance,
} from "@/lib/data-functions";

export default function Pay() {
  const [cart, setCart] = useAtom(cartAtom);
  const [, openPaymentDialog] = useAtom(paymentDialogAtom);
  const { inventory } = useInventory();
  const storeCut = useMemo(() => getTotalStoreCut(cart, inventory), [
    cart,
    inventory,
  ]);
  const totalPrice = useMemo(() => getTotalPrice(cart, inventory), [
    cart,
    inventory,
  ]);
  const remainingBalance = useMemo(
    () => getRemainingBalance(cart, totalPrice),
    [cart, totalPrice]
  );
  return (
    <div>
      <div className="flex justify-between mb-2 mt-8">
        <div className="text-2xl text-blue-600 font-bold">PAY</div>
        <div className="text-2xl text-red-500 font-bold text-xl">
          ${((totalPrice || 0) / 100).toFixed(2)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-4">
        <button
          className="square-button"
          disabled={remainingBalance === 0}
          onClick={
            () => openPaymentDialog("cash")
            // dispatch(openDialog("cash", { remainingBalance, activeCart }))
          }
        >
          CASH
        </button>
        <button
          className="square-button"
          disabled={remainingBalance === 0}
          onClick={
            () => null
            // dispatch(openDialog("card", { remainingBalance, activeCart }))
          }
        >
          CARD
        </button>
        <button
          className="square-button"
          disabled={
            false
            // !contactVendor ||
            // !get(saleDialog, "contactId", null) ||
            // remainingBalance === 0
          }
          onClick={
            () => null
            // dispatch(openDialog("acct", { remainingBalance, activeCart }))
          }
        >
          ACCT
        </button>
        <button
          className="square-button"
          disabled={remainingBalance === 0}
          onClick={
            () => null
            // dispatch(openDialog("gift", { remainingBalance, activeCart }))
          }
        >
          GIFT
        </button>
      </div>
    </div>
  );
}
