import dayjs from 'dayjs'
import { useState } from 'react'
import { useCustomers, useInventory, useRegisterID } from 'lib/database/read'
import {
  ModalButton,
  PaymentMethodTypes,
  SaleTransactionObject,
} from 'lib/types'

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logSalePaymentCard } from 'features/log/lib/functions'
import { getSaleVars } from '../../lib/functions'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function Cash() {
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()
  const { registerID } = useRegisterID()
  const { inventory } = useInventory()
  const { customers } = useCustomers()

  const { totalRemaining } = getSaleVars(cart, inventory)
  const [submitting, setSubmitting] = useState(false)
  const isRefund = totalRemaining < 0
  const [cardPayment, setCardPayment] = useState(
    `${Math.abs(totalRemaining).toFixed(2)}`
  )

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
          saleId: cart?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.Card,
          amount: isRefund
            ? parseFloat(cardPayment) * -100
            : parseFloat(cardPayment) * 100,
          registerId: registerID,
          isRefund: isRefund,
        }
        addCartTransaction(transaction)
        setSubmitting(false)
        closeView(ViewProps.cardPaymentDialog)
        logSalePaymentCard(cardPayment, isRefund, cart, customers, clerk)
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
