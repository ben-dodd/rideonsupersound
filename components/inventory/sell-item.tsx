import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/Info";

import { InventoryObject } from "../../types";

type SellItemProps = {
  item: InventoryObject;
};

export default function SellItem({ item }: SellItemProps) {
  // const cart = useSelector((state) => state.local.cart);
  // const savedSales = useSelector((state) => state.local.savedSales);
  // const vendors = useSelector((state) => state.local.vendors);
  // const currentStaff = useSelector((state) => state.local.currentStaff);
  return (
    <div className="flex w-full mb-2 bg-blue-100">
      <img
        className="w-32 h-32"
        src={item?.image_url || "/img/default.png"}
        alt={item?.title || "Inventory image"}
      />
      <div className="font-bold">{`[${item?.id}] ${item?.artist} - ${item?.title}`}</div>
      <div>{`$${((item?.total_sell || 0) / 100).toFixed(2)}`}</div>
      <div className="self-center pl-2">
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
      <div className="self-center pl-1 pr-2">
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
