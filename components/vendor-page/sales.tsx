import { useVendorStockByUid } from "@/lib/swr-hooks";
import dayjs from "dayjs";
// import { XYPlot, VerticalBarSeries, XAxis, YAxis } from "react-vis";
// import { timeFormatDefaultLocale } from "d3-time-format";

export default function Sales({ id, sales }) {
  const { vendorStock } = useVendorStockByUid(id);

  return (
    <div className="w-full">
      <div className="bg-orange-800 text-white font-bold italic px-2 py-1 mb-2">
        RIDE ON SUPER SOUND SALES
      </div>
      {sales?.length === 0 ? (
        <div>NO SALES</div>
      ) : (
        <div>
          <div className="flex bg-black py-2 text-white text-xs">
            <div className="w-1/12 px-1">DATE SOLD</div>
            <div className="w-1/12 px-1">STOCK REMAINING</div>
            <div className="w-2/12 px-1">FORMAT</div>
            <div className="w-2/12 px-1">ARTIST</div>
            <div className="w-3/12 px-1">TITLE</div>
            <div className="w-1/12 px-1 text-right">RETAIL PRICE</div>
            <div className="w-1/12 px-1 text-right">ROSS TAKE</div>
            <div className="w-1/12 px-1 text-right">VENDOR TAKE</div>
          </div>
          {sales?.map((sale) => {
            // console.log(sale);
            const stockItem = vendorStock?.filter(
              (s) => s?.id === sale?.item_id
            )[0];
            // console.log(stockItem);
            return (
              <div
                key={`${sale?.sale_id}-${sale?.item_id}`}
                className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-transparent"
              >
                <div className="w-1/12 px-1">
                  {dayjs(sale?.date_sale_closed).format("DD/MM/YYYY")}
                </div>
                <div className="w-1/12 px-1">{stockItem?.quantity}</div>
                <div className="w-2/12 px-1">{stockItem?.format}</div>
                <div className="w-2/12 px-1">{stockItem?.artist}</div>
                <div className="w-3/12 px-1">{stockItem?.title}</div>
                <div className="w-1/12 px-1 text-right">
                  ${(sale?.total_sell / 100)?.toFixed(2)}
                </div>
                <div className="w-1/12 px-1 text-right">
                  ${((sale?.total_sell - sale?.vendor_cut) / 100)?.toFixed(2)}
                </div>
                <div className="w-1/12 px-1 text-right">
                  ${(sale?.vendor_cut / 100)?.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* <XYPlot height={300} width={300}>
        <VerticalBarSeries data={saleData} />
        <XAxis />
        <YAxis />
      </XYPlot> */}
    </div>
  );
}
