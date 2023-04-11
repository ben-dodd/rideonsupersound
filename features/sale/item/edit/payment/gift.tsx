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
import { GiftCardObject } from 'lib/types/stock'
import { PaymentMethodTypes } from 'lib/types/sale'
import { formSaleTransaction } from 'lib/functions/pay'

export default function Gift({ totalRemaining }) {
  const { clerk } = useClerk()
  const { cart, view, closeView, setAlert, addCartTransaction } = useAppStore()
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
    let gc: GiftCardObject = giftCards?.find(
      (giftCard: GiftCardObject) => giftCard?.giftCardCode === giftCardCode.toUpperCase(),
    )
    if (gc?.giftCardRemaining / 100 < totalRemaining)
      setGiftCardPayment(`${Math.abs(gc.giftCardRemaining / 100).toFixed(2)}`)
    return gc
  }, [giftCardCode, giftCards, totalRemaining])

  const [newGiftCardCode, setNewGiftCardCode] = useState(makeGiftCardCode(giftCards))
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
      onClick: async () => {
        const newTransaction = formSaleTransaction({
          enteredAmount: giftCardPayment,
          paymentMethod: PaymentMethodTypes.GiftCard,
          isRefund,
          registerId,
          saleId: sale?.id,
          clerkId: clerk?.id,
          giftCard,
          newGiftCardCode,
        })
        addCartTransaction(newTransaction)
        closeView(ViewProps.giftPaymentDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `$${parseFloat(giftCardPayment)?.toFixed(2)} GIFT VOUCHER  ${isRefund ? 'REFUND' : 'PAYMENT'}`,
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
      title={isRefund ? `GIFT VOUCHER REFUND` : `GIFT VOUCHER PAYMENT`}
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
              ? 'ENTER GIFT VOUCHER CODE'
              : !giftCard
              ? 'INVALID GIFT VOUCHER CODE'
              : `$${remainingOnGiftCard?.toFixed(2)} LEFT ON CARD`}
          </div>
        )}
        <div className="text-center text-xl font-bold my-4">
          {(!isRefund && (!giftCardCode || giftCardCode === '' || giftCardPayment === '' || !giftCard)) ||
          parseFloat(giftCardPayment) === 0 ? (
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
            `GIFT VOUCHER IS NOT VALID`
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
