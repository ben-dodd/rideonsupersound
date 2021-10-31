// Packages
import { useAtom } from "jotai";

// DB
import { InventoryObject } from "@/lib/types";
import {
  newSaleObjectAtom,
  viewAtom,
  clerkAtom,
  confirmModalAtom,
  loadedItemIdAtom,
} from "@/lib/atoms";
import { useWeather } from "@/lib/swr-hooks";

// Components
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";

// Icons
import AddIcon from "@mui/icons-material/AddCircleOutline";
import InfoIcon from "@mui/icons-material/Info";

// TODO add tooltips everywhere. Have ability to turn them off.

// Functions
import {
  getItemSku,
  getGeolocation,
  getItemDisplayName,
  getItemQuantity,
  getImageSrc,
} from "@/lib/data-functions";

type ListItemProps = {
  item: InventoryObject;
};

export default function ListItem({ item }: ListItemProps) {
  // SWR
  const geolocation = getGeolocation();
  const { weather } = useWeather();

  // Atoms
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [view, setView] = useAtom(viewAtom);
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom);
  const [, setConfirmModal] = useAtom(confirmModalAtom);
  const [clerk] = useAtom(clerkAtom);

  // Constants
  const itemQuantity = getItemQuantity(item, cart);

  // Functions
  function clickAddToCart() {
    if (itemQuantity < 1) {
      setConfirmModal({
        open: true,
        title: "Are you sure you want to add to cart?",
        styledMessage: (
          <span>
            There is no more of <b>{getItemDisplayName(item)}</b> in stock. Are
            you sure you want to add to cart?
          </span>
        ),
        yesText: "YES, I'M SURE",
        action: () => addItemToCart(),
      });
    } else addItemToCart();
  }

  function addItemToCart() {
    let newItems = cart?.items || [];
    let index = newItems.findIndex((cartItem) => cartItem.item_id === item?.id);
    if (index < 0)
      newItems.push({
        item_id: item?.id,
        quantity: "1",
      });
    else newItems[index].quantity = `${parseInt(newItems[index].quantity) + 1}`;
    setCart({
      id: cart?.id || null,
      // TODO check the date to string thing works ok
      date_sale_opened: cart?.date_sale_opened || new Date().toString(),
      sale_opened_by: cart?.sale_opened_by || clerk?.id,
      items: newItems,
      weather: cart?.weather || weather,
      geo_latitude: cart?.geo_latitude || geolocation?.latitude,
      geo_longitude: cart?.geo_longitude || geolocation?.longitude,
    });
    setView({ ...view, cart: true });
  }

  function clickOpenInventoryModal() {
    setLoadedItemId({ ...loadedItemId, sell: item?.id });
  }
  // TODO Add in way for mobile view to add items and access info
  // Disable mobile only for now
  // <div
  //   className="flex w-full mb-2 bg-blue-100 relative"
  //   onClick={clickAddToCart}
  //   onDoubleClick={clickOpenInventoryModal}
  // >
  return (
    <div className="flex w-full mb-2 bg-blue-100">
      <div className="w-32">
        <div
          className={`w-32 h-32 relative${
            item?.quantity < 1 ? " opacity-50" : ""
          }`}
        >
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
          <Tooltip title="Go to the INVENTORY screen to receive or return items.">
            <div
              className={`text-md ${itemQuantity < 1 && "text-red-500"}`}
            >{`${itemQuantity} in stock`}</div>
          </Tooltip>
          <Tooltip title="You can change the price in the item details screen.">
            <div className="text-xl">{`$${(
              (item?.total_sell || 0) / 100
            )?.toFixed(2)}`}</div>
          </Tooltip>
        </div>
      </div>
      <div className="self-center pl-8 hidden sm:inline">
        <Tooltip title="View and edit item details.">
          <button
            className="icon-button-large text-gray-800 hover:text-gray-600"
            onClick={clickOpenInventoryModal}
          >
            <InfoIcon style={{ fontSize: "40px" }} />
          </button>
        </Tooltip>
      </div>
      <div className="self-center pl-1 pr-2 hidden sm:inline">
        <Tooltip title="Add item to sale.">
          <button
            className="icon-button-large hover:text-blue-500"
            disabled={!item?.total_sell}
            onClick={clickAddToCart}
          >
            <AddIcon style={{ fontSize: "40px" }} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
