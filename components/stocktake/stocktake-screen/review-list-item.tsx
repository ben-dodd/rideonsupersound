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
import Select from "react-select";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import { useInventory, useVendors } from "@/lib/swr-hooks";
import {
  ReviewedItemObject,
  StockObject,
  StocktakeObject,
  StocktakeReviewDecisions,
} from "@/lib/types";

interface reviewListItemProps {
  item: StockObject;
  reviewedItem: ReviewedItemObject;
  stocktake: StocktakeObject;
  setStocktake: Function;
}

export default function ReviewListItem({
  item,
  reviewedItem,
  stocktake,
  setStocktake,
}: reviewListItemProps) {
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom);
  const { vendors } = useVendors();
  const vendor = vendors?.filter((v) => v?.id === item?.vendor_id)?.[0];
  return (
    <div className="flex my-2 border-b w-full hover:bg-gray-100">
      <div className="w-1/2 flex">
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
      <div className="w-4/12 flex flex-col justify-center">
        {reviewedItem?.quantity_difference === 0 ? (
          <div />
        ) : (
          <Select
            className={`w-full ${
              reviewedItem?.review_decision ===
                StocktakeReviewDecisions?.review ||
              !reviewedItem?.review_decision
                ? "border border-4 border-orange-300"
                : reviewedItem?.review_decision ===
                  StocktakeReviewDecisions?.keep
                ? "border border-4 border-red-500"
                : "border border-4 border-green-500"
            }`}
            value={{
              value:
                reviewedItem?.review_decision ||
                StocktakeReviewDecisions?.review,
              label:
                reviewedItem?.review_decision ||
                StocktakeReviewDecisions?.review,
            }}
            options={(reviewedItem?.quantity_difference > 0
              ? [
                  StocktakeReviewDecisions?.review,
                  StocktakeReviewDecisions?.adjust,
                  StocktakeReviewDecisions?.found,
                  StocktakeReviewDecisions?.keep,
                ]
              : [
                  StocktakeReviewDecisions?.review,
                  StocktakeReviewDecisions?.adjust,
                  StocktakeReviewDecisions?.discard,
                  StocktakeReviewDecisions?.lost,
                  StocktakeReviewDecisions?.return,
                  StocktakeReviewDecisions?.keep,
                ]
            ).map((m: string) => ({
              value: m,
              label: m,
            }))}
            onChange={(item: any) =>
              setStocktake({
                ...stocktake,
                reviewed_items: (stocktake?.reviewed_items || [])?.map((rev) =>
                  rev?.id === reviewedItem?.id
                    ? { ...reviewedItem, review_decision: item?.value }
                    : rev
                ),
              })
            }
          />
        )}
      </div>
      <div className="w-1/12 flex flex-col items-center justify-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full"
          onClick={() =>
            setLoadedItemId({ ...loadedItemId, stocktake: item?.id })
          }
        >
          <EditIcon />
        </button>
        <div className="text-xs pt-2">EDIT ITEM</div>
      </div>
      <div className="w-1/12">
        <div>{`Counted ${reviewedItem?.quantity_counted}`}</div>
        <div>{`Recorded ${reviewedItem?.quantity_recorded}`}</div>
        {reviewedItem?.quantity_difference === 0 ? (
          <div className="bg-green-500 text-center">
            <CheckIcon className="text-white" />
          </div>
        ) : (
          <div
            className={`${
              reviewedItem?.quantity_difference < 0
                ? "bg-red-500"
                : "bg-orange-500"
            } text-center`}
          >
            <div className="text-white">
              {reviewedItem?.quantity_difference < 0
                ? reviewedItem?.quantity_difference
                : `+${reviewedItem?.quantity_difference}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
