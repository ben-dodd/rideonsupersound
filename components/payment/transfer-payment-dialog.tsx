// Packages
import { useState, useMemo } from 'react'
import { useAtom } from 'jotai'
import Select from 'react-select'

// DB
import {
  useInventory,
  useVendors,
  useVendorPayments,
  useSalesJoined,
  useRegisterID,
  useCashGiven,
  useLogs,
} from '@/lib/swr-hooks'
import { viewAtom, clerkAtom } from '@/lib/atoms'
import {
  VendorSaleItemObject,
  VendorPaymentObject,
  StockObject,
  VendorObject,
  ModalButton,
  PaymentMethodTypes,
  VendorPaymentTypes,
} from '@/lib/types'

// Functions
import { saveLog, saveVendorPaymentToDatabase } from '@/lib/db-functions'
import { getTotalOwing, getVendorDetails } from '@/lib/data-functions'

// Components
import TextField from '@/components/_components/inputs/text-field'
import Modal from '@/components/_components/container/modal'
import CreateableSelect from '@/components/_components/inputs/createable-select'
import dayjs from 'dayjs'

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
  const payVendorVars = useMemo(
    () =>
      vendor_pay_id === 'store'
        ? null
        : getVendorDetails(inventory, sales, vendorPayments, vendor_pay_id),
    [inventory, sales, vendor_pay_id, vendorPayments]
  )
  const receiveVendorVars = useMemo(
    () => getVendorDetails(inventory, sales, vendorPayments, vendor_receive_id),
    [inventory, sales, vendor_receive_id, vendorPayments]
  )
  console.log(payVendorVars)
  console.log(receiveVendorVars)
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
          saveVendorPaymentToDatabase(vendorPayPayment).then((id) =>
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
        saveVendorPaymentToDatabase(vendorReceivePayment).then((id) => {
          mutateVendorPayments([
            ...vendorPayments,
            { ...vendorReceivePayment, id },
          ])
          saveLog(
            {
              log: `$${parseFloat(payment)?.toFixed(
                2
              )} store credit transferred from ${
                vendor_pay_id === 'store'
                  ? 'R.O.S.S.'
                  : `${vendorPay?.name} (${vendor_pay_id})`
              } to ${vendorReceive?.name} (${vendor_receive_id || ''}).`,
              clerk_id: clerk?.id,
              table_id: 'vendor_payment',
              row_id: id,
            },
            logs,
            mutateLogs
          )
          setSubmitting(false)
          resetAndCloseDialog()
        })
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
              `PAYING VENDOR HAS $${(payVendorVars?.totalOwing / 100)?.toFixed(
                2
              )}`}
        </div>
        <div className="text-center">
          {vendor_receive_id > 0 &&
            `RECEIVING VENDOR HAS $${(
              receiveVendorVars?.totalOwing / 100
            )?.toFixed(2)}`}
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
