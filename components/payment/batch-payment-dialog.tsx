import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { showBatchPaymentDialogAtom, clerkAtom } from "@/lib/atoms";
import {
  useInventory,
  useVendors,
  useVendorPayments,
  useSalesJoined,
  useRegisterID,
} from "@/lib/swr-hooks";
import { VendorObject } from "@/lib/types";
import { sub } from "date-fns";
import { CSVLink } from "react-csv";

// Actions
import { saveLog, saveVendorPaymentToDatabase } from "@/lib/db-functions";
import {
  getPaymentVars,
  getVendorQuantityInStock,
  writeKiwiBankBatchFile,
  fFileDate,
  nzDate,
} from "@/lib/data-functions";

// Material UI Components
import TextField from "@/components/inputs/text-field";
import Modal from "@/components/modal";

// Images

export default function BatchPaymentDialog() {
  const { registerID } = useRegisterID();
  const { inventory } = useInventory();
  const { vendors } = useVendors();
  const { sales } = useSalesJoined();
  const { vendorPayments } = useVendorPayments();
  const [clerk] = useAtom(clerkAtom);
  const [showBatchPaymentDialog, setShowBatchPaymentDialog] = useAtom(
    showBatchPaymentDialogAtom
  );
  const [submitting, setSubmitting] = useState(false);

  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [filterMinOwing, setFilterMinOwing] = useState("20");
  const [filterMinStock, setFilterMinStock] = useState("0");
  const [filterLastPay, setFilterLastPay] = useState("4");
  const [filterLastSold, setFilterLastSold] = useState("26");

  const payVendors = useMemo(
    () =>
      (vendors || [])
        .map((v: VendorObject) => {
          let saleInformation = getPaymentVars(
            inventory,
            sales,
            vendorPayments,
            v?.id
          );
          return {
            ...v,
            totalSell: saleInformation?.totalSell || 0,
            totalPaid: saleInformation?.totalPaid || 0,
            totalOwing: saleInformation?.totalOwing || 0,
            totalItemsInStock: getVendorQuantityInStock(inventory, v?.id),
            lastPaid: saleInformation?.lastPaid || null,
            lastSold: saleInformation?.lastSold || null,
          };
        })
        .filter(
          (v: VendorObject) =>
            (v?.totalOwing > 0 && v?.totalOwing > parseFloat(filterMinOwing)) ||
            v?.totalItemsInStock <= parseFloat(filterMinStock) ||
            nzDate(v?.lastSold) <=
              sub(new Date(), { weeks: parseInt(filterLastSold) }) ||
            nzDate(v?.lastPaid) <=
              sub(new Date(), { weeks: parseInt(filterLastPay) })
        ),
    [inventory, vendors]
  );

  return (
    <Modal
      open={Boolean(showBatchPaymentDialog)}
      onClose={() => setShowBatchPaymentDialog(false)}
    >
      <div className="bg-green-100 rounded p-4">
        <div className="text-xl font-bold">Filter Vendors</div>
        <div className="flex items-center">
          <div className="whitespace-nowrap mr-2">
            Show vendors owed more than{" "}
          </div>
          <TextField
            className="w-16"
            startAdornment="$"
            value={filterMinOwing}
            onChange={(e) => setFilterMinOwing(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <div className="whitespace-nowrap mr-2">
            Show vendors with less than or equal to{" "}
          </div>
          <TextField
            className="w-8"
            value={filterMinStock}
            onChange={(e) => setFilterMinStock(e.target.value)}
          />
          <div className="whitespace-nowrap ml-2">items in stock</div>
        </div>
        <div className="flex items-center">
          <div className="whitespace-nowrap mr-2">
            Show vendors who haven't been paid in the last{" "}
          </div>
          <TextField
            className="w-12"
            value={filterLastPay}
            onChange={(e) => setFilterLastPay(e.target.value)}
          />
          <div className="whitespace-nowrap ml-2">weeks</div>
        </div>
        <div className="flex items-center">
          <div className="whitespace-nowrap mr-2">
            Show vendors who haven't sold anything in the last{" "}
          </div>
          <TextField
            className="w-12"
            value={filterLastSold}
            onChange={(e) => setFilterLastSold(e.target.value)}
          />
          <div className="whitespace-nowrap ml-2">weeks</div>
        </div>
      </div>
      {payVendors.map((vendor: VendorObject) => (
        <div
          key={vendor?.id}
          className={`flex items-center py-2 border-b ${
            vendor?.bank_account_number ? "text-black" : "text-gray-200"
          }`}
        >
          <div className="w-full">
            {`[${vendor?.id}] ${vendor?.name}${
              vendor?.category ? ` (${vendor?.category})` : ""
            }${vendor?.bank_account_number ? "" : " NO BANK NUMBER"}`}
          </div>
          <TextField
            className="w-32"
            inputClass="text-right"
            disabled={!vendor?.bank_account_number}
            startAdornment="$"
            value={(
              paymentAmounts[vendor?.id] ||
              vendor?.totalOwing ||
              0
            ).toFixed(2)}
            onChange={(e: any) =>
              setPaymentAmounts({
                ...paymentAmounts,
                [vendor?.id]: e.target.value,
              })
            }
          />
        </div>
      ))}
      <div className="flex">
        <div className="dialog-action__button-div mb-4">
          <button
            className="dialog-action__cancel-button mr-2"
            onClick={() => setShowBatchPaymentDialog(false)}
          >
            CANCEL
          </button>
          <CSVLink
            className="dialog-action__ok-button text-center ml-2"
            data={writeKiwiBankBatchFile({
              transactions: payVendors
                .filter(
                  (vendor: VendorObject) =>
                    vendor?.bank_account_number &&
                    parseFloat(
                      paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
                    ) > 0
                )
                .map((vendor: VendorObject) => ({
                  name: vendor?.name || "",
                  accountNumber: vendor?.bank_account_number || "",
                  amount: parseFloat(
                    paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
                  ),
                })),
              vendors,
              batchNumber: `${registerID}`,
              sequenceNumber: "Test",
              storeAccountNumber: "",
            })}
            onClick={() => {
              // console.log(paymentAmounts);
              payVendors
                .filter(
                  (vendor: VendorObject) =>
                    vendor?.bank_account_number &&
                    parseFloat(
                      paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
                    ) > 0
                )
                .forEach(async (vendor: VendorObject) => {
                  const vendorPaymentId = await saveVendorPaymentToDatabase({
                    amount: Math.round(
                      parseFloat(
                        paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
                      ) * 100
                    ),
                    bank_account_number: vendor?.bank_account_number,
                    batch_number: "Test",
                    sequence_number: "Test",
                    clerk_id: clerk?.id,
                    vendor_id: vendor?.id,
                    register_id: registerID,
                    type: "batch",
                  });
                  await saveLog({
                    log: `Batch payment made to Vendor (${vendor?.id || ""}).`,
                    clerk_id: clerk?.id,
                    table_id: "vendor_payment",
                    row_id: vendorPaymentId,
                  });
                });
            }}
            filename={`batch-payment-${fFileDate()}.csv`}
          >
            MAKE PAYMENT
          </CSVLink>
        </div>
      </div>
    </Modal>
  );
}
