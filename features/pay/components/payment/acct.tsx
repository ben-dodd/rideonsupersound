import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import { useMemo, useState } from 'react'
import {
  ModalButton,
  PaymentMethodTypes,
  SaleTransactionObject,
  VendorObject,
} from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logSalePaymentAcct } from 'features/log/lib/functions'
import { getVendorDetails } from 'features/vendor/features/item-vendor/lib/functions'
import Select from 'react-select'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { useStockList } from 'lib/api/stock'
import { useVendors } from 'lib/api/vendor'
import { useSaleProperties } from 'lib/hooks'

export default function Acct() {
  dayjs.extend(UTC)
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()
  const [vendorWrapper, setVendorWrapper] = useState(null)
  const { registerId } = useCurrentRegisterId()
  const { inventory } = useStockList()
  const { vendors } = useVendors()
  const { sales } = useSalesJoined()
  const { vendorPayments } = useVendorPayments()

  const { totalRemaining } = useSaleProperties(cart)

  // State
  const isRefund = totalRemaining < 0
  const [acctPayment, setAcctPayment] = useState(
    `${Math.abs(totalRemaining)?.toFixed(2)}`
  )
  const [submitting, setSubmitting] = useState(false)

  // Constants
  const vendorVars = useMemo(
    () =>
      getVendorDetails(
        inventory,
        sales,
        vendorPayments,
        vendorWrapper?.value?.id,
        cart
      ),
    [inventory, sales, vendorPayments, vendorWrapper?.value?.id]
  )

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
          saleId: cart?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.Account,
          amount: isRefund
            ? parseFloat(acctPayment) * -100
            : parseFloat(acctPayment) * 100,
          registerId,
          vendor: vendorWrapper?.value,
          isRefund: isRefund,
        }
        addCartTransaction(transaction)
        setSubmitting(false)
        closeView(ViewProps.acctPaymentDialog)
        logSalePaymentAcct(acctPayment, vendorWrapper, isRefund, cart, clerk)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(acctPayment)?.toFixed(2)} ACCOUNT ${
            isRefund ? `REFUND` : `PAYMENT`
          }`,
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
        <div className="text-center">{`Remaining to ${
          isRefund ? 'refund' : 'pay'
        }: $${Math.abs(totalRemaining)?.toFixed(2)}`}</div>
        {vendorWrapper ? (
          <>
            <div className="text-center font-bold">
              {`${isRefund ? `Currently` : `Remaining`} in account: ${
                false
                  ? `Loading...`
                  : `$${(vendorVars?.totalOwing / 100)?.toFixed(2)}`
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
                : vendorVars?.totalOwing / 100 < parseFloat(acctPayment)
                ? `NOT ENOUGH IN ACCOUNT, VENDOR WILL OWE THE SHOP`
                : parseFloat(acctPayment) < totalRemaining
                ? `AMOUNT SHORT BY $${(
                    totalRemaining - parseFloat(acctPayment)
                  )?.toFixed(2)}`
                : 'ALL GOOD!'}
            </div>
          </>
        ) : (
          <div className="text-center text-xl font-bold my-4">
            SELECT VENDOR ACCOUNT TO USE
          </div>
        )}
      </>
    </Modal>
  )
}
