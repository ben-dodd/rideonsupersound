import {
  getGrossProfit,
  getImageSrc,
  getItemSku,
  getProfitMargin,
} from "@/lib/data-functions";
import { InventoryObject } from "@/lib/types";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import ChangePriceIcon from "@mui/icons-material/AutoFixNormal";
import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";

interface priceDetailsProps {
  item: InventoryObject;
}

export default function PriceDetails({ item }: priceDetailsProps) {
  const [view, setView] = useAtom(viewAtom);

  return (
    <div className="grid grid-cols-6 gap-2 mt-4 mb-4">
      <Tooltip title="Click to change the price on this item.">
        <div className="flex justify-center items-center text-xl hover:text-primary">
          <button onClick={() => setView({ ...view, changePriceDialog: true })}>
            <ChangePriceIcon />
          </button>
        </div>
      </Tooltip>
      <div>
        <div className="px-1 text-xs mt-2 mb-2">COST PRICE</div>
        <div className="font-bold text-xl">
          {`$${(item?.vendor_cut / 100)?.toFixed(2)}` || "N/A"}
        </div>
      </div>
      <div>
        <div className="px-1 text-xs mt-2 mb-2">STORE CUT</div>
        <div className="font-bold text-xl">{getGrossProfit(item) || "N/A"}</div>
      </div>
      <div>
        <div className="px-1 text-xs mt-2 mb-2">MARGIN</div>
        <div className="font-bold text-xl">
          {getProfitMargin(item) || "N/A"}
        </div>
      </div>
      <div className="flex justify-center items-center p-4 bg-tertiary-dark rounded col-start-5 col-end-7">
        <div className="font-bold text-4xl text-white">
          {`$${(item?.total_sell / 100)?.toFixed(2)}` || "N/A"}
        </div>
      </div>
    </div>
  );
}
