import { useState } from "react";
import { useAtom } from "jotai";
import { useInventory } from "@/lib/swr-hooks";
import { getTotalPrice, getTotalStoreCut } from "@/lib/data-functions";
import {
  sellModalAtom,
  cartAtom,
  showCartAtom,
  showHoldAtom,
} from "@/lib/atoms";
import ShoppingCartActions from "@/components/sell/shopping-cart-actions";
import ShoppingCartItem from "@/components/inventory/shopping-cart-item";
import PayIcon from "@material-ui/icons/ShoppingCart";
import HoldIcon from "@material-ui/icons/PanTool";

export default function ShoppingCart() {
  const [, setSellModal] = useAtom(sellModalAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowHold] = useAtom(showHoldAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const { inventory } = useInventory();
  const totalPrice = getTotalPrice(cart, inventory);
  const storeCut = getTotalStoreCut(cart, inventory);
  const disableButtons = !(cart.items && Object.keys(cart.items).length > 0);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="flex flex-col h-menu px-2 bg-black text-white">
      <div className="flex justify-between mb-2 relative">
        <div className="text-lg my-2 tracking-wide self-center">
          Shopping Cart
        </div>
        <ShoppingCartActions />
      </div>
      <div className="flex-grow overflow-x-hidden overflow-y-scroll">
        {Object.keys(cart?.items || {}).length > 0 ? (
          Object.entries(cart.items).map(([id, cartItem]) => (
            <ShoppingCartItem
              key={id}
              id={id}
              cartItem={cartItem}
              deleteCartItem={deleteCartItem}
            />
          ))
        ) : (
          <div>No items in cart...</div>
        )}
      </div>
      <div className="pt-2">
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
                {Object.keys(cart?.items || {}).length > 0
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
          <button className="fab-button w-full my-4" disabled={disableButtons}>
            <PayIcon className="mr-2" />
            MAKE THEM PAY
          </button>
        </div>
      </div>
    </div>
  );

  function deleteCartItem(itemId: string) {
    let newCart = cart;
    delete newCart.items[itemId];
    // if (newCart.id) {
    // Cart is a saved sale, delete from db
    if (Object.keys(newCart?.items || {}).length < 1) {
      // No items left, delete cart
      setShowCart(false);
      // updateData({
      //   dispatch,
      //   collection: "sales",
      //   doc: newCart.uid,
      //   update: {
      //     ...newCart,
      //     status: "deleted",
      //     deleted: true,
      //     lastModified: new Date(),
      //   },
      //   onDataUpdated: () => dispatch(clearCart()),
      // });
    } else {
      // updateData({
      //   dispatch,
      //   collection: "sales",
      //   doc: newCart.uid,
      //   update: {
      //     ...newCart,
      //     lastModified: new Date(),
      //   },
      // });
    }
    // }
    setCart(newCart);
    setRefresh(refresh + 1);
  }
}
