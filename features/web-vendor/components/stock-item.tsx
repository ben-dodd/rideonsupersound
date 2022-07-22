import { getImageSrc, getItemSku } from "@/lib/data-functions";

export default function StockItem({ item }) {
  return (
    <div
      className={`flex w-full mb-2 pr-2 text-black ${
        item?.quantity < 1 ? "bg-pink-100" : "bg-gray-200"
      }`}
    >
      <div className="w-32">
        <img
          className={`object-cover h-32 ${
            item?.quantity < 1 ? " opacity-50" : ""
          }`}
          src={getImageSrc(item)}
          alt={item?.title || "Inventory image"}
        />
        <div className="text-lg font-bold text-center bg-black text-white w-32">
          {getItemSku(item)}
        </div>
      </div>
      <div className="flex flex-col justify-between pl-2 w-full">
        <div>
          <div className="flex justify-between border-b items-center border-gray-400">
            <div>
              <div className="font-bold text-md">{`${
                item?.title || "Untitled"
              }`}</div>
              <div className="text-md">{`${item?.artist || "Untitled"}`}</div>
            </div>
            <div className="text-red-400 font-bold text-xl text-right">
              {item?.quantity < 1 ? "OUT OF STOCK!" : ""}
            </div>
          </div>
          <div className="text-sm text-green-800">{`${
            item?.genre ? `${item.genre} / ` : ""
          }${item?.format} [${
            item?.is_new ? "NEW" : item?.cond?.toUpperCase() || "USED"
          }]`}</div>
        </div>

        <div className="flex justify-between items-end">
          <div
            className={`text-md ${item?.quantity < 1 && "text-red-500"}`}
          >{`${item?.quantity} in stock${
            item?.quantity_hold ? `, ${-item?.quantity_hold} on hold` : ""
          }${
            item?.quantity_layby ? `, ${-item?.quantity_layby} on layby` : ""
          }`}</div>
          <div className="text-xl pr-2">{`$${(
            (item?.total_sell || 0) / 100
          )?.toFixed(2)}`}</div>
        </div>
      </div>
    </div>
  );
}
