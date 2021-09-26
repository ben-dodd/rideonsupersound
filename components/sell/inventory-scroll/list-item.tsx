import { useAtom } from "jotai";

import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/Info";

import { InventoryObject, SaleObject } from "@/lib/types";
import { cartAtom, showCartAtom, clerkAtom } from "@/lib/atoms";
import { useWeather } from "@/lib/swr-hooks";
import { getItemSku, getGeolocation } from "@/lib/data-functions";

type ListItemProps = {
  item: InventoryObject;
};

export default function ListItem({ item }: ListItemProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [clerk] = useAtom(clerkAtom);
  const geolocation = getGeolocation();
  const { weather } = useWeather();
  return (
    <div
      className="flex w-full mb-2 bg-blue-100 relative"
      onClick={() =>
        addItemToCart(
          item,
          cart,
          setCart,
          clerk?.id,
          setShowCart,
          weather,
          geolocation
        )
      }
      onDoubleClick={() => openInventoryModal(item)}
    >
      <div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
        {getItemSku(item)}
      </div>
      <img
        className="w-32 h-32"
        src={
          item?.image_url ||
          `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
        }
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
      <div className="self-center pl-2 hidden sm:inline">
        <button
          className="icon-button-large"
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
  cart: SaleObject,
  setCart: any,
  clerkId: number,
  setShowCart: any,
  weather: any,
  geolocation: any
) {
  let newItems = cart?.items || [];
  let index = newItems.findIndex((cartItem) => cartItem.item_id === item?.id);
  if (index < 0)
    newItems.push({
      item_id: item?.id,
      quantity: 1,
    });
  else newItems[index].quantity += 1;
  setCart({
    date_sale_opened: cart?.date_sale_opened || new Date(),
    sale_opened_by: cart?.sale_opened_by || clerkId,
    items: newItems,
    weather: cart?.weather || weather,
    geo_latitude: cart?.geo_latitude || geolocation?.latitude,
    geo_longitude: cart?.geo_longitude || geolocation?.longitude,
  });
  setShowCart(true);
}

function openInventoryModal(item: InventoryObject) {}
