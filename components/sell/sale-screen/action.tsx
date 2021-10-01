import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  cartAtom,
  clerkAtom,
  showSaleScreenAtom,
  showCartAtom,
} from "@/lib/atoms";
import { useInventory } from "@/lib/swr-hooks";
import { getSaleVars } from "@/lib/data-functions";
import {
  saveStockMovementToDatabase,
  saveGiftCardToDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
} from "@/lib/db-functions";

export default function Action() {
  const [cart, setCart] = useAtom(cartAtom);
  const [clerk] = useAtom(clerkAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowSaleScreen] = useAtom(showSaleScreenAtom);
  const { inventory } = useInventory();

  const [remainingBalance, setRemainingBalance] = useState(0);
  useEffect(() => {
    const { totalRemaining } = getSaleVars(cart, inventory);
    setRemainingBalance(totalRemaining);
  }, [cart]);
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
    cart?.items.forEach((cartItem) => {
      if (cart?.state === "layby" && !cartItem?.is_gift_card) {
        saveStockMovementToDatabase(cartItem, clerk, "unlayby", null);
      }
      if (cartItem?.is_gift_card) {
        // Add to collection
        saveGiftCardToDatabase();
        // Add gift card to sale items
      } else if (!cartItem?.is_misc_item) {
        // Do something
        // Add misc item to sale items
      } else {
        if (cartItem?.id) updateSaleItemInDatabase(cartItem, cart);
        saveStockMovementToDatabase(cartItem, clerk, "sold", null);
      }
    });
    updateSaleInDatabase({ ...cart, state: "completed" });
    setShowSaleScreen(false);
    setCart({ id: null, items: [] });
    setShowCart(false);
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
