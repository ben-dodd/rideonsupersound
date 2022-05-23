import { clerkAtom } from "@/lib/atoms";
import {
  getCSVData,
  getImageSrc,
  getItemDisplayName,
  getItemSku,
  getItemSkuDisplayName,
} from "@/lib/data-functions";
import Image from "next/image";
import { saveLog } from "@/lib/db-functions";
import { useInventory, useLogs, useStocktakeTemplates } from "@/lib/swr-hooks";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { CSVLink } from "react-csv";
import ReviewListItem from "./review-list-item";
import {
  CountedItemObject,
  ReviewedItemObject,
  StockObject,
} from "@/lib/types";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function CompleteStocktake({ stocktake, setStocktake }) {
  const { logs, mutateLogs } = useLogs();
  const [clerk] = useAtom(clerkAtom);
  const { inventory } = useInventory();
  const { stocktakeTemplates } = useStocktakeTemplates();
  const stocktakeTemplate = stocktakeTemplates?.filter(
    (st) => st?.id === stocktake?.stocktake_template_id
  )?.[0];
  const idList = stocktake?.counted_items?.map((i) => i?.id);
  const [search, setSearch] = useState("");

  const inventoryList = inventory?.filter(
    (i: StockObject) =>
      i?.quantity > 0 &&
      (stocktakeTemplate?.vendor_enabled
        ? stocktakeTemplate?.vendor_list?.includes(i?.vendor_id)
        : true) &&
      (stocktakeTemplate?.format_enabled
        ? stocktakeTemplate?.format_list?.includes(i?.format)
        : true) &&
      (stocktakeTemplate?.media_enabled
        ? stocktakeTemplate?.media_list?.includes(i?.media)
        : true) &&
      (stocktakeTemplate?.section_enabled
        ? stocktakeTemplate?.section_list?.includes(i?.section)
        : true)
  );

  useEffect(() => {
    const reviewedItems = inventoryList
      ?.map((i) => {
        let countedItem: CountedItemObject =
          stocktake?.counted_items?.filter((j) => j?.id === i?.id)?.[0] || null;
        let reviewedItem: ReviewedItemObject =
          stocktake?.reviewed_items?.filter((j) => j?.id === i?.id)?.[0] ||
          null;
        let mappedItem: ReviewedItemObject = {};
        // Add reviewed item if not there
        if (!reviewedItem) {
          if (!countedItem) {
            // Item is missed from counting
            mappedItem = {
              id: i?.id,
              quantity_counted: 0,
              quantity_recorded: i?.quantity,
              quantity_difference: 0 - (i?.quantity || 0),
            };
          } else {
            mappedItem = {
              id: i?.id,
              quantity_counted: countedItem?.quantity,
              quantity_recorded: i?.quantity,
              quantity_difference: countedItem?.quantity - (i?.quantity || 0),
            };
          }
        }
        // Update reviewed item if count has changed
        else if (reviewedItem?.quantity_counted !== countedItem?.quantity) {
          mappedItem = {
            id: i?.id,
            quantity_counted: countedItem?.quantity || 0,
            quantity_recorded: i?.quantity,
            quantity_difference:
              (countedItem?.quantity || 0) - (i?.quantity || 0),
          };
        } else {
          mappedItem = reviewedItem;
        }
        return mappedItem;
      })
      ?.sort((a: ReviewedItemObject, b: ReviewedItemObject) => {
        if (a?.quantity_difference === 0 && b?.quantity_difference !== 0)
          return 1;
        if (b?.quantity_difference === 0 && a?.quantity_difference !== 0)
          return -1;
        return a?.quantity_difference - b?.quantity_difference;
      });
    setStocktake({ ...stocktake, reviewed_items: reviewedItems });
  }, stocktake?.counted_items);

  return (
    <div>
      <div className="font-bold text-xl">REVIEW ITEMS</div>
      <div
        className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 py-2`}
      >
        <div className="pl-3 pr-1">
          <SearchIcon />
        </div>
        <input
          className="w-full py-1 px-2 outline-none bg-transparent"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
        />
      </div>
      <div className="h-dialog overflow-y-scroll">
        {stocktake?.reviewed_items?.map((reviewedItem: ReviewedItemObject) => {
          const item: StockObject = inventory?.filter(
            (i: StockObject) => i?.id === reviewedItem?.id
          )[0];
          if (
            search !== "" &&
            !getItemSkuDisplayName(item)
              ?.toLowerCase?.()
              ?.includes?.(search?.toLowerCase?.())
          )
            return <div />;
          return (
            <ReviewListItem
              key={reviewedItem?.id}
              item={item}
              reviewedItem={reviewedItem}
              stocktake={stocktake}
              setStocktake={setStocktake}
            />
          );
        })}
      </div>
    </div>
  );
}
