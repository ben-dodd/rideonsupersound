import { ClerkObject } from 'lib/types'
import SettingsSelect from 'components/inputs/settings-select'
import TextField from 'components/inputs/text-field'
import dayjs from 'dayjs'
import Select from 'react-select'
import MaskedInput from 'react-text-mask'

import { saveLog } from 'lib/functions/log'
import DeleteIcon from '@mui/icons-material/Delete'
import { useClerk, useClerks } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { useVendor } from 'lib/api/vendor'
import { useRouter } from 'next/router'

export default function GeneralDetails({ editVendor, setEditVendor }) {
  const { clerks } = useClerks()
  const { clerk } = useClerk()
  const { openConfirm } = useAppStore()
  const router = useRouter()
  const id = router.query
  const { vendor } = useVendor(id)
  const handleEdit = (e) => {
    setEditVendor({ ...editVendor, [e.target.name]: e.target.value })
  }

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
  // Functions
  function onClickDelete() {
    // REVIEW Delete inventory item
    // const itemIsPartOfSale =
    //   saleItems?.filter((s) => s?.item_id === item?.id)?.length > 0;
    openConfirm({
      open: true,
      title: 'Are you sure you want to delete this item?',
      styledMessage: (
        <div>
          {vendor?.items?.length > 0 ? (
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
      yesText: vendor?.items?.length > 0 ? 'OK' : "YES, I'M SURE",
      action:
        vendor?.items?.length > 0
          ? () => {}
          : async () =>
              deleteVendor(vendor?.id)?.then(() => {
                saveLog(
                  `Vendor #${vendor?.id} ${vendor?.name} deleted.`,
                  clerk?.id,
                  'vendor',
                  vendor?.id
                )
                router.back()
              }),
    })
  }

  return (
    <div className="flex w-full">
      <div className="w-1/2">
        <TextField
          id="name"
          inputLabel="Name"
          value={editVendor?.name || ''}
          onChange={handleEdit}
        />
        <SettingsSelect
          object={editVendor}
          onEdit={setEditVendor}
          inputLabel="Vendor Category"
          dbField="vendorCategory"
          isCreateDisabled={true}
        />

        <div className="input-label">Staff Contact</div>
        <div className="w-full">
          <Select
            isClearable
            value={{
              value: editVendor?.clerkId,
              label: clerks?.find(
                (c: ClerkObject) => c?.id === editVendor?.clerkId
              )?.name,
            }}
            options={clerks?.map((clerk: ClerkObject) => ({
              value: clerk?.id,
              label: clerk?.name,
            }))}
            onChange={(e: any) =>
              setEditVendor({
                ...editVendor,
                clerkId: e?.value || null,
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
            value={editVendor?.bankAccountNumber || ''}
            onChange={(e) =>
              setEditVendor({
                ...editVendor,
                bankAccountNumber: e.target.value,
              })
            }
          />
        </div>
        <div className="flex mt-2">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={editVendor?.store_credit_only}
            onChange={(e) =>
              setEditVendor({
                ...editVendor,
                storeCreditOnly: e.target.checked,
              })
            }
          />
          <div className="ml-2">Store Credit Only</div>
        </div>
        <div className="flex mt-2">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={editVendor?.emailVendor}
            onChange={(e) =>
              setEditVendor({ ...editVendor, emailVendor: e.target.checked })
            }
          />
          <div className="ml-2">Email Vendor</div>
        </div>
        <TextField
          id="contactName"
          inputLabel="Contact Name"
          value={editVendor?.contactName || ''}
          onChange={handleEdit}
        />
        <TextField
          id="email"
          inputLabel="Email"
          value={editVendor?.email || ''}
          onChange={handleEdit}
        />
        <TextField
          id="phone"
          inputLabel="Phone"
          value={editVendor?.phone || ''}
          onChange={handleEdit}
        />
        <TextField
          id="postalAddress"
          inputLabel="Postal Address"
          value={editVendor?.postalAddress || ''}
          onChange={handleEdit}
          multiline
          rows={3}
        />
        <TextField
          id="note"
          inputLabel="Notes"
          value={editVendor?.note || ''}
          onChange={handleEdit}
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
          <div>{vendor?.sales?.length || 0}</div>
          <div>LAST SALE</div>
          <div>
            {vendor?.lastSold
              ? dayjs(vendor?.lastSold).format('D MMMM YYYY')
              : 'N/A'}
          </div>
          <div>LAST PAID</div>
          <div>
            {vendor?.lastPaid
              ? dayjs(vendor?.lastPaid).format('D MMMM YYYY')
              : 'N/A'}
          </div>
          <div>TOTAL TAKE</div>
          <div>{`$${(vendor?.totalSell ? vendor?.totalSell / 100 : 0)?.toFixed(
            2
          )}`}</div>
          <div>TOTAL PAID</div>
          <div>{`$${(vendor?.totalPaid ? vendor?.totalPaid / 100 : 0)?.toFixed(
            2
          )}`}</div>
          <div>TOTAL OWED</div>
          <div>{`$${(vendor?.totalOwing
            ? vendor?.totalOwing / 100
            : 0
          )?.toFixed(2)}`}</div>
        </div>
        <div />
      </div>
    </div>
  )
}
