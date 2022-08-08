// DB
import { useClerks, useInventory, useLogs, useVendors } from 'lib/database/read'
import { ClerkObject } from 'lib/types'

// Components
import SettingsSelect from 'components/inputs/settings-select'
import TextField from 'components/inputs/text-field'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import {
  clerkAtom,
  confirmModalAtom,
  loadedVendorIdAtom,
  pageAtom,
} from 'lib/atoms'
import { deleteVendorFromDatabase, saveLog } from 'lib/db-functions'
import Select from 'react-select'
import MaskedInput from 'react-text-mask'

import DeleteIcon from '@mui/icons-material/Delete'

export default function GeneralDetails({ vendor, setVendor, vendorDetails }) {
  // SWR
  const { clerks } = useClerks()
  const [clerk] = useAtom(clerkAtom)
  const [, setConfirmModal] = useAtom(confirmModalAtom)
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom)
  const [page] = useAtom(pageAtom)
  const { logs, mutateLogs } = useLogs()
  const { vendors, mutateVendors } = useVendors()
  const { inventory } = useInventory()

  const bankAccountMask = [
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
  ]

  const vendorIsUsed =
    inventory?.filter((i) => i?.vendor_id === vendor?.id)?.length > 0

  // Functions
  function onClickDelete() {
    // REVIEW Delete inventory item
    // const itemIsPartOfSale =
    //   saleItems?.filter((s) => s?.item_id === item?.id)?.length > 0;
    setConfirmModal({
      open: true,
      title: 'Are you sure you want to delete this item?',
      styledMessage: (
        <div>
          {vendorIsUsed ? (
            <>
              <div className="text-red-500 text-lg text-center p-2 border-red-500">
                SORRY
              </div>
              <div>
                This vendor has items assigned to them and cannot be deleted.
              </div>
            </>
          ) : (
            <div>This will delete the vendor.</div>
          )}
        </div>
      ),
      yesText: vendorIsUsed ? 'OK' : "YES, I'M SURE",
      action: vendorIsUsed
        ? () => {}
        : async () =>
            deleteVendorFromDatabase(vendor?.id)?.then(() => {
              mutateVendors(
                vendors?.filter((v) => v?.id !== vendor?.id),
                false
              )
              saveLog(
                `Vendor #${vendor?.id} ${vendor?.name} deleted.`,
                clerk?.id,
                'vendor',
                vendor?.id
              )
              setLoadedVendorId({ ...loadedVendorId, [page]: 0 })
            }),
    })
  }

  return (
    <div className="flex w-full">
      <div className="w-1/2">
        <TextField
          inputLabel="Name"
          value={vendor?.name || ''}
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
            value={vendor?.bank_account_number || ''}
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
          value={vendor?.contact_name || ''}
          onChange={(e: any) =>
            setVendor({ ...vendor, contact_name: e.target.value })
          }
        />
        <TextField
          inputLabel="Email"
          value={vendor?.email || ''}
          onChange={(e: any) => setVendor({ ...vendor, email: e.target.value })}
        />
        <TextField
          inputLabel="Phone"
          value={vendor?.phone || ''}
          onChange={(e: any) => setVendor({ ...vendor, phone: e.target.value })}
        />
        <TextField
          inputLabel="Postal Address"
          value={vendor?.postal_address || ''}
          onChange={(e: any) =>
            setVendor({ ...vendor, postal_address: e.target.value })
          }
          multiline
          rows={3}
        />
        <TextField
          inputLabel="Notes"
          value={vendor?.note || ''}
          onChange={(e) => setVendor({ ...vendor, note: e.target.value })}
          multiline
          rows={3}
        />
        <div className="flex justify-start py-2">
          <button
            className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
            onClick={onClickDelete}
          >
            <DeleteIcon />
            Delete Vendor
          </button>
        </div>
      </div>
      <div className="w-1/2">
        <div className="ml-4 grid grid-cols-2 justify-items-start rounded border p-2 mt-2">
          <div>TOTAL SALES</div>
          <div>{vendorDetails?.totalSales?.length || 0}</div>
          <div>LAST SALE</div>
          <div>
            {vendorDetails?.lastSold
              ? dayjs(vendorDetails?.lastSold).format('D MMMM YYYY')
              : 'N/A'}
          </div>
          <div>LAST PAID</div>
          <div>
            {vendorDetails?.lastPaid
              ? dayjs(vendorDetails?.lastPaid).format('D MMMM YYYY')
              : 'N/A'}
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
  )
}
