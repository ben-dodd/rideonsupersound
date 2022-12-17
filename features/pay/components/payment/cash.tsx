import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import { useState } from 'react'
import {
  ModalButton,
  PaymentMethodTypes,
  SaleTransactionObject,
} from 'lib/types'

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logSalePaymentCash } from 'features/log/lib/functions'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useSaleProperties } from 'lib/hooks'
import { useCurrentRegisterId } from 'lib/api/register'
import { useCustomers } from 'lib/api/customer'

export default function Cash() {
  dayjs.extend(UTC)
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()

  // SWR
  const { inventory } = useInventory()
  const { customers } = useCustomers()
  const { registerId } = useCurrentRegisterId()

  const { totalRemaining } = useSaleProperties(cart)

  // State
  const isRefund = totalRemaining < 0
  const [cashReceived, setCashReceived] = useState(
    `${Math.abs(totalRemaining).toFixed(2)}`
  )
  const [submitting, setSubmitting] = useState(false)

  // Constants
  const changeToGive = (parseFloat(cashReceived) - totalRemaining)?.toFixed(2)
  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        submitting ||
        parseFloat(cashReceived) <= 0 ||
        (isRefund && parseFloat(cashReceived) > Math.abs(totalRemaining)) ||
        cashReceived === '' ||
        isNaN(parseFloat(cashReceived)),
      loading: submitting,
      onClick: () => {
        setSubmitting(true)
        let transaction: SaleTransactionObject = {
          date: dayjs.utc().format(),
          saleId: cart?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.Cash,
          amount: isRefund
            ? parseFloat(cashReceived) * -100
            : parseFloat(cashReceived) >= totalRemaining
            ? totalRemaining * 100
            : parseFloat(cashReceived) * 100,
          cashReceived: parseFloat(cashReceived) * 100,
          changeGiven: isRefund
            ? null
            : parseFloat(cashReceived) > totalRemaining
            ? (parseFloat(cashReceived) - totalRemaining) * 100
            : null,
          registerId: registerID,
          isRefund: isRefund,
        }
        addCartTransaction(transaction)
        setSubmitting(false)
        logSalePaymentCash(
          cashReceived,
          isRefund,
          cart,
          customers,
          changeToGive,
          clerk
        )
        closeView(ViewProps.cashPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(cashReceived)?.toFixed(2)} ${
            isRefund
              ? `CASH REFUNDED.`
              : `CASH TAKEN.${
                  parseFloat(changeToGive) > 0
                    ? ` $${changeToGive} CHANGE GIVEN.`
                    : ''
                }`
          }`,
        })
      },
      text: 'COMPLETE',
    },
  ]

  return (
    <Modal
      open={view?.cashPaymentDialog}
      closeFunction={() => closeView(ViewProps.cashPaymentDialog)}
      title={isRefund ? `CASH REFUND` : `CASH PAYMENT`}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={cashReceived}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setCashReceived(e.target.value)}
        />
        <div className="text-center">{`Remaining to ${
          isRefund ? 'refund' : 'pay'
        }: $${Math.abs(totalRemaining)?.toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cashReceived === '' || parseFloat(cashReceived) === 0
            ? '...'
            : parseFloat(cashReceived) < 0
            ? 'NO NEGATIVES ALLOWED'
            : isNaN(parseFloat(cashReceived))
            ? 'NUMBERS ONLY PLEASE'
            : isRefund && parseFloat(cashReceived) > Math.abs(totalRemaining)
            ? 'TOO MUCH CASH REFUNDED'
            : isRefund
            ? 'ALL GOOD!'
            : parseFloat(cashReceived) > totalRemaining
            ? `GIVE $${changeToGive} IN CHANGE`
            : parseFloat(cashReceived) < Math.abs(totalRemaining)
            ? `AMOUNT SHORT BY $${(
                totalRemaining - parseFloat(cashReceived)
              )?.toFixed(2)}`
            : 'ALL GOOD!'}
        </div>
      </>
    </Modal>
  )
}