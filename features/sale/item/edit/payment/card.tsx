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

export default function Cash({ totalRemaining }) {
  const { clerk } = useClerk()
  const { cart, view, closeView, setAlert, addCartTransaction } = useAppStore()
  const { sale = {} } = cart || {}
  const { registerId } = useCurrentRegisterId()
  const isRefund = totalRemaining < 0
  const [cardPayment, setCardPayment] = useState(`${Math.abs(totalRemaining).toFixed(2)}`)
  useEffect(() => {
    setCardPayment(`${Math.abs(totalRemaining).toFixed(2)}`)
  }, [totalRemaining])

  // Constants
  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        (!isRefund && parseFloat(cardPayment) > totalRemaining) ||
        (isRefund && parseFloat(cardPayment) < totalRemaining) ||
        parseFloat(cardPayment) <= 0 ||
        cardPayment === '' ||
        isNaN(parseFloat(cardPayment)),
      onClick: async () => {
        const newTransaction = formSaleTransaction({
          enteredAmount: cardPayment,
          paymentMethod: PaymentMethodTypes.Card,
          isRefund,
          registerId,
          saleId: sale?.id,
          clerkId: clerk?.id,
        })
        addCartTransaction(newTransaction)
        closeView(ViewProps.cardPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(cardPayment)?.toFixed(2)} CARD ${isRefund ? 'REFUND' : 'PAYMENT'}`,
        })
      },
      text: 'COMPLETE',
    },
  ]

  return (
    <Modal
      open={view?.cardPaymentDialog}
      closeFunction={() => closeView(ViewProps.cardPaymentDialog)}
      title={isRefund ? `CARD REFUND` : `CARD PAYMENT`}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={cardPayment}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setCardPayment(e.target.value)}
        />
        <div className="text-center">{`Remaining to ${isRefund ? 'refund' : 'pay'}: $${Math.abs(
          totalRemaining,
        )?.toFixed(2)}`}</div>
        <div className="text-center text-xl font-bold my-4">
          {cardPayment === '' || parseFloat(cardPayment) === 0
            ? '...'
            : parseFloat(cardPayment) < 0
            ? 'NO NEGATIVES ALLOWED'
            : isNaN(parseFloat(cardPayment))
            ? 'NUMBERS ONLY PLEASE'
            : parseFloat(cardPayment) > Math.abs(totalRemaining)
            ? `${isRefund ? 'REFUND AMOUNT' : 'PAYMENT'} TOO HIGH`
            : parseFloat(cardPayment) < Math.abs(totalRemaining)
            ? `AMOUNT SHORT BY $${(totalRemaining - parseFloat(cardPayment))?.toFixed(2)}`
            : 'ALL GOOD!'}
        </div>
      </>
    </Modal>
  )
}
