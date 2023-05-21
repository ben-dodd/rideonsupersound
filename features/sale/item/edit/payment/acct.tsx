import { useEffect, useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import Select from 'react-select'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { useVendorAccounts } from 'lib/api/vendor'
import { PaymentMethodTypes } from 'lib/types/sale'
import { formSaleTransaction } from 'lib/functions/pay'
import { priceCentsString, priceDollarsString } from 'lib/utils'

export default function Acct({ totalRemaining }) {
  const { clerk } = useClerk()
  const { cart, view, closeView, setAlert, addCartTransaction } = useAppStore()
  const { sale = {} } = cart || {}
  const { registerId } = useCurrentRegisterId()
  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const [vendor, setVendor] = useState(null)
  const isRefund = totalRemaining < 0
  const [acctPayment, setAcctPayment] = useState(`${Math.abs(totalRemaining)?.toFixed(2)}`)
  useEffect(() => {
    setAcctPayment(`${Math.abs(totalRemaining).toFixed(2)}`)
  }, [totalRemaining])

  console.log(vendor)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        parseFloat(acctPayment) > Math.abs(totalRemaining) ||
        parseFloat(acctPayment) <= 0 ||
        acctPayment <= '' ||
        isVendorAccountsLoading ||
        isNaN(parseFloat(acctPayment)),
      onClick: async () => {
        const newTransaction = formSaleTransaction({
          enteredAmount: acctPayment,
          paymentMethod: PaymentMethodTypes.Account,
          isRefund,
          registerId,
          saleId: sale?.id,
          clerkId: clerk?.id,
          vendor: vendor?.value,
        })
        addCartTransaction(newTransaction)
        closeView(ViewProps.acctPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `${priceDollarsString(acctPayment)} ACCOUNT ${isRefund ? `REFUND` : `PAYMENT`}`,
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
            value={vendor}
            isLoading={isVendorAccountsLoading}
            options={vendorAccounts
              ?.sort((vendorA, vendorB) => {
                const a = vendorA?.name
                const b = vendorB?.name
                return a > b ? 1 : b > a ? -1 : 0
              })
              ?.map((vendor) => ({
                value: vendor,
                label: vendor?.name,
              }))}
            onChange={(v: any) => setVendor(v)}
          />
        </div>
        <div className="text-center">{`Remaining to ${isRefund ? 'refund' : 'pay'}: ${priceDollarsString(
          Math.abs(totalRemaining),
        )}`}</div>
        {vendor ? (
          <>
            <div className="text-center font-bold">
              {`${isRefund ? `Currently` : `Remaining`} in account: ${
                false ? `Loading...` : `${priceCentsString(vendor?.value?.totalOwing)}`
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
                : vendor?.value?.totalOwing / 100 < parseFloat(acctPayment)
                ? `NOT ENOUGH IN ACCOUNT, VENDOR WILL OWE THE SHOP`
                : parseFloat(acctPayment) < totalRemaining
                ? `AMOUNT SHORT BY ${priceDollarsString(totalRemaining - parseFloat(acctPayment))}`
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
