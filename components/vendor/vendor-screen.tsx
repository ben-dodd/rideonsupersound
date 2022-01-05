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
  InventoryObject,
  VendorSaleItemObject,
  VendorPaymentObject,
  CustomerObject,
  ClerkObject,
} from "@/lib/types";

// Functions
import { getItemDisplayName, getPaymentVars } from "@/lib/data-functions";

// Components
import ScreenContainer from "@/components/_components/container/screen";
import Tabs from "@/components/_components/navigation/tabs";
import Select from "react-select";
import MaskedInput from "react-text-mask";
import TextField from "@/components/_components/inputs/text-field";
import CreateableSelect from "@/components/_components/inputs/createable-select";
import SettingsSelect from "@/components/_components/inputs/settings-select";
import dayjs from "dayjs";

export default function VendorScreen() {
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

  // Functions
  function StockItem({ item }) {
    return (
      <div className={`flex justify-between my-2 border-b`}>
        <div className="flex">
          <div className="cursor-pointer w-1/3" onClick={() => null}></div>
          <div className="ml-8 w-2/3">
            {getItemDisplayName(item)}
            <div
              className={`mt-8 ${
                (item?.quantity || 0) <= 0 ? "text-tertiary" : "text-black"
              }`}
            >{`${item?.quantity || 0} in stock.`}</div>
          </div>
        </div>
      </div>
    );
  }

  // TODO DISPLAY VENDORS as tab screen - General, sales summary, in stock, out of stock

  // Constants
  const v = useMemo(
    () =>
      getPaymentVars(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId[page]]
  );

  const bankAccountMask = [
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
  ];
  const isNew = !vendor?.id;
  // TODO make tabs component
  // TODO make stepper component

  return (
    <ScreenContainer
      show={loadedVendorId[page]}
      closeFunction={() => setLoadedVendorId({ ...loadedVendorId, [page]: 0 })}
      title={vendor?.name}
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isVendorsLoading ||
        isCustomersLoading ||
        isInventoryLoading ||
        isVendorPaymentsLoading
      }
      buttons={[]}
    >
      <div className="flex flex-col w-full">
        <Tabs
          tabs={["General Details", "Sales", "Items", "Payments"]}
          value={tab}
          onChange={setTab}
        />
        <div hidden={tab !== 0} className="max-w-sm">
          <TextField
            inputLabel="Name"
            value={vendor?.name || ""}
            onChange={(e: any) =>
              setVendor({ ...vendor, name: e.target.value })
            }
          />
          <SettingsSelect
            object={vendor}
            onEdit={setVendor}
            inputLabel="Vendor Category"
            dbField="category"
            isCreateDisabled={true}
          />

          <div className="input-label">Staff Contact</div>
          <div className="w-full">
            <Select
              value={{
                value: vendor?.clerk_id,
                label: clerks?.filter(
                  (c: ClerkObject) => c?.id === vendor?.clerk_id
                )[0]?.name,
              }}
              options={clerks?.map((clerk: ClerkObject) => ({
                value: clerk?.id,
                label: clerk?.name,
              }))}
              onChange={(e: any) =>
                setVendor({
                  ...vendor,
                  clerk_id: e.value,
                })
              }
            />
          </div>
          <div className="input-label">Bank Account Number</div>

          <div className="text-field">
            <MaskedInput
              className="text-field__input"
              mask={bankAccountMask}
              guide={false}
              value={vendor?.bank_account_number || ""}
              onChange={(e) =>
                setVendor({
                  ...vendor,
                  bank_account_number: e.target.value,
                })
              }
            />
          </div>
          <TextField
            inputLabel="Contact Name"
            value={vendor?.contact_name || ""}
            onChange={(e: any) =>
              setVendor({ ...vendor, contact_name: e.target.value })
            }
          />
          <TextField
            inputLabel="Phone"
            value={vendor?.phone || ""}
            onChange={(e: any) =>
              setVendor({ ...vendor, phone: e.target.value })
            }
          />
          <TextField
            inputLabel="Postal Address"
            value={vendor?.postal_address || ""}
            onChange={(e: any) =>
              setVendor({ ...vendor, postal_address: e.target.value })
            }
            multiline
            rows={3}
          />
          <TextField
            inputLabel="Notes"
            value={vendor?.note || ""}
            onChange={(e) => setVendor({ ...vendor, note: e.target.value })}
            multiline
            rows={3}
          />
        </div>
        <div hidden={tab !== 1}>
          {[
            {
              label: "Total Sales",
              value: v?.totalSales?.length,
            },
            {
              label: "Last Sale",
              value: v?.lastSold
                ? dayjs(v?.lastSold).format("D MMMM YYYY")
                : "N/A",
            },
            {
              label: "Last Paid",
              value: v?.lastPaid
                ? dayjs(v?.lastPaid).format("D MMMM YYYY")
                : "N/A",
            },
            {
              label: "Total Take",
              value: `$${(v?.totalSell || 0)?.toFixed(2)}`,
              className: "text-primary",
            },
            {
              label: "Total Paid",
              value: `$${(v?.totalPaid || 0)?.toFixed(2)}`,
              className: "text-secondary",
            },
            {
              label: "Total Owed",
              value: `$${(v?.totalOwing || 0)?.toFixed(2)}`,
              className: "text-tertiary",
            },
          ].map((item) => (
            <div className="flex" key={item.label}>
              <div className="w-36 font-bold">{item.label}</div>
              <div className={`${item.className || ""}`}>{item.value}</div>
            </div>
          ))}
          {v?.totalSales?.length > 0 && (
            <div className="mt-4">
              <div className="font-bold text-xl">Latest Sales</div>
              {v?.totalSales
                ?.sort(
                  (
                    saleA: VendorSaleItemObject,
                    saleB: VendorSaleItemObject
                  ) => {
                    const a = dayjs(saleA?.date_sale_closed);
                    const b = dayjs(saleB?.date_sale_closed);
                    return a < b ? 1 : b < a ? -1 : 0;
                  }
                )
                ?.slice(0, 5)
                ?.map((sale: VendorSaleItemObject) => (
                  <div className="border-b mt-2">
                    <div className="font-bold text-sm">
                      {dayjs(sale?.date_sale_closed).format("D MMMM YYYY")}
                    </div>
                    <div>{`${getItemDisplayName(
                      inventory?.filter(
                        (i: InventoryObject) => i?.id === sale?.item_id
                      )[0]
                    )} (${sale?.quantity})`}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div hidden={tab !== 2}>
          <div className="text-xl font-bold bg-col3 px-1">In Stock Items</div>
          {v?.totalItems
            ?.filter((item: InventoryObject) => item?.quantity > 0)
            ?.map((item: InventoryObject) => (
              <StockItem key={item.id} item={item} />
            ))}
          <div className="text-xl font-bold bg-col4 px-1">
            Out of Stock Items
          </div>
          {v?.totalItems
            ?.filter((item: InventoryObject) => (item?.quantity || 0) <= 0)
            ?.map((item: InventoryObject) => (
              <StockItem item={item} />
            ))}
        </div>
        <div hidden={tab !== 3}>
          <div className="font-bold text-xl">Latest Payments</div>
          {v?.totalPayments
            ?.sort(
              (debitA: VendorPaymentObject, debitB: VendorPaymentObject) => {
                const a = dayjs(debitA?.date);
                const b = dayjs(debitB?.date);
                return a < b ? 1 : b < a ? -1 : 0;
              }
            )
            ?.slice(0, 5)
            ?.map((debit: VendorPaymentObject) => (
              <div className="border-b mt-2">
                <div className="font-bold text-sm">
                  {dayjs(debit?.date).format("D MMMM YYYY")}
                </div>
                <div>{`$${(debit?.amount / 100)?.toFixed(2)} (${
                  debit?.type
                })`}</div>
              </div>
            ))}
        </div>
      </div>
    </ScreenContainer>
  );
}

// onClickOk={() => {
//   updateData({
//     dispatch,
//     collection: "vendors",
//     doc: get(vendor, "id", nextVendorId),
//     update: get(vendor, "id") ? vendor : { ...vendor, id: nextVendorId },
//     forceNew: !get(vendor, "id"),
//     dialog: "vendor",
//     onDataUpdated: (id) => {
//       if (
//         !isEqual(
//           vendor,
//           get(vendors, get(vendorDialog, "vendorId", null), {})
//         )
//       ) {
//         if (get(vendor, "id"))
//           addLog(
//             `Vendor updated.`,
//             "vendors",
//             get(vendor, "id"),
//             currentStaff
//           );
//         else {
//           addLog(`Vendor created.`, "vendors", id, currentStaff);
//           updateData({
//             dispatch,
//             collection: "settings",
//             doc: "ids",
//             storeAs: "ids",
//             update: { vendor: nextVendorId + 1 },
//           });
//         }
//       }
//     },
//   });
//   dispatch(closeDialog("vendor"));
// }}
