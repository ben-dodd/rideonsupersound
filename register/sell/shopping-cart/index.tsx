import { useState } from "react";
import { useAtom } from "jotai";
import CircularProgress from "@mui/material/CircularProgress";
import { useInventory } from "@/lib/swr-hooks";
import { getTotalPrice, getTotalStoreCut } from "@/lib/data-functions";
import {
  saveSaleAndItemsToDatabase,
  deleteSaleFromDatabase,
  deleteSaleItemFromDatabase,
} from "@/lib/db-functions";
import {
  cartAtom,
  showCartAtom,
  showCartScreenAtom,
  showHoldAtom,
  clerkAtom,
} from "@/lib/atoms";
import Actions from "./actions";
import ListItem from "./list-item";
import PayIcon from "@mui/icons-material/ShoppingCart";
import HoldIcon from "@mui/icons-material/PanTool";

export default function ShoppingCart() {
  // const [, setSellModal] = useAtom(sellModalAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowHold] = useAtom(showHoldAtom);
  const [, setShowSaleScreen] = useAtom(showCartScreenAtom);
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const { inventory } = useInventory();
  const totalPrice = getTotalPrice(cart, inventory);
  const storeCut = getTotalStoreCut(cart, inventory);
  const [loadingSale, setLoadingSale] = useState(false);
  const disableButtons =
    loadingSale || !(cart?.items && Object.keys(cart?.items).length > 0);

  return (
    <div className="flex flex-col h-menu px-2 bg-black text-white">
      <div className="flex justify-between mb-2 relative">
        <div className="text-lg my-2 tracking-wide self-center">
          Shopping Cart
        </div>
        <Actions />
      </div>
      <div className="flex-grow overflow-x-hidden overflow-y-scroll">
        {(cart?.items || []).length > 0 ? (
          cart.items.map((cartItem, id) => (
            <ListItem
              key={cartItem?.item_id}
              index={id}
              cartItem={cartItem}
              deleteCartItem={deleteCartItem}
            />
          ))
        ) : (
          <div>No items in cart...</div>
        )}
      </div>
      <div className="pt-4">
        <div className="flex justify-between">
          <button
            className="fab-button__secondary w-1/3"
            disabled={disableButtons}
            onClick={() => setShowHold(true)}
          >
            <HoldIcon className="mr-2" />
            HOLD
          </button>
          <div>
            <div className="flex justify-end mt-2">
              <div className="self-center">STORE CUT</div>
              <div
                className={`self-center text-right ml-7 ${
                  storeCut < 0 ? "text-red-500" : "text-white"
                }`}
              >
                {storeCut < 0 && "-"}$
                {(cart?.items || []).length > 0
                  ? Math.abs(storeCut / 100).toFixed(2)
                  : "0.00"}
              </div>
            </div>
            <div className="flex justify-end mt-1">
              <div className="self-center">TOTAL</div>
              <div className="self-center text-right ml-4">
                ${((totalPrice || 0) / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            className="fab-button w-full my-4"
            disabled={disableButtons}
            onClick={() => loadSale()}
          >
            {loadingSale ? (
              <span className="pr-4">
                <CircularProgress color="inherit" size={18} />
              </span>
            ) : (
              <PayIcon className="mr-2" />
            )}
            MAKE THEM PAY
          </button>
        </div>
      </div>
    </div>
  );

  async function loadSale() {
    try {
      setLoadingSale(true);
      console.log(cart);
      await saveSaleAndItemsToDatabase(cart, clerk, setCart);
      setLoadingSale(false);
      setShowSaleScreen(true);
    } catch (e) {
      throw Error(e.message);
    }
  }

  async function deleteCartItem(itemId: string, id: number) {
    let newItems = cart?.items.filter((i) => i?.item_id !== parseInt(itemId));
    if (id)
      // Cart has been saved to the database, delete sale_item
      deleteSaleItemFromDatabase(id);
    if ((cart?.items || []).length < 1) {
      // No items left, delete cart
      setShowCart(false);
      // TODO Any transactions need to be refunded.
      deleteSaleFromDatabase(cart?.id);
    }
    setCart({ ...cart, items: newItems });
    // setRefresh(refresh + 1);
  }
}
