import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import { useMemo, useState } from 'react'
import {
  GiftCardObject,
  ModalButton,
  PaymentMethodTypes,
  SaleTransactionObject,
} from 'lib/types'

import SyncIcon from '@mui/icons-material/Sync'

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logSalePaymentGift } from 'features/log/lib/functions'
import { makeGiftCardCode } from 'features/sale/features/sell/lib/functions'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useSaleProperties } from 'lib/hooks'

export default function Gift() {
  dayjs.extend(UTC)
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()

  // SWR
  const { giftCards, mutateGiftCards } = useGiftCards()
  const { registerID } = useRegisterID()
  const { inventory } = useInventory()
  const { customers } = useCustomers()
  const { logs, mutateLogs } = useLogs()

  const { totalRemaining } = useSaleProperties(cart)

  // State
  const isRefund = totalRemaining < 0
  const [giftCardPayment, setGiftCardPayment] = useState(
    `${Math.abs(totalRemaining).toFixed(2)}`
  )
  const [giftCardCode, setGiftCardCode] = useState('')
  const giftCard: GiftCardObject = useMemo(() => {
    console.log('Gift card changed')
    let gc: GiftCardObject = giftCards?.filter(
      (giftCard: GiftCardObject) =>
        giftCard?.giftCardCode === giftCardCode.toUpperCase()
    )[0]
    console.log(gc?.giftCardRemaining)
    console.log(totalRemaining)
    if (gc?.giftCardRemaining / 100 < totalRemaining)
      setGiftCardPayment(`${Math.abs(gc.giftCardRemaining / 100).toFixed(2)}`)
    return gc
  }, [giftCardCode, giftCards])

  const [newGiftCardCode, setNewGiftCardCode] = useState(
    makeGiftCardCode(giftCards)
  )
  const [submitting, setSubmitting] = useState(false)

  // Constants
  const remainingOnGiftCard = giftCard?.giftCardRemaining / 100
  const leftOver: number = remainingOnGiftCard - parseFloat(giftCardPayment)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        submitting ||
        parseFloat(giftCardPayment) > Math.abs(totalRemaining) ||
        parseFloat(giftCardPayment) <= 0 ||
        giftCardPayment === '' ||
        isNaN(parseFloat(giftCardPayment)) ||
        (!isRefund &&
          (!giftCard || !giftCard?.giftCardIsValid || leftOver < 0)),
      loading: submitting,
      onClick: () => {
        setSubmitting(true)
        let giftCardUpdate: GiftCardObject = {}
        if (isRefund) {
          giftCardUpdate = {
            isGiftCard: true,
            giftCardCode: newGiftCardCode,
            giftCardAmount: parseFloat(giftCardPayment) * 100,
            giftCardRemaining: parseFloat(giftCardPayment) * 100,
            note: `Gift card created as refund payment${
              cart?.id ? ` for sale #${cart?.id}` : ''
            }.`,
            giftCardIsValid: true,
          }
        } else {
          giftCardUpdate = { ...giftCard }
          giftCardUpdate.giftCardRemaining = leftOver * 100
          if (leftOver < 10) {
            giftCardUpdate.giftCardIsValid = false
            giftCardUpdate.giftCardRemaining = 0
          }
        }
        let transaction: SaleTransactionObject = {
          date: dayjs.utc().format(),
          saleId: cart?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.GiftCard,
          amount: isRefund
            ? parseFloat(giftCardPayment) * -100
            : parseFloat(giftCardPayment) * 100,
          registerId: registerID,
          giftCardUpdate: giftCardUpdate,
          isRefund: isRefund,
        }
        if (!isRefund) {
          transaction = {
            ...transaction,
            giftCardId: giftCardUpdate?.id,
            giftCardTaken: giftCardUpdate?.giftCardIsValid,
            giftCardRemaining: giftCardUpdate?.giftCardRemaining,
            giftCardChange: leftOver < 10 ? leftOver * 100 : 0,
          }
        }
        addCartTransaction(transaction)
        setSubmitting(false)
        closeView(ViewProps.giftPaymentDialog)
        logSalePaymentGift(
          giftCardPayment,
          isRefund,
          newGiftCardCode,
          giftCardCode,
          leftOver,
          remainingOnGiftCard,
          cart,
          customers,
          clerk
        )
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(giftCardPayment)?.toFixed(2)} GIFT CARD  ${
            isRefund ? 'REFUND' : 'PAYMENT'
          }`,
        })
      },
      text: 'COMPLETE',
    },
  ]
  // BUG gift card props change when submit clicked

  return (
    <Modal
      open={view?.giftPaymentDialog}
      closeFunction={() => closeView(ViewProps.giftPaymentDialog)}
      title={isRefund ? `GIFT CARD REFUND` : `GIFT CARD PAYMENT`}
      buttons={buttons}
    >
      <>
        {isRefund ? (
          <div className="flex justify-between items-center">
            <div className="text-8xl text-red-800 font-mono">
              {newGiftCardCode}
            </div>
            <button
              className="icon-button-small-mid"
              onClick={() => setNewGiftCardCode(makeGiftCardCode(giftCards))}
            >
              <SyncIcon />
            </button>
          </div>
        ) : (
          <TextField
            divClass="text-8xl"
            inputClass="text-center text-red-800 font-mono uppercase"
            value={giftCardCode}
            autoFocus={true}
            onChange={(e: any) => setGiftCardCode(e.target.value)}
          />
        )}
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={giftCardPayment}
          selectOnFocus
          onChange={(e: any) => setGiftCardPayment(e.target.value)}
        />
        <div className="text-center">{`Remaining to ${
          isRefund ? 'refund' : 'pay'
        }: $${Math.abs(totalRemaining)?.toFixed(2)}`}</div>
        {!isRefund && (
          <div className="text-center font-bold">
            {!giftCardCode || giftCardCode === ''
              ? 'ENTER GIFT CARD CODE'
              : !giftCard
              ? 'INVALID GIFT CARD CODE'
              : `$${remainingOnGiftCard?.toFixed(2)} LEFT ON CARD`}
          </div>
        )}
        <div className="text-center text-xl font-bold my-4">
          {(!isRefund &&
            (!giftCardCode ||
              giftCardCode === '' ||
              giftCardPayment === '' ||
              !giftCard)) ||
          parseFloat(giftCardPayment) === 0 ||
          submitting ? (
            `...`
          ) : parseFloat(giftCardPayment) < 0 ? (
            'NO NEGATIVES ALLOWED'
          ) : isNaN(parseFloat(giftCardPayment)) ? (
            `NUMBERS ONLY PLEASE`
          ) : parseFloat(giftCardPayment) > Math.abs(totalRemaining) ? (
            `${isRefund ? 'REFUND AMOUNT' : 'PAYMENT'} TOO HIGH`
          ) : isRefund ? (
            `ALL GOOD!`
          ) : !giftCard?.giftCardIsValid ? (
            `GIFT CARD IS NOT VALID`
          ) : remainingOnGiftCard < parseFloat(giftCardPayment) ? (
            `NOT ENOUGH ON CARD`
          ) : leftOver >= 10 ? (
            `$${leftOver.toFixed(2)} REMAINING ON CARD`
          ) : leftOver === 0 ? (
            `CARD USED UP, TAKE CARD`
          ) : leftOver < 10 ? (
            `TAKE CARD AND GIVE $${leftOver.toFixed(2)} IN CHANGE`
          ) : (
            <div />
          )}
        </div>
      </>
    </Modal>
  )
}
