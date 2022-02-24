// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useInventory, useLogs } from "@/lib/swr-hooks";
import { cartAtom, viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { StockObject, SaleItemObject } from "@/lib/types";

// Functions
import { getItemDisplayName, getSaleVars } from "@/lib/data-functions";
import {
  deleteSaleFromDatabase,
  deleteSaleItemFromDatabase,
  saveLog,
} from "@/lib/db-functions";

// Components
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Actions from "./actions";
import ListItem from "./list-item";

// Icons
import PayIcon from "@mui/icons-material/ShoppingCart";
import HoldIcon from "@mui/icons-material/PanTool";

export default function ShoppingCart() {
  // SWR
  const { inventory } = useInventory();
  const { logs, mutateLogs } = useLogs();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setAlert] = useAtom(alertAtom);

  // State
  const [loadingSale, setLoadingSale] = useState(false);

  async function deleteCartItem(itemId: string, id: number) {
    let updatedCartItems = cart?.items?.map((i: SaleItemObject) =>
      i?.item_id === parseInt(itemId) ? { ...i, is_deleted: true } : i
    );
    if (id)
      // Cart has been saved to the database, delete sale_item
      deleteSaleItemFromDatabase(id);
    if (cart?.items?.length < 1 && cart?.transactions?.length < 1) {
      // No items left and no transactions, delete cart
      setView({ ...view, cart: false });
      deleteSaleFromDatabase(cart?.id);
    }
    setCart({
      ...cart,
      items: updatedCartItems,
    });
    saveLog(
      {
        log: `${getItemDisplayName(
          inventory?.filter((i: StockObject) => i?.id === parseInt(itemId))[0]
        )} removed from cart${id ? ` (sale #${id})` : ""}.`,
        clerk_id: clerk?.id,
      },
      logs,
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: `ITEM REMOVED FROM CART`,
    });
    // setRefresh(refresh + 1);
  }

  console.log(cart);

  // Constants
  const { totalPrice, totalStoreCut, totalRemaining, totalPaid } = getSaleVars(
    cart,
    inventory
  );
  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        view?.cart ? "left-0" : "left-full"
      } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
    >
      <div className="flex flex-col h-menu px-2 bg-gray-200 text-black">
        <div className="flex justify-between mb-2 relative">
          <div className="text-lg font-bold my-2 tracking-wide self-center">
            <div>Shopping Cart</div>
            {cart?.id && (
              <div className="text-sm font-light">
                <div>{`Sale #${
                  cart?.id
                } // ${cart?.state?.toUpperCase()}`}</div>
              </div>
            )}
          </div>
          <Actions />
        </div>
        <div className="flex-grow overflow-x-hidden overflow-y-scroll">
          {cart?.items?.length > 0 ? (
            cart.items
              .filter((cartItem: SaleItemObject) => !cartItem?.is_deleted)
              .map((cartItem, i) => (
                <ListItem
                  key={cartItem?.item_id}
                  index={i}
                  cartItem={cartItem}
                  deleteCartItem={deleteCartItem}
                />
              ))
          ) : (
            <Tooltip title="To add items to the cart. Use the search bar and then add items with the (+) icon.">
              <div>No items in cart...</div>
            </Tooltip>
          )}
        </div>
        {Boolean(cart?.transactions) ? (
          <div className="flex justify-end mt-2">
            <div className="self-center">TOTAL PAID</div>
            <div
              className={`self-center text-right ml-7 ${
                totalPaid < 0 ? "text-red-500" : "text-black"
              }`}
            >
              {totalPaid < 0 && "-"}${Math.abs(totalPaid)?.toFixed(2)}
            </div>
          </div>
        ) : (
          <div />
        )}
        <div className="pt-4">
          <div className="flex justify-between">
            <button
              className="fab-button__secondary w-1/3 mb-4"
              disabled={
                cart?.transactions?.length > 0 ||
                loadingSale ||
                totalRemaining === 0
              }
              onClick={() => setView({ ...view, createHold: true })}
            >
              <HoldIcon className="mr-2" />
              HOLD
            </button>
            <div>
              <div className="flex justify-end mt-2">
                <div className="self-center">STORE CUT</div>
                <div
                  className={`self-center text-right ml-7 ${
                    totalStoreCut < 0 ? "text-red-500" : "text-black"
                  }`}
                >
                  {totalStoreCut < 0 && "-"}$
                  {cart?.items?.length > 0
                    ? Math.abs(totalStoreCut)?.toFixed(2)
                    : "0.00"}
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <div className="self-center">TOTAL</div>
                <div className="self-center text-right ml-4">
                  ${totalPrice?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              className={`w-full my-4 modal__button--${
                totalRemaining < 0 ? "cancel" : "ok"
              }`}
              disabled={loadingSale || totalRemaining === 0}
              onClick={() => setView({ ...view, saleScreen: true })}
            >
              {loadingSale ? (
                <span className="pr-4">
                  <CircularProgress color="inherit" size={18} />
                </span>
              ) : (
                <PayIcon className="mr-2" />
              )}
              {totalRemaining < 0
                ? `REFUND $${Math.abs(totalRemaining)?.toFixed(2)}`
                : `PAY $${totalRemaining?.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
