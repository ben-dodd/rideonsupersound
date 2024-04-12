// Packages
import { useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'

// DB
import {
  useCustomers,
  useInventory,
  useLogs,
  useRegisterID,
} from '@/lib/swr-hooks'
import { viewAtom, cartAtom, clerkAtom, alertAtom } from '@/lib/atoms'
import {
  ModalButton,
  SaleTransactionObject,
  PaymentMethodTypes,
  CustomerObject,
} from '@/lib/types'

// Functions
import { getSaleVars, mysqlDate } from '@/lib/data-functions'

// Components
import Modal from '@/components/_components/container/modal'
import TextField from '@/components/_components/inputs/text-field'
import { saveLog } from '@/lib/db-functions'

export default function Cash() {
  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [, setAlert] = useAtom(alertAtom)

  // SWR
  const { registerID } = useRegisterID()
  const { inventory } = useInventory()
  const { logs, mutateLogs } = useLogs()
  const { customers } = useCustomers()

  const { totalRemaining } = getSaleVars(cart, inventory)

  // State
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
          date: mysqlDate(dayjs.utc().format()),
          sale_id: cart?.id,
          clerk_id: clerk?.id,
          payment_method: PaymentMethodTypes.Card,
          amount: isRefund
            ? parseFloat(cardPayment) * -100
            : parseFloat(cardPayment) * 100,
          register_id: registerID,
          is_refund: isRefund,
        }
        let transactions = cart?.transactions || []
        transactions.push(transaction)
        setCart({ ...cart, transactions })
        setSubmitting(false)
        setView({ ...view, cardPaymentDialog: false })
        saveLog(
          {
            log: `$${parseFloat(cardPayment)?.toFixed(2)} ${
              isRefund ? 'refunded on card to' : 'card payment from'
            } ${
              cart?.customer_id
                ? customers?.filter(
                    (c: CustomerObject) => c?.id === cart?.customer_id
                  )[0]?.name
                : 'customer'
            }${cart?.id ? ` (sale #${cart?.id}).` : ''}.`,
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        )
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
      closeFunction={() => setView({ ...view, cardPaymentDialog: false })}
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
