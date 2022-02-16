// Packages
import { useState, useEffect, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useVendors,
  useClerks,
  useInventory,
  useSalesJoined,
  useVendorPayments,
  useCustomers,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  viewAtom,
  loadedCustomerObjectAtom,
  loadedVendorIdAtom,
  pageAtom,
} from "@/lib/atoms";
import {
  VendorObject,
  StockObject,
  VendorSaleItemObject,
  VendorPaymentObject,
  CustomerObject,
  ClerkObject,
} from "@/lib/types";

// Functions
import { getItemDisplayName, getVendorDetails } from "@/lib/data-functions";

// Components
import ScreenContainer from "@/components/_components/container/screen";
import Tabs from "@/components/_components/navigation/tabs";
import Select from "react-select";
import MaskedInput from "react-text-mask";
import TextField from "@/components/_components/inputs/text-field";
import CreateableSelect from "@/components/_components/inputs/createable-select";
import SettingsSelect from "@/components/_components/inputs/settings-select";
import dayjs from "dayjs";

export default function VendorPayments() {
  // Atoms
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);
  const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);
  const [, setCustomer] = useAtom(loadedCustomerObjectAtom);
  const [clerk] = useAtom(clerkAtom);

  // SWR
  const { vendors, isVendorsLoading } = useVendors();
  const { clerks, isClerksLoading } = useClerks();
  const { customers, isCustomersLoading } = useCustomers();
  const { inventory, isInventoryLoading } = useInventory();
  const { sales, isSalesLoading } = useSalesJoined();
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments();

  // State
  const [vendor, setVendor]: [VendorObject, Function] = useState({});
  const [tab, setTab] = useState(0);

  // Load
  useEffect(() => {
    setVendor(
      vendors?.filter((v: VendorObject) => v?.id === loadedVendorId[page])[0]
    );
  }, [loadedVendorId[page]]);

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
          <div className="border-b mb-2 flex text-sm">
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
              console.log(debit);
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
