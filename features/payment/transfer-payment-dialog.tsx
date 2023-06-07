import { useState } from 'react'
import Select from 'react-select'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { ModalButton } from 'lib/types'
import dayjs from 'dayjs'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { createVendorPayment, useVendor, useVendors } from 'lib/api/vendor'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { VendorObject, VendorPaymentTypes } from 'lib/types/vendor'
import { priceCentsString } from 'lib/utils'

export default function TransferVendorPaymentDialog() {
  const { clerk } = useClerk()
  const { view, closeView } = useAppStore()
  const { registerId } = useCurrentRegisterId()
  const { vendors } = useVendors()
  const [submitting, setSubmitting] = useState(false)
  const [vendorPayId, setVendorPay]: [any, Function] = useState(0)
  const [vendorReceiveId, setVendorReceive]: [number, Function] = useState(0)
  const { vendor: payVendor } = useVendor(vendorPayId)
  const { vendor: receiveVendor } = useVendor(vendorReceiveId)
  const [payment, setPayment] = useState('0')
  const [notes, setNotes] = useState('')
  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      text: 'CANCEL',
      onClick: resetAndCloseDialog,
    },
    {
      type: 'ok',
      text: 'TRANSFER STORE CREDIT',
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        if (vendorPayId !== 'store') {
          let vendorPayPayment = {
            date: dayjs.utc().format(),
            amount: Math.round(parseFloat(payment) * 100),
            clerkId: clerk?.id,
            vendorId: vendorPayId,
            registerId,
            type: VendorPaymentTypes.TransferFrom,
            note: notes,
          }
          await createVendorPayment(vendorPayPayment)
        }
        let vendorReceivePayment = {
          date: dayjs.utc().format(),
          amount: Math.round(parseFloat(payment) * -100),
          clerkId: clerk?.id,
          vendorId: vendorReceiveId,
          registerId,
          type: VendorPaymentTypes.TransferTo,
          note: notes,
        }
        await createVendorPayment(vendorReceivePayment)
        setSubmitting(false)
        resetAndCloseDialog()
      },
      disabled: !vendorPayId || !vendorReceiveId || !payment || parseFloat(payment) <= 0,
    },
  ]

  // Functions
  function resetAndCloseDialog() {
    closeView(ViewProps.transferVendorPaymentDialog)
    setVendorPay(0)
    setVendorReceive(0)
    setPayment('0')
  }

  return (
    <Modal
      open={view?.transferVendorPaymentDialog}
      closeFunction={() => closeView(ViewProps.transferVendorPaymentDialog)}
      title={`TRANSFER STORE CREDIT`}
      buttons={buttons}
    >
      <>
        <div className="text-sm mt-2">Select Vendor Who Pays</div>
        <Select
          className="w-full"
          value={{
            value: vendorPayId,
            label:
              vendorPayId === 'store'
                ? 'R.O.S.S.'
                : vendors?.find((v: VendorObject) => v?.id === vendorPayId)?.name || '',
          }}
          options={[{ value: 'store', label: 'R.O.S.S.' }]?.concat(
            vendors
              ?.filter((v) => v?.id !== 666)
              .map((val: VendorObject) => ({
                value: val?.id,
                label: val?.name || '',
              })),
          )}
          onChange={(vendorObject: any) => setVendorPay(vendorObject?.value)}
        />
        <div className="text-sm mt-2">Select Vendor Who Receives</div>
        <Select
          className="w-full"
          value={{
            value: vendorReceiveId,
            label: vendors?.find((v: VendorObject) => v?.id === vendorReceiveId)?.name || '',
          }}
          options={vendors?.map((val: VendorObject) => ({
            value: val?.id,
            label: val?.name || '',
          }))}
          onChange={(vendorObject: any) => setVendorReceive(vendorObject?.value)}
        />
        <TextField
          className="mt-4"
          divClass="text-8xl"
          inputClass="text-center"
          startAdornment="$"
          error={payment !== '' && isNaN(parseFloat(payment))}
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
          {vendorPayId === 'store'
            ? 'R.O.S.S. PAYS'
            : vendorPayId > 0 && `PAYING VENDOR HAS ${priceCentsString(payVendor?.totalOwing)}`}
        </div>
        <div className="text-center">
          {vendorReceiveId > 0 && `RECEIVING VENDOR HAS ${priceCentsString(receiveVendor?.totalOwing)}`}
        </div>
        <div className="my-4 text-center text-xl font-bold">
          {vendorPayId === 0 || vendorReceiveId === 0
            ? 'SELECT VENDORS'
            : isNaN(parseFloat(payment))
            ? 'NUMBERS ONLY PLEASE'
            : 'PAYMENT OK'}
        </div>
      </>
    </Modal>
  )
}
