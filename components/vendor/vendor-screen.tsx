// Packages
import { useState, useEffect, useMemo } from "react";
import { useAtom } from "jotai";

// DB
import {
  useVendors,
  useClerks,
  useStockInventory,
  useSalesJoined,
  useVendorPayments,
  useContacts,
} from "@/lib/swr-hooks";
import {
  clerkAtom,
  viewAtom,
  loadedContactObjectAtom,
  loadedVendorIdAtom,
  pageAtom,
} from "@/lib/atoms";
import {
  VendorObject,
  InventoryObject,
  VendorSaleItemObject,
  VendorPaymentObject,
  ContactObject,
  ClerkObject,
} from "@/lib/types";

// Functions
import {
  getItemDisplayName,
  getPaymentVars,
  fDate,
  nzDate,
} from "@/lib/data-functions";

// Components
import ScreenContainer from "@/components/container/screen";
import Select from "react-select";
import MaskedInput from "react-text-mask";
import TextField from "@/components/inputs/text-field";
import CreateableSelect from "@/components/inputs/createable-select";
import SettingsSelect from "@/components/inputs/settings-select";

export default function VendorScreen() {
  // Atoms
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom);
  const [view, setView] = useAtom(viewAtom);
  const [page] = useAtom(pageAtom);
  const [, setContact] = useAtom(loadedContactObjectAtom);
  const [clerk] = useAtom(clerkAtom);

  // SWR
  const { vendors, isVendorsLoading } = useVendors();
  const { clerks, isClerksLoading } = useClerks();
  const { contacts, isContactsLoading } = useContacts();
  const { inventory, isInventoryLoading } = useStockInventory();
  const { sales, isSalesLoading } = useSalesJoined();
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments();

  // State
  const [vendor, setVendor]: [VendorObject, Function] = useState({});

  // Load
  useEffect(() => {
    setVendor(
      (vendors || []).filter((v: VendorObject) => v?.id === loadedVendorId)[0]
    );
  }, [loadedVendorId]);

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

  // Constants
  const v = useMemo(
    () =>
      getPaymentVars(inventory, sales, vendorPayments, loadedVendorId[page]),
    [inventory, sales, vendorPayments, loadedVendorId]
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

  return (
    <ScreenContainer
      show={loadedVendorId[page]}
      closeFunction={() => setLoadedVendorId({ ...loadedVendorId, [page]: 0 })}
      title={vendor?.name}
      loading={
        isSalesLoading ||
        isClerksLoading ||
        isVendorsLoading ||
        isContactsLoading ||
        isInventoryLoading ||
        isVendorPaymentsLoading
      }
      buttons={[]}
    >
      <div className="flex">
        <div className={`flex flex-col mr-8 ${isNew ? "w-full" : "w-1/5"}`}>
          <div className="text-xl font-bold bg-col1 px-1">General Details</div>
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
          <div className="input-label">Primary Vendor Contact</div>
          <div className="self-center w-full">
            <CreateableSelect
              inputLabel="Select contact"
              fieldRequired
              value={vendor?.contact_id}
              label={
                (contacts || []).filter(
                  (c: ContactObject) => c?.id === vendor?.contact_id
                )[0]?.name || ""
              }
              onChange={(contactObject: any) => {
                setVendor({
                  ...vendor,
                  contact_id: parseInt(contactObject?.value),
                });
              }}
              onCreateOption={(inputValue: string) => {
                setContact({ name: inputValue });
                setView({ ...view, createContact: true });
              }}
              options={contacts?.map((val: ContactObject) => ({
                value: val?.id,
                label: val?.name || "",
              }))}
            />
          </div>

          <div className="input-label">Staff Contact</div>
          <div className="w-full">
            <Select
              value={{
                value: vendor?.clerk_id,
                label: (clerks || []).filter(
                  (c: ClerkObject) => c?.id === vendor?.clerk_id
                )[0]?.name,
              }}
              options={(clerks || []).map((clerk: ClerkObject) => ({
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
        {!isNew && (
          <div className="w-4/5 flex">
            {v && (
              <div className="w-1/3 px-4 border-l">
                <div className="text-xl font-bold bg-col2 px-1">
                  Sales Summary
                </div>
                {[
                  {
                    label: "Total Sales",
                    value: (v?.totalSales || []).length,
                  },
                  {
                    label: "Last Sale",
                    value: v?.lastSold ? fDate(v?.lastSold) : "N/A",
                  },
                  {
                    label: "Last Paid",
                    value: v?.lastPaid ? fDate(v?.lastPaid) : "N/A",
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
                    <div className={`${item.className || ""}`}>
                      {item.value}
                    </div>
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
                          const a = nzDate(saleA?.date_sale_closed);
                          const b = nzDate(saleB?.date_sale_closed);
                          return a < b ? 1 : b < a ? -1 : 0;
                        }
                      )
                      .slice(0, 5)
                      .map((sale: VendorSaleItemObject) => (
                        <div className="border-b mt-2">
                          <div className="font-bold text-sm">
                            {fDate(sale?.date_sale_closed)}
                          </div>
                          <div>{`${getItemDisplayName(
                            (inventory || []).filter(
                              (i: InventoryObject) => i?.id === sale?.item_id
                            )[0]
                          )} (${sale?.quantity})`}</div>
                        </div>
                      ))}
                  </div>
                )}

                {v?.totalPayments?.length > 0 && (
                  <div className="mt-4">
                    <div className="font-bold text-xl">Latest Payments</div>
                    {v?.totalPayments
                      .sort(
                        (
                          debitA: VendorPaymentObject,
                          debitB: VendorPaymentObject
                        ) => {
                          const a = nzDate(debitA?.date);
                          const b = nzDate(debitB?.date);
                          return a < b ? 1 : b < a ? -1 : 0;
                        }
                      )
                      .slice(0, 5)
                      .map((debit: VendorPaymentObject) => (
                        <div className="border-b mt-2">
                          <div className="font-bold text-sm">
                            {fDate(debit?.date)}
                          </div>
                          <div>{`$${(debit?.amount / 100)?.toFixed(2)} (${
                            debit?.type
                          })`}</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
            <div className="w-1/3 px-4 border-l">
              <div className="text-xl font-bold bg-col3 px-1">
                In Stock Items
              </div>
              {v?.totalItems
                .filter((item: InventoryObject) => item?.quantity > 0)
                .map((item: InventoryObject) => (
                  <StockItem key={item.id} item={item} />
                ))}
            </div>

            <div className="w-1/3 px-4 border-l">
              <div className="text-xl font-bold bg-col4 px-1">
                Out of Stock Items
              </div>
              {v?.totalItems
                .filter((item: InventoryObject) => (item?.quantity || 0) <= 0)
                .map((item: InventoryObject) => (
                  <StockItem item={item} />
                ))}
            </div>
          </div>
        )}
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
