import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import {
  paymentDialogAtom,
  cartAtom,
  clerkAtom,
  alertAtom,
  saleAtom,
  showCartScreenAtom,
  showCartAtom,
  showSaleScreenAtom,
} from "@/lib/atoms";
import {
  useSaleItemsForSale,
  useSaleTransactionsForSale,
  useContacts,
  useInventory,
} from "@/lib/swr-hooks";
import { ModalButton, ContactObject } from "@/lib/types";
import { getSaleVars } from "@/lib/data-functions";
import {
  saveSaleAndItemsToDatabase,
  saveLog,
  saveStockMovementToDatabase,
  updateSaleInDatabase,
  updateSaleItemInDatabase,
  saveGiftCardToDatabase,
} from "@/lib/db-functions";
import Pay from "./pay";
import SaleSummary from "./sale-summary";
import Acct from "./payment/acct";
import Card from "./payment/card";
import Cash from "./payment/cash";
import Gift from "./payment/gift";
import ScreenContainer from "@/components/container/screen";

export default function SaleScreen({ isCart }) {
  const [cart, setCart] = useAtom(isCart ? cartAtom : saleAtom);
  const [clerk] = useAtom(clerkAtom);
  const [, setAlert] = useAtom(alertAtom);
  const { contacts } = useContacts();
  const [, setShowCart] = useAtom(showCartAtom);
  const [showSaleScreen, setShowSaleScreen] = useAtom(
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
  const [paymentDialog] = useAtom(paymentDialogAtom);
  const { items, isSaleItemsLoading } = useSaleItemsForSale(cart?.id);
  const {
    transactions,
    isSaleTransactionsLoading,
  } = useSaleTransactionsForSale(cart?.id);
  useEffect(() => {
    if (!isCart) {
      console.log("setting cart");
      setCart({ ...cart, items, transactions });
    }
  }, [isSaleItemsLoading, isSaleTransactionsLoading]);

  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setShowSaleScreen(false),
      disabled: true || remainingBalance === 0,
      text: cart?.state === "layby" ? "CANCEL LAYBY" : "DISCARD SALE",
    },
    {
      type: "alt3",
      onClick: clickParkSale,
      disabled:
        (cart?.state && cart?.state !== "in_progress") ||
        remainingBalance === 0,
      loading: parkSaleLoading,
      text: "PARK SALE",
    },
    {
      type: "alt2",
      onClick: () => setShowSaleScreen(false),
      disabled:
        (cart?.state && cart?.state !== "in_progress") ||
        remainingBalance === 0,
      text: "ADD MORE ITEMS",
    },
    {
      type: "alt1",
      onClick: clickLayby,
      disabled: laybyLoading || !cart?.contact_id || remainingBalance <= 0,
      loading: laybyLoading,
      text: cart?.state === "layby" ? "CONTINUE LAYBY" : "START LAYBY",
    },
    {
      type: "ok",
      onClick: clickCompleteSale,
      disabled:
        completeSaleLoading ||
        remainingBalance > 0 ||
        cart?.state === "complete",
      loading: completeSaleLoading,
      text: "COMPLETE SALE",
    },
  ];
  return (
    <>
      {paymentDialog?.method === "acct" && <Acct isCart={isCart} />}
      {paymentDialog?.method === "card" && <Card isCart={isCart} />}
      {paymentDialog?.method === "cash" && <Cash isCart={isCart} />}
      {paymentDialog?.method === "gift" && <Gift isCart={isCart} />}
      <ScreenContainer
        show={Boolean(showSaleScreen)}
        closeFunction={() => setShowSaleScreen(false)}
        title={`SALE #${cart?.id} [${
          cart?.state ? cart?.state.toUpperCase() : "IN PROGRESS"
        }]`}
        loading={isSaleItemsLoading || isSaleTransactionsLoading}
        buttons={buttons}
      >
        <div className="flex items-start overflow-auto w-full">
          <div className="w-2/3">
            <SaleSummary isCart={isCart} />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <Pay isCart={isCart} />
            {/*<Action />*/}
          </div>
        </div>
      </ScreenContainer>
    </>
  );
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
}

// hidden sm:flex items-start overflow-auto

// <div className="sm:hidden flex flex-col justify-between px-2">
//   <Pay />
//   <SaleSummary />
//   <Action />
// </div>
