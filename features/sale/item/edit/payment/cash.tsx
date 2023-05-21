import { useEffect, useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { PaymentMethodTypes } from 'lib/types/sale'
import { formSaleTransaction } from 'lib/functions/pay'
import { priceDollarsString } from 'lib/utils'

export default function Cash({ totalRemaining }) {
  const { clerk } = useClerk()
  const { cart, view, closeView, setAlert, addCartTransaction } = useAppStore()
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
      onClick: async () => {
        const newTransaction = formSaleTransaction({
          enteredAmount: cashReceived,
          paymentMethod: PaymentMethodTypes.Cash,
          totalRemaining,
          isRefund,
          registerId,
          saleId: sale?.id,
          clerkId: clerk?.id,
        })
        addCartTransaction(newTransaction)
        closeView(ViewProps.cashPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `${priceDollarsString(cashReceived)} ${
            isRefund
              ? `CASH REFUNDED.`
              : `CASH TAKEN.${parseFloat(changeToGive) > 0 ? ` ${priceDollarsString(changeToGive)} CHANGE GIVEN.` : ''}`
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
        <div className="text-center">{`Remaining to ${isRefund ? 'refund' : 'pay'}: ${priceDollarsString(
          Math.abs(totalRemaining),
        )}`}</div>
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
            ? `GIVE ${priceDollarsString(changeToGive)} IN CHANGE`
            : parseFloat(cashReceived) < Math.abs(totalRemaining)
            ? `AMOUNT SHORT BY ${priceDollarsString(totalRemaining - parseFloat(cashReceived))}`
            : 'ALL GOOD!'}
        </div>
      </>
    </Modal>
  )
}
