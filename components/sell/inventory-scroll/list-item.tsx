import { useAtom } from "jotai";
import { v4 as uuid } from "uuid";

import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/Info";

import { InventoryObject, CartObject } from "@/lib/types";
import { cartAtom, showCartAtom, clerkAtom } from "@/lib/atoms";
import { getItemSku } from "@/lib/data-functions";

type ListItemProps = {
  item: InventoryObject;
};

export default function ListItem({ item }: ListItemProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [clerk] = useAtom(clerkAtom);
  return (
    <div
      className="flex w-full mb-2 bg-blue-100 relative"
      onClick={() => addItemToCart(item, cart, setCart, clerk?.id, setShowCart)}
      onDoubleClick={() => openInventoryModal(item)}
    >
      <div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
        {getItemSku(item)}
      </div>
      <img
        className="w-32 h-32"
        src={item?.image_url || "/img/default.png"}
        alt={item?.title || "Inventory image"}
      />
      <div className="flex flex-col justify-between pl-2 w-full">
        <div>
          <div className="font-bold text-sm">{`${
            item?.title || "Untitled"
          }`}</div>
          <div className="text-sm border-b border-gray-400">{`${
            item?.artist || "Untitled"
          }`}</div>
          <div className="text-xs">{`${item?.genre ? `${item.genre} / ` : ""}${
            item?.format
          } [${
            item?.is_new ? "NEW" : item?.cond?.toUpperCase() || "USED"
          }]`}</div>
        </div>
        <div className="text-xs">
          {`${item?.vendor_name ? `Selling for ${item?.vendor_name}` : ""}`}
        </div>
        <div className="flex justify-between items-end">
          <div className="text-md">{`${item?.quantity} in stock`}</div>
          <div className="text-xl">{`$${((item?.total_sell || 0) / 100).toFixed(
            2
          )}`}</div>
        </div>
      </div>
      <div className="self-center pl-2">
        <button
          className="icon-button-large hidden sm:inline"
          onClick={
            () => null
            // addLog(
            //   `Viewed info for stock item.`,
            //   "inventory",
            //   id,
            //   currentStaff
            // );
            // dispatch(openDialog("inventory", { id, ...item }));
          }
        >
          <InfoIcon style={{ fontSize: "40px" }} />
        </button>
      </div>
      <div className="self-center pl-1 pr-2 hidden sm:inline">
        <button
          className="icon-button-large"
          disabled={!item?.total_sell}
          onClick={
            () => null
            // handleItemClick({
            //   id,
            //   item,
            //   cart,
            //   currentStaff,
            //   dispatch,
            // })
          }
        >
          <AddIcon style={{ fontSize: "40px" }} />
        </button>
      </div>
    </div>
  );
}

function addItemToCart(
  item: InventoryObject,
  cart: CartObject,
  setCart: any,
  clerkId: number,
  setShowCart: any
) {
  const uid = cart?.uid || uuid();
  // !cart?.date_sale_opened && getWeather();
  setCart({
    uid,
    date_sale_opened: cart?.date_sale_opened || new Date(),
    sale_opened_by: cart?.sale_opened_by || clerkId,
    items: {
      ...cart?.items,
      [item?.id]: {
        cart_quantity:
          (parseInt(cart?.items[item?.id]?.cart_quantity) || 0) + 1,
      },
    },
  });
  setShowCart(true);
}

function openInventoryModal(item: InventoryObject) {}
