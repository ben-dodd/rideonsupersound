// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useAllInventory, useSaleItemsForSale, useLogs } from "@/lib/swr-hooks";
import { cartAtom, alertAtom, clerkAtom } from "@/lib/atoms";
import { StockObject, SaleObject, SaleItemObject } from "@/lib/types";
import { MouseEventHandler } from "react";

// Functions
import {
  getItemSku,
  getItemDisplayName,
  writeCartItemPriceBreakdown,
  getImageSrc,
} from "@/lib/data-functions";
import {
  updateSaleItemInDatabase,
  saveLog,
  deleteSaleItemFromDatabase,
} from "@/lib/db-functions";

// Components
import Image from "next/image";

export default function StockListItem({ id }) {
  // SWR
  const { inventory } = useAllInventory();
  const item: StockObject = inventory?.filter((i) => i?.id === id)?.[0];

  // Functions

  return (
    <div className={`flex w-full relative pt mb-2`}>
      {/* <div className="w-20">
        <div className="w-20 h-20 relative">
          <img
            className="object-cover absolute"
            // layout="fill"
            // objectFit="cover"
            src={getImageSrc(item)}
            alt={item?.title || "Inventory image"}
          />
        </div>
      </div> */}
      <div className="flex w-full py-2 pl-2 justify-between">
        <div className="text-sm pl-1">
          <div>{getItemDisplayName(item)}</div>
        </div>
      </div>
      <div className={`text-red-500`}>
        <div>{item?.quantity}</div>
        {/* <div>{writeCartItemPriceBreakdown(saleItem, item)}</div> */}
      </div>
    </div>
  );
}
