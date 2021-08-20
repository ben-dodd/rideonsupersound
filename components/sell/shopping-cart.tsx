import { useState } from "react";
import { useAtom } from "jotai";
import { sellModalAtom, cartAtom, showCartAtom } from "@/lib/atoms";
import ShoppingCartItem from "@/components/inventory/shopping-cart-item";

export default function ShoppingCart() {
  const [, setSellModal] = useAtom(sellModalAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="p-2">
      <div className="text-xl">Shopping Cart</div>
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
        <div>no items...</div>
      )}
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
