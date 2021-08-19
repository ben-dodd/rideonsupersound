import { useAtom } from "jotai";

import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/Info";

import { InventoryObject } from "@/lib/types";
import { cartAtom } from "@/lib/atoms";

type SellItemProps = {
  item: InventoryObject;
};

export default function SellItem({ item }: SellItemProps) {
  const [, setCart] = useAtom(cartAtom);
  // const cart = useSelector((state) => state.local.cart);
  // const savedSales = useSelector((state) => state.local.savedSales);
  // const vendors = useSelector((state) => state.local.vendors);
  // const currentStaff = useSelector((state) => state.local.currentStaff);
  return (
    <div
      className="flex w-full mb-2 bg-blue-100 relative"
      onClick={() => addItemToCart(item, setCart)}
      onDoubleClick={() => openInventoryModal(item)}
    >
      <div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">{`${(
        "000" + item?.vendor_id || ""
      ).slice(-3)}/${("00000" + item?.id || "").slice(-5)}`}</div>
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

function addItemToCart(item: InventoryObject, setCart: any) {}

function openInventoryModal(item: InventoryObject) {}
