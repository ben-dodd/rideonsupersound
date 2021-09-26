import { useMemo } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "@/lib/atoms";
import { useSaleTransactions, useInventory } from "@/lib/swr-hooks";
import { getRemainingBalance, getTotalPrice } from "@/lib/data-functions";

export default function Action() {
  const [cart] = useAtom(cartAtom);
  const { inventory } = useInventory();
  const totalPrice = useMemo(() => getTotalPrice(cart, inventory), [
    cart,
    inventory,
  ]);
  const { transactions } = useSaleTransactions(cart?.id);
  const remainingBalance = useMemo(
    () => getRemainingBalance(totalPrice, transactions) / 100,
    [totalPrice, transactions]
  );
  function clickLayby() {
    // Change quantity for all items if it wasn't a layby previously
    if (cart?.state !== "layby") {
      // For each item, add quantity on layby, remove quantity in cart
      // Change sale state to layby
      // date_layby_started
      // layby_started_by
    }
    // close dialog
  }
  function clickCompleteSale() {
    // If was a layby, complete layby
    //    For all items, remove from layby
    // For all items,
    //    If gift card, add to the collection
    //    If misc item, ignore
    //    If other item, change quantity sold
    // Update sale to 'complete', add date_sale_completed, sale_completed_by
  }
  return (
    <div>
      <div className="flex w-100 py-2">
        <button
          className="fab-button__secondary mr-2 w-1/2"
          disabled={!cart?.contact_id || remainingBalance <= 0}
          onClick={clickLayby}
        >
          LAYBY
        </button>
        <button
          className="fab-button ml-2 w-1/2"
          disabled={remainingBalance > 0 || cart?.state === "complete"}
          onClick={clickCompleteSale}
        >
          COMPLETE
        </button>
      </div>
    </div>
  );
}
