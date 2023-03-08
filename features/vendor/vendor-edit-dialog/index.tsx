import { ClerkObject, ModalButton } from 'lib/types'
import SettingsSelect from 'components/inputs/settings-select'
import TextField from 'components/inputs/text-field'
import Select from 'react-select'
import MaskedInput from 'react-text-mask'
import { useClerks } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { updateVendor } from 'lib/api/vendor'
import { useState } from 'react'
import Modal from 'components/modal'
import { ViewProps } from 'lib/store/types'
import { useSWRConfig } from 'swr'

export default function VendorEditDialog({ vendor }) {
  const { clerks } = useClerks()
  const { setAlert, view, closeView } = useAppStore()
  const [editVendor, setEditVendor] = useState({
    name: vendor?.name || '',
    category: vendor?.category || '',
    clerkId: vendor?.clerkId || null,
    bankAccountNumber: vendor?.bankAccountNumber || '',
    storeCreditOnly: vendor?.storeCreditOnly || false,
    emailVendor: vendor?.emailVendor || true,
    contactName: vendor?.contactName || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    postalAddress: vendor?.postalAddress || '',
    note: vendor?.note || '',
  })
  const handleChange = (e) => {
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

  const { mutate } = useSWRConfig()
  const [submitting, setSubmitting] = useState(false)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: false,
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        await updateVendor(vendor?.id, editVendor)
        mutate(`vendor/${vendor?.id}`)
        setSubmitting(false)
        closeView(ViewProps.stockEditDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `VENDOR UPDATED`,
        })
      },
      text: 'UPDATE VENDOR',
    },
  ]

  return (
    <Modal
      open={view?.vendorEditDialog}
      closeFunction={() => closeView(ViewProps.vendorEditDialog)}
      title={'EDIT VENDOR'}
      buttons={buttons}
      width="max-w-screen-md"
    >
      <>
        <TextField id="name" inputLabel="Name" value={editVendor?.name} onChange={handleChange} />
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
              label: clerks?.find((c: ClerkObject) => c?.id === editVendor?.clerkId)?.name,
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
            value={editVendor?.bankAccountNumber}
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
            checked={editVendor?.storeCreditOnly}
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
            onChange={(e) => setEditVendor({ ...editVendor, emailVendor: e.target.checked })}
          />
          <div className="ml-2">Email Vendor</div>
        </div>
        <TextField id="contactName" inputLabel="Contact Name" value={editVendor?.contactName} onChange={handleChange} />
        <TextField id="email" inputLabel="Email" value={editVendor?.email} onChange={handleChange} />
        <TextField id="phone" inputLabel="Phone" value={editVendor?.phone} onChange={handleChange} />
        <TextField
          id="postalAddress"
          inputLabel="Postal Address"
          value={editVendor?.postalAddress}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField id="note" inputLabel="Notes" value={editVendor?.note} onChange={handleChange} multiline rows={3} />
      </>
    </Modal>
  )
}
