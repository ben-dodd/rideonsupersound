// Packages
import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import Select from 'react-select'

// DB
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import dayjs from 'dayjs'
import { logTransferVendorPayment } from 'features/log/lib/functions'
import { getTotalOwing } from 'features/sale/features/item-sale/lib/functions'
import { clerkAtom, viewAtom } from 'lib/atoms'
import { createVendorPaymentInDatabase } from 'lib/database/create'
import {
  useCashGiven,
  useInventory,
  useLogs,
  useRegisterID,
  useSalesJoined,
  useVendorPayments,
  useVendors,
} from 'lib/database/read'
import {
  ModalButton,
  StockObject,
  VendorObject,
  VendorPaymentObject,
  VendorPaymentTypes,
  VendorSaleItemObject,
} from 'lib/types'

export default function TransferVendorPaymentDialog() {
  // SWR
  const { registerID } = useRegisterID()
  const { inventory } = useInventory()
  const { vendors } = useVendors()
  const { sales } = useSalesJoined()
  const { mutateCashGiven } = useCashGiven(registerID || 0)
  const { vendorPayments, mutateVendorPayments } = useVendorPayments()
  const { logs, mutateLogs } = useLogs()

  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)

  // State
  const [submitting, setSubmitting] = useState(false)
  const [vendor_pay_id, setVendorPay]: [any, Function] = useState(0)
  const [vendor_receive_id, setVendorReceive]: [number, Function] = useState(0)
  const [payment, setPayment] = useState('0')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Constants
  const totalPayOwing = useMemo(
    () =>
      vendor_pay_id === 'store'
        ? null
        : getTotalOwing(
            vendorPayments?.filter(
              (v: VendorPaymentObject) => v?.vendor_id === vendor_pay_id
            ),
            sales?.filter(
              (v: VendorSaleItemObject) =>
                inventory?.filter((i: StockObject) => i?.id === v?.item_id)[0]
                  ?.vendor_id === vendor_pay_id
            )
          ),
    [vendor_pay_id, vendorPayments]
  )
  const totalReceiveOwing = useMemo(
    () =>
      getTotalOwing(
        vendorPayments?.filter(
          (v: VendorPaymentObject) => v?.vendor_id === vendor_receive_id
        ),
        sales?.filter(
          (v: VendorSaleItemObject) =>
            inventory?.filter((i: StockObject) => i?.id === v?.item_id)[0]
              ?.vendor_id === vendor_receive_id
        )
      ),
    [vendor_receive_id, vendorPayments]
  )
  const vendorPay = useMemo(
    () =>
      vendor_pay_id === 'store'
        ? null
        : vendors?.filter((v: VendorObject) => v?.id === vendor_pay_id)[0],
    [vendor_pay_id, vendors]
  )
  const vendorReceive = useMemo(
    () => vendors?.filter((v: VendorObject) => v?.id === vendor_receive_id)[0],
    [vendor_receive_id, vendors]
  )
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
        if (vendor_pay_id !== 'store') {
          let vendorPayPayment = {
            date: dayjs.utc().format(),
            amount: Math.round(parseFloat(payment) * 100),
            clerk_id: clerk?.id,
            vendor_id: vendor_pay_id,
            register_id: registerID,
            type: VendorPaymentTypes.TransferFrom,
            note: notes,
          }
          createVendorPaymentInDatabase(vendorPayPayment).then((id) =>
            mutateVendorPayments([
              ...vendorPayments,
              { ...vendorPayPayment, id },
            ])
          )
        }
        let vendorReceivePayment = {
          date: dayjs.utc().format(),
          amount: Math.round(parseFloat(payment) * -100),
          clerk_id: clerk?.id,
          vendor_id: vendor_receive_id,
          register_id: registerID,
          type: VendorPaymentTypes.TransferTo,
          note: notes,
        }
        createVendorPaymentInDatabase(vendorReceivePayment).then(
          (vendorPaymentId) => {
            mutateVendorPayments([
              ...vendorPayments,
              { ...vendorReceivePayment, vendorPaymentId },
            ])
            logTransferVendorPayment(
              payment,
              vendor_pay_id,
              vendorPay,
              vendor_receive_id,
              vendorReceive,
              clerk,
              vendorPaymentId
            )
            setSubmitting(false)
            resetAndCloseDialog()
          }
        )
      },
      disabled:
        !vendor_pay_id ||
        !vendor_receive_id ||
        !payment ||
        parseFloat(payment) <= 0,
    },
  ]

  // Functions
  function resetAndCloseDialog() {
    setView({ ...view, transferVendorPaymentDialog: false })
    setVendorPay(0)
    setVendorReceive(0)
    setPayment('0')
  }

  return (
    <Modal
      open={view?.transferVendorPaymentDialog}
      closeFunction={() =>
        setView({ ...view, transferVendorPaymentDialog: false })
      }
      title={`TRANSFER STORE CREDIT`}
      buttons={buttons}
    >
      <>
        <div className="text-sm mt-2">Select Vendor Who Pays</div>
        <Select
          className="w-full"
          value={{
            value: vendor_pay_id,
            label:
              vendor_pay_id === 'store'
                ? 'R.O.S.S.'
                : vendors?.filter(
                    (v: VendorObject) => v?.id === vendor_pay_id
                  )[0]?.name || '',
          }}
          options={[{ value: 'store', label: 'R.O.S.S.' }]?.concat(
            vendors
              ?.filter((v) => v?.id !== 666)
              .map((val: VendorObject) => ({
                value: val?.id,
                label: val?.name || '',
              }))
          )}
          onChange={(vendorObject: any) => setVendorPay(vendorObject?.value)}
        />
        <div className="text-sm mt-2">Select Vendor Who Receives</div>
        <Select
          className="w-full"
          value={{
            value: vendor_receive_id,
            label:
              vendors?.filter(
                (v: VendorObject) => v?.id === vendor_receive_id
              )[0]?.name || '',
          }}
          options={vendors?.map((val: VendorObject) => ({
            value: val?.id,
            label: val?.name || '',
          }))}
          onChange={(vendorObject: any) =>
            setVendorReceive(vendorObject?.value)
          }
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
          {vendor_pay_id === 'store'
            ? 'R.O.S.S. PAYS'
            : vendor_pay_id > 0 &&
              `PAYING VENDOR HAS $${(totalPayOwing / 100)?.toFixed(2)}`}
        </div>
        <div className="text-center">
          {vendor_receive_id > 0 &&
            `RECEIVING VENDOR HAS $${(totalReceiveOwing / 100)?.toFixed(2)}`}
        </div>
        <div className="my-4 text-center text-xl font-bold">
          {vendor_pay_id === 0 || vendor_receive_id === 0
            ? 'SELECT VENDORS'
            : isNaN(parseFloat(payment))
            ? 'NUMBERS ONLY PLEASE'
            : 'PAYMENT OK'}
        </div>
      </>
    </Modal>
  )
}
