import dayjs, { extend } from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import Select from 'react-select'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { useVendor, useVendors } from 'lib/api/vendor'
import { useSaleProperties } from 'lib/hooks'
import { PaymentMethodTypes, SaleTransactionObject } from 'lib/types/sale'
import { VendorObject } from 'lib/types/vendor'

export default function Acct() {
  extend(UTC)
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()
  const { sale = {} } = cart || {}
  const [vendorWrapper, setVendorWrapper] = useState(null)
  const { registerId } = useCurrentRegisterId()
  const { vendors } = useVendors()

  const { totalRemaining } = useSaleProperties(cart)
  const { vendor } = useVendor(vendorWrapper?.value?.id)
  console.log(vendor)
  const isRefund = totalRemaining < 0
  const [acctPayment, setAcctPayment] = useState(`${Math.abs(totalRemaining)?.toFixed(2)}`)
  useEffect(() => {
    setAcctPayment(`${Math.abs(totalRemaining).toFixed(2)}`)
  }, [totalRemaining])
  const [submitting, setSubmitting] = useState(false)
  // TODO NEXT TO DO , pay/components/payment

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        submitting ||
        parseFloat(acctPayment) > Math.abs(totalRemaining) ||
        parseFloat(acctPayment) <= 0 ||
        acctPayment <= '' ||
        // (!isRefund && vendorVars?.totalOwing / 100 < parseFloat(acctPayment)) ||
        isNaN(parseFloat(acctPayment)),
      loading: submitting,
      onClick: () => {
        setSubmitting(true)
        let transaction: SaleTransactionObject = {
          date: dayjs.utc().format(),
          saleId: sale?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.Account,
          amount: isRefund ? parseFloat(acctPayment) * -100 : parseFloat(acctPayment) * 100,
          registerId,
          vendor: vendorWrapper?.value,
          isRefund: isRefund,
        }
        addCartTransaction(transaction)
        setSubmitting(false)
        closeView(ViewProps.acctPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(acctPayment)?.toFixed(2)} ACCOUNT ${isRefund ? `REFUND` : `PAYMENT`}`,
        })
      },
      text: 'COMPLETE',
    },
  ]

  return (
    <Modal
      open={view?.acctPaymentDialog}
      closeFunction={() => closeView(ViewProps.acctPaymentDialog)}
      title={isRefund ? `ACCOUNT REFUND` : `ACCOUNT PAYMENT`}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={acctPayment}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setAcctPayment(e.target.value)}
        />
        <div className="input-label">Select Vendor</div>
        <div className="pb-32">
          <Select
            className="w-full self-stretch"
            value={vendorWrapper}
            options={vendors
              ?.sort((vendorA: VendorObject, vendorB: VendorObject) => {
                const a = vendorA?.name
                const b = vendorB?.name
                return a > b ? 1 : b > a ? -1 : 0
              })
              ?.map((vendor: VendorObject) => ({
                value: vendor,
                label: vendor?.name,
              }))}
            onChange={(v: any) => setVendorWrapper(v)}
          />
        </div>
        <div className="text-center">{`Remaining to ${isRefund ? 'refund' : 'pay'}: $${Math.abs(
          totalRemaining,
        )?.toFixed(2)}`}</div>
        {vendorWrapper ? (
          <>
            <div className="text-center font-bold">
              {`${isRefund ? `Currently` : `Remaining`} in account: ${
                false ? `Loading...` : `$${(vendor?.totalOwing / 100)?.toFixed(2)}`
              }`}
            </div>
            <div className="text-center text-xl font-bold my-4">
              {acctPayment === '' || parseFloat(acctPayment) === 0
                ? '...'
                : parseFloat(acctPayment) < 0
                ? 'NO NEGATIVES ALLOWED'
                : isNaN(parseFloat(acctPayment))
                ? 'NUMBERS ONLY PLEASE'
                : parseFloat(acctPayment) > Math.abs(totalRemaining)
                ? `${isRefund ? 'REFUND AMOUNT' : 'PAYMENT'} TOO HIGH`
                : isRefund
                ? 'ALL GOOD!'
                : vendor?.totalOwing / 100 < parseFloat(acctPayment)
                ? `NOT ENOUGH IN ACCOUNT, VENDOR WILL OWE THE SHOP`
                : parseFloat(acctPayment) < totalRemaining
                ? `AMOUNT SHORT BY $${(totalRemaining - parseFloat(acctPayment))?.toFixed(2)}`
                : 'ALL GOOD!'}
            </div>
          </>
        ) : (
          <div className="text-center text-xl font-bold my-4">SELECT VENDOR ACCOUNT TO USE</div>
        )}
      </>
    </Modal>
  )
}
