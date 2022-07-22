import {
  getGrossProfit,
  getImageSrc,
  getItemSku,
  getProfitMargin,
} from "@/lib/data-functions";
import { StockObject } from "@/lib/types";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import ChangePriceIcon from "@mui/icons-material/AutoFixNormal";
import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

interface priceDetailsProps {
  item: StockObject;
}

export default function PriceDetails({ item }: priceDetailsProps) {
  const [view, setView] = useAtom(viewAtom);

  return (
    <>
      <div className="grid grid-cols-6 gap-2 mt-4 mb-4">
        <div>
          {(!item?.is_new && !item?.cond) ||
          !(
            item?.discogsItem?.priceSuggestions &&
            item?.discogsItem?.priceSuggestions[
              item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"
            ]?.value
          ) ? (
            <div />
          ) : (
            <>
              <div className="px-1 text-xs mt-2 mb-2">DISCOGS</div>
              <div className="font-bold text-xl">
                {`$${parseFloat(
                  item?.discogsItem?.priceSuggestions[
                    item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"
                  ]?.value
                )?.toFixed(2)}`}
              </div>
            </>
          )}
        </div>
        <div>
          <div className="px-1 text-xs mt-2 mb-2">COST PRICE</div>
          <div className="font-bold text-xl">
            {`$${(item?.vendor_cut / 100)?.toFixed(2)}` || "N/A"}
          </div>
        </div>
        <div>
          <div className="px-1 text-xs mt-2 mb-2">STORE CUT</div>
          <div className="font-bold text-xl">
            {getGrossProfit(item) || "N/A"}
          </div>
        </div>
        <div>
          <div className="px-1 text-xs mt-2 mb-2">MARGIN</div>
          <div className="font-bold text-xl">
            {getProfitMargin(item) || "N/A"}
          </div>
        </div>
        <div className="col-start-5 col-end-7">
          <div className="flex justify-center items-center p-4 bg-tertiary-dark">
            <div className="font-bold text-4xl text-white">
              {`$${(item?.total_sell / 100)?.toFixed(2)}` || "N/A"}
            </div>
          </div>
          <button
            onClick={() => setView({ ...view, changePriceDialog: true })}
            className="bg-brown-dark hover:bg-brown p-2 w-full text-white"
          >
            CHANGE PRICE
          </button>
        </div>
      </div>
    </>
  );
}
