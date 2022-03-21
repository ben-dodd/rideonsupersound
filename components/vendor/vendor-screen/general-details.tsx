// DB
import { useClerks } from "@/lib/swr-hooks";
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
          dbField="vendor_category"
          isCreateDisabled={true}
        />

        <div className="input-label">Staff Contact</div>
        <div className="w-full">
          <Select
            isClearable
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
                clerk_id: e?.value || null,
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
        <div className="flex mt-2">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={vendor?.store_credit_only}
            onChange={(e) =>
              setVendor({ ...vendor, store_credit_only: e.target.checked })
            }
          />
          <div className="ml-2">Store Credit Only</div>
        </div>
        <div className="flex mt-2">
          <input
            type="checkbox"
            className="cursor-pointer"
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
          inputLabel="Email"
          value={vendor?.email || ""}
          onChange={(e: any) => setVendor({ ...vendor, email: e.target.value })}
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
          <div>{`$${(vendorDetails?.totalSell
            ? vendorDetails?.totalSell / 100
            : 0
          )?.toFixed(2)}`}</div>
          <div>TOTAL PAID</div>
          <div>{`$${(vendorDetails?.totalPaid
            ? vendorDetails?.totalPaid / 100
            : 0
          )?.toFixed(2)}`}</div>
          <div>TOTAL OWED</div>
          <div>{`$${(vendorDetails?.totalOwing
            ? vendorDetails?.totalOwing / 100
            : 0
          )?.toFixed(2)}`}</div>
        </div>
        <div />
      </div>
    </div>
  );
}
