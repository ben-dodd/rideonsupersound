// Packages
import { useMemo, useState } from 'react'
import Select from 'react-select'
import { ModalButton, VendorObject, VendorPaymentTypes } from 'lib/types'

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logCreateVendorPayment } from 'features/log/lib/functions'
import { getVendorDetails } from 'features/vendor/features/item-vendor/lib/functions'
import { createVendorPaymentInDatabase } from 'lib/database/create'
import dayjs from 'dayjs'
import { useCurrentRegisterId } from 'lib/api/register'
import { useVendors } from 'lib/api/vendor'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function CashPaymentDialog() {
  const { registerId } = useCurrentRegisterId()
  const { vendors } = useVendors()
  // const { logs, mutateLogs } = useLogs()
  const { clerk } = useClerk()
  const { view, closeView } = useAppStore()

  // State
  const [submitting, setSubmitting] = useState(false)
  const [vendor_id, setVendor]: [number, Function] = useState(0)
  const { inventory } = useInventory()
  const { sales } = useSalesJoined()
  const { vendorPayments, mutateVendorPayments } = useVendorPayments()
  const [payment, setPayment] = useState('0')
  const [notes, setNotes] = useState('')
  const [paymentType, setPaymentType] = useState(VendorPaymentTypes.Cash)

  // Constants
  const vendorVars = useMemo(
    () => getVendorDetails(inventory, sales, vendorPayments, vendor_id),
    [inventory, sales, vendorPayments, vendor_id]
  )
  const vendor = vendors?.filter((v: VendorObject) => v?.id === vendor_id)?.[0]
  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      text: 'CANCEL',
      onClick: resetAndCloseDialog,
    },
    {
      type: 'ok',
      text: 'PAY VENDOR',
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        let vendorPayment = {
          date: dayjs.utc().format(),
          amount: Math.round(parseFloat(payment) * 100),
          clerk_id: clerk?.id,
          vendor_id: vendor?.id,
          registerId,
          type: paymentType,
          note: notes,
        }
        createVendorPaymentInDatabase(vendorPayment).then((vendorPaymentId) => {
          mutateVendorPayments([
            ...vendorPayments,
            { ...vendorPayment, vendorPaymentId },
          ])
          // if (paymentType === VendorPaymentTypes.Cash) mutateCashGiven()
          logCreateVendorPayment(paymentType, vendor, clerk, vendorPaymentId)
          setSubmitting(false)
          resetAndCloseDialog()
        })
      },
      disabled:
        // totalOwing < parseFloat(payment) ||
        !payment,
      // !payment || parseFloat(payment) <= 0,
    },
  ]

  // Functions
  function resetAndCloseDialog() {
    closeView(ViewProps.cashVendorPaymentDialog)
    setVendor(0)
    setPayment('0')
  }

  return (
    <Modal
      open={view?.cashVendorPaymentDialog}
      closeFunction={() => closeView(ViewProps.cashVendorPaymentDialog)}
      title={`VENDOR PAYMENT`}
      buttons={buttons}
    >
      <>
        <div className="text-sm mt-2">Select Payment Method</div>
        <Select
          className="w-full"
          value={{ value: paymentType, label: paymentType?.toUpperCase() }}
          options={[VendorPaymentTypes.Cash, VendorPaymentTypes.DC]?.map(
            (type) => ({
              value: type,
              label: type?.toUpperCase(),
            })
          )}
          onChange={(paymentObject: any) =>
            setPaymentType(paymentObject?.value)
          }
        />
        <div className="text-sm mt-2">Select Vendor</div>
        <Select
          className="w-full"
          value={{
            value: vendor_id,
            label:
              vendors?.filter((v: VendorObject) => v?.id === vendor_id)[0]
                ?.name || '',
          }}
          options={vendors?.map((val: VendorObject) => ({
            value: val?.id,
            label: val?.name || '',
          }))}
          onChange={(vendorObject: any) => setVendor(vendorObject?.value)}
        />
        <TextField
          className="mt-4"
          divClass="text-8xl"
          inputClass="text-center"
          startAdornment="$"
          error={isNaN(parseFloat(payment))}
          autoFocus
          selectOnFocus
          value={payment}
          onChange={(e: any) => setPayment(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
        />
        <div className="mt-4 text-center">
          {vendor_id > 0 &&
            `VENDOR OWED $${(vendorVars?.totalOwing / 100)?.toFixed(2)}`}
        </div>
        <div className="my-4 text-center text-xl font-bold">
          {vendor_id > 0
            ? isNaN(parseFloat(payment))
            : 'NUMBERS ONLY PLEASE'
            ? vendorVars?.totalOwing / 100 < parseFloat(payment)
              ? `YOU ARE PAYING VENDOR MORE THAN THEY ARE OWED`
              : 'PAYMENT OK'
            : 'SELECT VENDOR'}
        </div>
      </>
    </Modal>
  )
}
