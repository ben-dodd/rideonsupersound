import { useAtom } from "jotai";
import { sellModalAtom, cartAtom } from "@/lib/atoms";
import ShoppingCartItem from "@/components/inventory/shopping-cart-item";

export default function ShoppingCart() {
  const [, setSellModal] = useAtom(sellModalAtom);
  const [cart] = useAtom(cartAtom);

  return (
    <div className="p-2">
      <div className="text-xl">Shopping Cart</div>
      {Object.keys(cart?.items || {}).length > 0 ? (
        Object.entries(cart.items).map(([id, cartItem]) => (
          <ShoppingCartItem key={id} id={id} cartItem={cartItem} />
        ))
      ) : (
        <div>no items...</div>
      )}
    </div>
  );
}
