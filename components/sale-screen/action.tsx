import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  cartAtom,
  clerkAtom,
  saleAtom,
  showCartScreenAtom,
  showSaleScreenAtom,
  showCartAtom,
  alertAtom,
} from "@/lib/atoms";
import { ContactObject } from "@/lib/types";
import { useInventory, useContacts } from "@/lib/swr-hooks";
import { getSaleVars } from "@/lib/data-functions";
import {
  saveStockMovementToDatabase,
  saveSaleAndItemsToDatabase,
  saveGiftCardToDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
  saveLog,
} from "@/lib/db-functions";
import CircularProgress from "@mui/material/CircularProgress";

export default function Action({ isCart }) {
  const [cart, setCart] = useAtom(isCart ? cartAtom : saleAtom);
  const [clerk] = useAtom(clerkAtom);
  const [, setAlert] = useAtom(alertAtom);
  const { contacts } = useContacts();
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowSaleScreen] = useAtom(
    isCart ? showCartScreenAtom : showSaleScreenAtom
  );
  const { inventory } = useInventory();
  const [laybyLoading, setLaybyLoading] = useState(false);
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false);
  const [parkSaleLoading, setParkSaleLoading] = useState(false);

  const [remainingBalance, setRemainingBalance] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const { totalPrice, totalRemaining } = getSaleVars(cart, inventory);
    setTotalPrice(totalPrice);
    setRemainingBalance(totalRemaining);
  }, [cart]);
  function clearCart() {
    setShowSaleScreen(false);
    setCart({ id: null, items: [] });
    setShowCart(false);
  }

  async function clickParkSale() {
    setParkSaleLoading(true);
    const saleId = await saveSaleAndItemsToDatabase(
      { ...cart, state: "parked" },
      clerk
    );
    saveLog({
      log: `Sale parked (${cart?.items.length} item${
        cart?.items.length === 1 ? "" : "s"
      }${
        cart?.contact_id
          ? ` for ${
              (contacts || []).filter(
                (c: ContactObject) => c?.id === cart?.contact_id
              )[0]?.name
            }.`
          : ""
      }).`,
      clerk_id: clerk?.id,
      table_id: "sale",
      row_id: saleId,
    });
    setAlert({
      open: true,
      type: "success",
      message: "SALE PARKED",
    });
    clearCart();
    setParkSaleLoading(false);
  }

  async function clickLayby() {
    setLaybyLoading(true);
    // Change quantity for all items if it wasn't a layby previously
    for await (const cartItem of cart?.items) {
      // For each item, add quantity on layby, remove quantity in cart
      saveStockMovementToDatabase(cartItem, clerk, "layby", null);
    }
    if (cart?.state !== "layby") {
      // If not already a layby in progress...
      // Change sale state to layby
      // date_layby_started
      // layby_started_by
      let date = new Date();
      await updateSaleInDatabase({
        ...cart,
        state: "layby",
        date_layby_started: date.toISOString(),
        layby_started_by: clerk?.id,
      });
    }
    saveLog({
      log: `Layby started${
        cart?.contact_id
          ? ` for ${
              (contacts || []).filter(
                (c: ContactObject) => c?.id === cart?.contact_id
              )[0]?.name
            }`
          : ""
      } (${cart?.items.length} item${
        cart?.items.length === 1 ? "" : "s"
      } / $${totalPrice.toFixed(2)} with $${remainingBalance.toFixed(
        2
      )} left to pay).`,
      clerk_id: clerk?.id,
      table_id: "sale",
      row_id: cart?.id,
    });
    setAlert({
      open: true,
      type: "success",
      message: "LAYBY STARTED.",
    });
    // close dialog
    clearCart();
    setLaybyLoading(false);
  }

  async function clickCompleteSale() {
    setCompleteSaleLoading(true);
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
    clearCart();
    setCompleteSaleLoading(false);
  }
  return (
    <div className="dialog__footer--actions-full">
      <button
        className="dialog__footer-buttons--cancel"
        onClick={() => {
          setShowSaleScreen(false);
        }}
        disabled={true || remainingBalance === 0}
      >
        DISCARD SALE
      </button>
      <button
        className="dialog__footer-buttons--ok"
        onClick={clickParkSale}
        disabled={
          (cart?.state && cart?.state !== "in_progress") ||
          remainingBalance === 0
        }
      >
        <div className="flex justify-center items-center">
          {parkSaleLoading && <CircularProgress color="inherit" size={14} />}
          <div className={`${parkSaleLoading && "pl-2"}`}>PARK SALE</div>
        </div>
      </button>
      <button
        className="dialog__footer-buttons--quarternary"
        onClick={() => {
          setShowSaleScreen(false);
        }}
        disabled={
          (cart?.state && cart?.state !== "in_progress") ||
          remainingBalance === 0
        }
      >
        ADD MORE ITEMS
      </button>
      <button
        className="dialog__footer-buttons--secondary"
        disabled={laybyLoading || !cart?.contact_id || remainingBalance <= 0}
        onClick={clickLayby}
      >
        <div className="flex justify-center items-center">
          {laybyLoading && <CircularProgress color="inherit" size={14} />}
          <div className={`${laybyLoading && "pl-2"}`}>START LAYBY</div>
        </div>
      </button>
      <button
        className="dialog__footer-buttons--ok"
        disabled={
          completeSaleLoading ||
          remainingBalance > 0 ||
          cart?.state === "complete"
        }
        onClick={clickCompleteSale}
      >
        <div className="flex justify-center items-center">
          {completeSaleLoading && (
            <CircularProgress color="inherit" size={14} />
          )}
          <div className={`${completeSaleLoading && "pl-2"}`}>
            COMPLETE SALE
          </div>
        </div>
      </button>
    </div>
  );
}

// <div>
//   <div className="flex w-100 py-2">
//     <button
//       className="fab-button__secondary mr-2 w-1/2"
//       disabled={laybyLoading || !cart?.contact_id || remainingBalance <= 0}
//       onClick={clickLayby}
//     >
//       <div className="flex justify-center items-center">
//         {laybyLoading && <CircularProgress color="inherit" size={14} />}
//         <div className={`${laybyLoading && "pl-2"}`}>LAYBY</div>
//       </div>
//     </button>
//     <button
//       className="fab-button ml-2 w-1/2"
//       disabled={
//         completeSaleLoading ||
//         remainingBalance > 0 ||
//         cart?.state === "complete"
//       }
//       onClick={clickCompleteSale}
//     >
//       <div className="flex justify-center items-center">
//         {completeSaleLoading && (
//           <CircularProgress color="inherit" size={14} />
//         )}
//         <div className={`${completeSaleLoading && "pl-2"}`}>COMPLETE</div>
//       </div>
//     </button>
//   </div>
// </div>
