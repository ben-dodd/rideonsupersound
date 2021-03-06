// Packages
import { useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useInventory,
  useSalesJoined,
  useVendorPayments,
} from "@/lib/swr-hooks";
import { loadedVendorIdAtom, pageAtom } from "@/lib/atoms";
import { VendorObject, VendorPaymentObject } from "@/lib/types";

// Functions
import { getVendorDetails } from "@/lib/data-functions";

// Components
import dayjs from "dayjs";
import { CSVLink } from "react-csv";

export default function VendorPayments({ vendor }) {
  // Atoms
  const [loadedVendorId] = useAtom(loadedVendorIdAtom);
  const [page] = useAtom(pageAtom);

  // SWR
  const { inventory } = useInventory();
  const { sales } = useSalesJoined();
  const { vendorPayments } = useVendorPayments();

  // Constants
  const vendorDetails = useMemo(
    () =>
      getVendorDetails(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId[page]]
  );

  return (
    <div>
      {vendorDetails?.totalPayments?.length > 0 && (
        <div className="mt-4">
          <CSVLink
            className={`bg-white hover:bg-gray-100 disabled:bg-gray-200 p-2 rounded border`}
            filename={`${vendor?.name}-payments-${dayjs().format(
              "YYYY-MM-DD"
            )}.csv`}
            data={vendorDetails?.totalPayments}
          >
            DOWNLOAD DATA
          </CSVLink>
          <div className="border-b mb-2 flex text-sm mt-4">
            <div className="w-1/6">DATE SOLD</div>
            <div className="w-1/2" />
            <div className="w-1/6">TYPE</div>
            <div className="w-1/6 text-right">AMOUNT</div>
            {/* <div className="w-1/3">ITEM SOLD</div> */}
            {/* <div className="w-1/6">FORMAT</div>
          <div className="w-1/6">TOTAL SELL</div>
          <div className="w-1/6">VENDOR TAKE</div> */}
          </div>

          <div className="border-b py-1 flex text-sm font-bold">
            <div className="w-1/6" />
            <div className="w-1/2" />
            <div className="w-1/6">{`${
              vendorDetails?.totalPayments?.length
            } PAYMENT${
              vendorDetails?.totalPayments?.length === 1 ? "" : "S"
            } MADE`}</div>
            <div className="w-1/6 text-right">
              {`$${(
                vendorDetails?.totalPayments?.reduce(
                  (prev, curr) => prev + curr?.amount,
                  0
                ) / 100
              )?.toFixed(2)}`}
            </div>
          </div>

          {vendorDetails?.totalPayments
            ?.sort(
              (debitA: VendorPaymentObject, debitB: VendorPaymentObject) => {
                const a = dayjs(debitA?.date);
                const b = dayjs(debitB?.date);
                return a < b ? 1 : b < a ? -1 : 0;
              }
            )
            // ?.slice(0, 5)
            ?.map((debit: VendorPaymentObject) => {
              return (
                <div
                  className="border-b py-1 flex hover:bg-gray-100 text-sm"
                  key={debit?.id}
                >
                  <div className="font-bold w-1/6">
                    {dayjs(debit?.date).format("D MMMM YYYY")}
                  </div>
                  <div className="w-1/2" />
                  <div className="w-1/6">{debit?.type?.toUpperCase()}</div>
                  {/* <div className="w-1/3">{`${
                  sale?.quantity
                } x ${getItemDisplayName(stockItem)}`}</div>
                <div className="w-1/6">{stockItem?.format}</div>
                <div className="w-1/6">
                  {sale?.total_sell
                    ? `$${(sale?.total_sell / 100)?.toFixed(2)}`
                    : "N/A"}
                </div> */}
                  <div className="w-1/6 text-right">
                    {debit?.amount
                      ? `$${(debit?.amount / 100)?.toFixed(2)}`
                      : "N/A"}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
