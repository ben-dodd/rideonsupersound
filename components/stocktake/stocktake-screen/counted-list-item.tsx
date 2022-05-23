// Packages
import { useAtom } from "jotai";

import { loadedItemIdAtom } from "@/lib/atoms";

// Functions
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from "@/lib/data-functions";

// Components
import TextField from "@/components/_components/inputs/text-field";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useVendors } from "@/lib/swr-hooks";

export default function CountedListItem({
  item,
  countedItem,
  stocktake,
  setStocktake,
}) {
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom);
  const { vendors } = useVendors();
  const vendor = vendors?.filter((v) => v?.id === item?.vendor_id)?.[0];
  return (
    <div className="flex justify-between my-2 border-b w-full hover:bg-gray-100">
      <div className="flex">
        <div className="w-20">
          <div className="w-20 h-20 relative">
            <img
              className="object-cover absolute"
              // layout="fill"
              // objectFit="cover"
              src={getImageSrc(item)}
              alt={item?.title || "Inventory image"}
            />
            {!item?.is_gift_card && !item?.is_misc_item && (
              <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        <div className="ml-2">
          <div>{getItemDisplayName(item)}</div>

          <div className="">{`${item?.section ? `${item.section} / ` : ""}${
            item?.format
          } [${
            item?.is_new ? "NEW" : item?.cond?.toUpperCase() || "USED"
          }]`}</div>
          <div className="text-sm">
            {`${vendor ? `Selling for ${vendor?.name}` : ""}`}
          </div>
        </div>
      </div>
      {/* <div className="text-xl">{`$${((item?.total_sell || 0) / 100)?.toFixed(
        2
      )}`}</div> */}
      <div className="flex items-center justify-end">
        <TextField
          className="w-16 mr-4"
          inputType="number"
          // error={!countedItem?.quantity}
          // max={item?.quantity || 0}
          min={0}
          valueNum={countedItem?.quantity}
          onChange={(e: any) =>
            setStocktake({
              ...stocktake,
              counted_items: stocktake?.counted_items?.map((i) =>
                i?.id === countedItem?.id
                  ? {
                      ...countedItem,
                      quantity: parseInt(e.target.value),
                    }
                  : i
              ),
            })
          }
        />
        <button
          className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full"
          onClick={() =>
            setLoadedItemId({ ...loadedItemId, stocktake: item?.id })
          }
        >
          <EditIcon />
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mx-4"
          onClick={() =>
            setStocktake({
              ...stocktake,
              counted_items: stocktake?.counted_items?.filter(
                (i) => i?.id !== countedItem?.id
              ),
            })
          }
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}
