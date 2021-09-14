import { useState } from "react";
import { useAtom } from "jotai";
import { useInventory } from "@/lib/swr-hooks";
import { getTotalPrice, getTotalStoreCut } from "@/lib/data-functions";
import {
  cartAtom,
  showCartAtom,
  showSaleScreenAtom,
  showHoldAtom,
  clerkAtom,
} from "@/lib/atoms";
import Actions from "./actions";
import ListItem from "./list-item";
import PayIcon from "@material-ui/icons/ShoppingCart";
import HoldIcon from "@material-ui/icons/PanTool";

export default function ShoppingCart() {
  // const [, setSellModal] = useAtom(sellModalAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowHold] = useAtom(showHoldAtom);
  const [, setShowSaleScreen] = useAtom(showSaleScreenAtom);
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const { inventory } = useInventory();
  const totalPrice = getTotalPrice(cart, inventory);
  const storeCut = getTotalStoreCut(cart, inventory);
  const [loading, setLoading] = useState(false);
  const disableButtons =
    loading || !(cart?.items && Object.keys(cart?.items).length > 0);
  const [refresh, setRefresh] = useState(0);

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
              key={id}
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
            <PayIcon className="mr-2" />
            MAKE THEM PAY
          </button>
        </div>
      </div>
    </div>
  );

  async function loadSale() {
    // setLoading(true);
    setShowSaleScreen(true);
    // Create new sale in DB or update sale if sale has 'id' property
    if (!cart?.id) {
      try {
        let newCart = cart;
        const res = await fetch("/api/create-sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact_id: cart?.contact_id || null,
            state: "in_progress",
            sale_opened_by: clerk?.id,
            weather: JSON.stringify(cart?.weather) || "",
            geo_latitude: cart?.geo_latitude || null,
            geo_longitude: cart?.geo_longitude || null,
            note: cart?.note || null,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
        newCart = { ...newCart, id: json?.insertId };

        let newItems = [];
        cart?.items.forEach(async (item) => {
          let newItem = item;
          try {
            const res2 = await fetch("/api/create-sale-item", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sale_id: json?.insertId,
                item_id: item?.item_id,
                quantity: item?.quantity,
                vendor_discount: item?.vendor_discount || null,
                store_discount: item?.store_discount || null,
                note: item?.note || null,
              }),
            });
            const json2 = await res2.json();
            if (!res2.ok) throw Error(json2.message);
            newItem = { ...newItem, id: json2?.insertId };
            newItems.push(newItem);
            setCart({ ...newCart, items: newItems });
          } catch (e) {
            throw Error(e.message);
          }
        });
        // console.log(cart);
        // console.log({ ...newCart, items: newItems });
        // console.log(cart);
        // setLoading(false);
      } catch (e) {
        throw Error(e.message);
      }
    } else {
    }
  }

  async function deleteCartItem(itemId: string) {
    let newItems = cart?.items.filter((i) => i?.item_id !== parseInt(itemId));
    if (cart?.id) {
      // Cart has been saved to the database, delete sale_item
      try {
        const res = await fetch("/api/delete-sale-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sale_id: cart?.id,
            item_id: parseInt(itemId),
          }),
        });
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
      } catch (e) {
        throw Error(e.message);
      }
    }
    // if (newCart.id) {
    // Cart is a saved sale, delete from db
    if ((cart?.items || []).length < 1) {
      // No items left, delete cart
      setShowCart(false);
      // TODO Any transactions need to be refunded.
      try {
        const res = await fetch("/api/delete-sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sale_id: cart?.id,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw Error(json.message);
      } catch (e) {
        throw Error(e.message);
      }
    }
    setCart({ ...cart, items: newItems });
    setRefresh(refresh + 1);
  }
}
