import dayjs, { extend } from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { getCashVars } from 'lib/functions/pay'
import { PaymentMethodTypes, SaleTransactionObject } from 'lib/types/sale'

export default function Cash({ totalRemaining }) {
  extend(UTC)
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()
  const { sale = {} } = cart || {}
  const { registerId } = useCurrentRegisterId()
  const isRefund = totalRemaining < 0
  const [cashReceived, setCashReceived] = useState(`${Math.abs(totalRemaining).toFixed(2)}`)
  useEffect(() => {
    setCashReceived(`${Math.abs(totalRemaining).toFixed(2)}`)
  }, [totalRemaining])

  // Constants
  const changeToGive = (parseFloat(cashReceived) - totalRemaining)?.toFixed(2)
  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        parseFloat(cashReceived) <= 0 ||
        (isRefund && parseFloat(cashReceived) > Math.abs(totalRemaining)) ||
        cashReceived === '' ||
        isNaN(parseFloat(cashReceived)),
      onClick: () => {
        const { netAmount, cashFromCustomer, cashToCustomer } = getCashVars(cashReceived, totalRemaining, isRefund)
        let transaction: SaleTransactionObject = {
          date: dayjs.utc().format(),
          saleId: sale?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.Cash,
          amount: netAmount,
          cashReceived: cashFromCustomer,
          changeGiven: cashToCustomer,
          registerId,
          isRefund,
        }
        addCartTransaction(transaction)
        closeView(ViewProps.cashPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(cashReceived)?.toFixed(2)} ${
            isRefund
              ? `CASH REFUNDED.`
              : `CASH TAKEN.${parseFloat(changeToGive) > 0 ? ` $${changeToGive} CHANGE GIVEN.` : ''}`
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
        <div className="text-center">{`Remaining to ${isRefund ? 'refund' : 'pay'}: $${Math.abs(
          totalRemaining,
        )?.toFixed(2)}`}</div>
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
            ? `AMOUNT SHORT BY $${(totalRemaining - parseFloat(cashReceived))?.toFixed(2)}`
            : 'ALL GOOD!'}
        </div>
      </>
    </Modal>
  )
}
