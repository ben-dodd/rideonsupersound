// DB
import { useVendors } from "@/lib/swr-hooks";

// Functions
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from "@/lib/data-functions";

export default function ItemCard({ item }) {
  const { vendors } = useVendors();
  const vendor = vendors?.filter((v) => v?.id === item?.vendor_id)?.[0];
  // SWR
  if (!item) return <div />;

  return (
    <div className="w-full">
      <div className="w-full bg-black text-white px-4 flex justify-between">
        <div>
          <div className="font-bold text-xl">{getItemSku(item)}</div>
          <div className="font-bold">{getItemDisplayName(item)}</div>
          <div className="">{`${item?.section ? `${item.section} / ` : ""}${
            item?.format
          } [${
            item?.is_new ? "NEW" : item?.cond?.toUpperCase() || "USED"
          }]`}</div>
          <div className="text-sm">
            {`${vendor ? `Selling for ${vendor?.name}` : ""}`}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="text-xl">{`$${(
            (item?.total_sell || 0) / 100
          )?.toFixed(2)}`}</div>
          {/* <button
            className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full"
            onClick={() =>
              setLoadedItemId({ ...loadedItemId, stocktake: item?.id })
            }
          >
            <EditIcon />
          </button> */}
        </div>
      </div>
      <div className="w-full">
        <img
          className="object-cover"
          src={getImageSrc(item)}
          alt={item?.title || "Inventory image"}
        />
      </div>
    </div>
  );
}
