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
import { ClerkObject } from "@/lib/types";

// Components
import Select from "react-select";
import MaskedInput from "react-text-mask";
import TextField from "@/components/_components/inputs/text-field";
import SettingsSelect from "@/components/_components/inputs/settings-select";
import dayjs from "dayjs";

export default function GeneralDetails({ vendor, setVendor, vendorDetails }) {
  // SWR
  const { clerks } = useClerks();

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

  return (
    <div className="flex w-full">
      <div className="w-1/2">
        <TextField
          inputLabel="Name"
          value={vendor?.name || ""}
          onChange={(e: any) => setVendor({ ...vendor, name: e.target.value })}
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

        <div
          className={`mb-1 flex transition-all items-center rounded-sm ring-1 ring-gray-400 bg-gray-100 hover:bg-gray-200`}
        >
          <MaskedInput
            className={`appearance-none w-full py-1 px-2 outline-none bg-transparent`}
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
        <div className="flex cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={vendor?.store_credit_only}
            onChange={(e) =>
              setVendor({ ...vendor, store_credit_only: e.target.checked })
            }
          />
          <div className="ml-2">Store Credit Only</div>
        </div>
        <div className="flex cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={vendor?.email_vendor}
            onChange={(e) =>
              setVendor({ ...vendor, email_vendor: e.target.checked })
            }
          />
          <div className="ml-2">Email Vendor</div>
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
          onChange={(e: any) => setVendor({ ...vendor, phone: e.target.value })}
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
      <div className="w-1/2">
        <div className="ml-4 grid grid-cols-2 justify-items-start rounded border p-2 mt-2">
          <div>TOTAL SALES</div>
          <div>{vendorDetails?.totalSales?.length || 0}</div>
          <div>LAST SALE</div>
          <div>
            {vendorDetails?.lastSold
              ? dayjs(vendorDetails?.lastSold).format("D MMMM YYYY")
              : "N/A"}
          </div>
          <div>LAST PAID</div>
          <div>
            {vendorDetails?.lastPaid
              ? dayjs(vendorDetails?.lastPaid).format("D MMMM YYYY")
              : "N/A"}
          </div>
          <div>TOTAL TAKE</div>
          <div>{`$${(vendorDetails?.totalSell || 0)?.toFixed(2)}`}</div>
          <div>TOTAL PAID</div>
          <div>{`$${(vendorDetails?.totalPaid || 0)?.toFixed(2)}`}</div>
          <div>TOTAL OWED</div>
          <div>{`$${(vendorDetails?.totalOwing || 0)?.toFixed(2)}`}</div>
        </div>
        <div />
      </div>
    </div>
  );
}