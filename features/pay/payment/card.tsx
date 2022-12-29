import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
  ModalButton,
  PaymentMethodTypes,
  SaleTransactionObject,
} from 'lib/types'

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useSaleProperties } from 'lib/hooks'
import { useCurrentRegisterId } from 'lib/api/register'

export default function Cash() {
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()
  const { sale = {} } = cart || {}
  const { registerId } = useCurrentRegisterId()
  const { totalRemaining } = useSaleProperties(cart)
  const [submitting, setSubmitting] = useState(false)
  const isRefund = totalRemaining < 0
  const [cardPayment, setCardPayment] = useState(
    `${Math.abs(totalRemaining).toFixed(2)}`
  )
  console.log(registerId)
  useEffect(() => {
    setCardPayment(`${Math.abs(totalRemaining).toFixed(2)}`)
  }, [totalRemaining])

  // Constants
  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        submitting ||
        (!isRefund && parseFloat(cardPayment) > totalRemaining) ||
        (isRefund && parseFloat(cardPayment) < totalRemaining) ||
        parseFloat(cardPayment) <= 0 ||
        cardPayment === '' ||
        isNaN(parseFloat(cardPayment)),
      loading: submitting,
      onClick: () => {
        setSubmitting(true)
        let transaction: SaleTransactionObject = {
          date: dayjs.utc().format(),
          saleId: sale?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.Card,
          amount: isRefund
            ? parseFloat(cardPayment) * -100
            : parseFloat(cardPayment) * 100,
          registerId,
          isRefund,
        }
        addCartTransaction(transaction)
        setSubmitting(false)
        closeView(ViewProps.cardPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(cardPayment)?.toFixed(2)} CARD ${
            isRefund ? 'REFUND' : 'PAYMENT'
          }`,
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
        <div className="text-center">{`Remaining to ${
          isRefund ? 'refund' : 'pay'
        }: $${Math.abs(totalRemaining)?.toFixed(2)}`}</div>
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
            ? `AMOUNT SHORT BY $${(
                totalRemaining - parseFloat(cardPayment)
              )?.toFixed(2)}`
            : 'ALL GOOD!'}
        </div>
      </>
    </Modal>
  )
}
