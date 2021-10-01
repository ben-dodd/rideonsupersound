import { useAtom } from "jotai";

import Image from "next/image";

import AddIcon from "@material-ui/icons/AddCircleOutline";
import InfoIcon from "@material-ui/icons/Info";

import { InventoryObject, SaleObject } from "@/lib/types";
import {
  cartAtom,
  showCartAtom,
  clerkAtom,
  showItemScreenAtom,
} from "@/lib/atoms";
import { useWeather } from "@/lib/swr-hooks";
import {
  getItemSku,
  getGeolocation,
  getItemQuantity,
  getImageSrc,
} from "@/lib/data-functions";

type ListItemProps = {
  item: InventoryObject;
};

export default function ListItem({ item }: ListItemProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, openInventoryModal] = useAtom(showItemScreenAtom);
  const [clerk] = useAtom(clerkAtom);
  const geolocation = getGeolocation();
  const { weather } = useWeather();
  const clickAddToCart = () =>
    addItemToCart(
      item,
      cart,
      setCart,
      clerk?.id,
      setShowCart,
      weather,
      geolocation
    );
  const clickOpenInventoryModal = () => openInventoryModal(item?.id);
  // Disable mobile only for now
  // <div
  //   className="flex w-full mb-2 bg-blue-100 relative"
  //   onClick={clickAddToCart}
  //   onDoubleClick={clickOpenInventoryModal}
  // >
  return (
    <div className="flex w-full mb-2 bg-blue-100">
      <div className="w-32">
        <div className="w-32 h-32 relative">
          <Image
            layout="fill"
            objectFit="cover"
            src={getImageSrc(item)}
            alt={item?.title || "Inventory image"}
          />
          <div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
            {getItemSku(item)}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between pl-2 w-full">
        <div>
          <div className="font-bold text-md">{`${
            item?.title || "Untitled"
          }`}</div>
          <div className="text-md border-b border-gray-400">{`${
            item?.artist || "Untitled"
          }`}</div>
          <div className="text-sm text-green-800">{`${
            item?.genre ? `${item.genre} / ` : ""
          }${item?.format} [${
            item?.is_new ? "NEW" : item?.cond?.toUpperCase() || "USED"
          }]`}</div>
        </div>
        <div className="text-xs">
          {`${item?.vendor_name ? `Selling for ${item?.vendor_name}` : ""}`}
        </div>
        <div className="flex justify-between items-end">
          <div
            className={`text-md ${getItemQuantity(item) < 1 && "text-red-500"}`}
          >{`${getItemQuantity(item)} in stock`}</div>
          <div className="text-xl">{`$${((item?.total_sell || 0) / 100).toFixed(
            2
          )}`}</div>
        </div>
      </div>
      <div className="self-center pl-8 hidden sm:inline">
        <button
          className="icon-button-large text-gray-800 hover:text-gray-600"
          onClick={clickOpenInventoryModal}
        >
          <InfoIcon style={{ fontSize: "40px" }} />
        </button>
      </div>
      <div className="self-center pl-1 pr-2 hidden sm:inline">
        <button
          className="icon-button-large hover:text-blue-500"
          disabled={!item?.total_sell}
          onClick={clickAddToCart}
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
      quantity: "1",
    });
  else newItems[index].quantity = `${parseInt(newItems[index].quantity) + 1}`;
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
