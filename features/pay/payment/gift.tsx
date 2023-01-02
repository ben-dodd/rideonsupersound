import dayjs, { extend } from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import { useEffect, useMemo, useState } from 'react'
import { ModalButton } from 'lib/types'
import SyncIcon from '@mui/icons-material/Sync'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { makeGiftCardCode } from 'lib/functions/sell'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { useGiftCards } from 'lib/api/stock'
import { GiftCardObject, StockItemObject } from 'lib/types/stock'
import { PaymentMethodTypes, SaleTransactionObject } from 'lib/types/sale'

export default function Gift({ totalRemaining }) {
  extend(UTC)
  const { clerk } = useClerk()
  const { view, cart, closeView, setAlert, addCartTransaction } = useAppStore()
  const { sale = {} } = cart || {}
  const { giftCards } = useGiftCards()
  const { registerId } = useCurrentRegisterId()

  const isRefund = totalRemaining < 0
  const [giftCardPayment, setGiftCardPayment] = useState(`${Math.abs(totalRemaining).toFixed(2)}`)
  useEffect(() => {
    setGiftCardPayment(`${Math.abs(totalRemaining).toFixed(2)}`)
  }, [totalRemaining])
  const [giftCardCode, setGiftCardCode] = useState('')
  const giftCard: GiftCardObject = useMemo(() => {
    console.log('Gift card changed')
    let gc: GiftCardObject = giftCards?.find(
      (giftCard: GiftCardObject) => giftCard?.giftCardCode === giftCardCode.toUpperCase(),
    )
    if (gc?.giftCardRemaining / 100 < totalRemaining)
      setGiftCardPayment(`${Math.abs(gc.giftCardRemaining / 100).toFixed(2)}`)
    return gc
  }, [giftCardCode, giftCards, totalRemaining])

  const [newGiftCardCode, setNewGiftCardCode] = useState(makeGiftCardCode(giftCards))
  const [submitting, setSubmitting] = useState(false)
  const remainingOnGiftCard = giftCard?.giftCardRemaining / 100
  const leftOver: number = remainingOnGiftCard - parseFloat(giftCardPayment)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        parseFloat(giftCardPayment) > Math.abs(totalRemaining) ||
        parseFloat(giftCardPayment) <= 0 ||
        giftCardPayment === '' ||
        isNaN(parseFloat(giftCardPayment)) ||
        (!isRefund && (!giftCard || !giftCard?.giftCardIsValid || leftOver < 0)),
      onClick: () => {
        let giftCardUpdate: StockItemObject = {}
        if (isRefund) {
          giftCardUpdate = {
            isGiftCard: true,
            giftCardCode: newGiftCardCode,
            giftCardAmount: parseFloat(giftCardPayment) * 100,
            giftCardRemaining: parseFloat(giftCardPayment) * 100,
            note: `Gift card created as refund payment${cart?.sale?.id ? ` for sale #${cart?.sale?.id}` : ''}.`,
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
          saleId: sale?.id,
          clerkId: clerk?.id,
          paymentMethod: PaymentMethodTypes.GiftCard,
          amount: isRefund ? parseFloat(giftCardPayment) * -100 : parseFloat(giftCardPayment) * 100,
          registerId,
          giftCardUpdate,
          isRefund,
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
        closeView(ViewProps.giftPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(giftCardPayment)?.toFixed(2)} GIFT CARD  ${isRefund ? 'REFUND' : 'PAYMENT'}`,
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
            <div className="text-8xl text-red-800 font-mono">{newGiftCardCode}</div>
            <button className="icon-button-small-mid" onClick={() => setNewGiftCardCode(makeGiftCardCode(giftCards))}>
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
        <div className="text-center">{`Remaining to ${isRefund ? 'refund' : 'pay'}: $${Math.abs(
          totalRemaining,
        )?.toFixed(2)}`}</div>
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
          {(!isRefund && (!giftCardCode || giftCardCode === '' || giftCardPayment === '' || !giftCard)) ||
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
