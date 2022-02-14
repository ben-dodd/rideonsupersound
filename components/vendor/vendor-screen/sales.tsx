// DB
import { useInventory } from "@/lib/swr-hooks";
import { StockObject, VendorSaleItemObject } from "@/lib/types";

// Functions
import { getItemDisplayName } from "@/lib/data-functions";

// Components
import dayjs from "dayjs";

export default function VendorSales({ vendorDetails }) {
  // SWR
  const { inventory } = useInventory();

  return (
    <div>
      {vendorDetails?.totalSales?.length > 0 && (
        <div className="mt-4">
          <div className="font-bold text-xl">Sales</div>
          {vendorDetails?.totalSales
            ?.sort(
              (saleA: VendorSaleItemObject, saleB: VendorSaleItemObject) => {
                const a = dayjs(saleA?.date_sale_closed);
                const b = dayjs(saleB?.date_sale_closed);
                return a < b ? 1 : b < a ? -1 : 0;
              }
            )
            // ?.slice(0, 5)
            ?.map((sale: VendorSaleItemObject) => (
              <div className="border-b mt-2">
                <div className="font-bold text-sm">
                  {dayjs(sale?.date_sale_closed).format("D MMMM YYYY")}
                </div>
                <div>{`${getItemDisplayName(
                  inventory?.filter(
                    (i: StockObject) => i?.id === sale?.item_id
                  )[0]
                )} (${sale?.quantity})`}</div>
                <div>{sale?.sale_id}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
