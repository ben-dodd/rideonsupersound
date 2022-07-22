// DB
import { useInventory } from "@/lib/swr-hooks";
import { StockObject, VendorSaleItemObject } from "@/lib/types";

// Functions
import { getCartItemPrice, getItemDisplayName } from "@/lib/data-functions";

// Components
import dayjs from "dayjs";
import { CSVLink } from "react-csv";

export default function VendorSales({ vendor, vendorDetails }) {
  // SWR
  const { inventory } = useInventory();

  return (
    <div>
      {vendorDetails?.totalSales?.length > 0 && (
        <div className="mt-4">
          <CSVLink
            className={`bg-white hover:bg-gray-100 disabled:bg-gray-200 p-2 rounded border`}
            filename={`${vendor?.name}-sales-${dayjs().format(
              "YYYY-MM-DD"
            )}.csv`}
            data={vendorDetails?.totalSales?.map((s) => {
              const prices = getCartItemPrice(s, null);
              return { ...s, ...prices };
            })}
          >
            DOWNLOAD DATA
          </CSVLink>
          <div className="border-b mb-2 flex text-sm mt-4">
            <div className="w-1/12">ID</div>
            <div className="w-1/6">DATE SOLD</div>
            <div className="w-1/3">ITEM SOLD</div>
            <div className="w-1/6">FORMAT</div>
            <div className="w-1/6">TOTAL SELL</div>
            <div className="w-1/12">VENDOR TAKE</div>
          </div>

          <div className="border-b py-1 flex text-sm font-bold">
            <div className="w-3/12" />
            <div className="w-1/2">{`${vendorDetails?.totalSales?.length} ITEM${
              vendorDetails?.totalSales?.length === 1 ? "" : "S"
            } SOLD`}</div>
            <div className="w-1/6">
              {`$${(
                (vendorDetails?.totalStoreCut + vendorDetails?.totalSell) /
                100
              )?.toFixed(2)}`}
            </div>
            <div className="w-1/12">
              {`$${(vendorDetails?.totalSell / 100)?.toFixed(2)}`}
            </div>
          </div>
          {vendorDetails?.totalSales
            ?.sort(
              (saleA: VendorSaleItemObject, saleB: VendorSaleItemObject) => {
                const a = dayjs(saleA?.date_sale_closed);
                const b = dayjs(saleB?.date_sale_closed);
                return a < b ? 1 : b < a ? -1 : 0;
              }
            )
            // ?.slice(0, 5)
            ?.map((sale: VendorSaleItemObject) => {
              const stockItem: StockObject = inventory?.filter(
                (i: StockObject) => i?.id === sale?.item_id
              )[0];
              const prices = getCartItemPrice(sale, null);
              return (
                <div
                  className="border-b py-1 flex hover:bg-gray-100 text-sm"
                  key={`${sale?.sale_id}${sale?.item_id}`}
                >
                  <div className="w-1/12">#{sale?.id}</div>
                  <div className="font-bold w-1/6">
                    {dayjs(sale?.date_sale_closed).format("D MMMM YYYY")}
                  </div>
                  <div className="w-1/3">{`${
                    sale?.quantity
                  } x ${getItemDisplayName(stockItem)}${
                    sale?.is_refunded ? " [REFUNDED]" : ""
                  }`}</div>
                  <div className="w-1/6">{stockItem?.format}</div>
                  <div
                    className={`w-1/6${
                      sale?.is_refunded ? " line-through" : ""
                    }`}
                  >
                    {`$${(prices?.totalPrice / 100)?.toFixed(2)}`}
                  </div>
                  <div
                    className={`w-1/12${
                      sale?.is_refunded ? " line-through" : ""
                    }`}
                  >
                    {`$${(prices?.vendorPrice / 100)?.toFixed(2)}${
                      sale?.vendor_discount
                        ? ` (${sale?.vendor_discount}% DISCOUNT)`
                        : ""
                    }`}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
