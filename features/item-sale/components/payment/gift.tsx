// Packages
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'

// DB
import { alertAtom, cartAtom, clerkAtom, viewAtom } from 'lib/atoms'
import {
  useCustomers,
  useGiftCards,
  useInventory,
  useLogs,
  useRegisterID,
} from 'lib/swr-hooks'
import {
  CustomerObject,
  GiftCardObject,
  ModalButton,
  PaymentMethodTypes,
  SaleTransactionObject,
} from 'lib/types'

import SyncIcon from '@mui/icons-material/Sync'

// Functions
import { getSaleVars, makeGiftCardCode } from 'lib/data-functions'

// Components
import TextField from '@/components/inputs/text-field'
import Modal from '@/components/modal'
import { saveLog } from 'lib/db-functions'

export default function Gift() {
  dayjs.extend(UTC)
  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [, setAlert] = useAtom(alertAtom)

  // SWR
  const { giftCards, mutateGiftCards } = useGiftCards()
  const { registerID } = useRegisterID()
  const { inventory } = useInventory()
  const { customers } = useCustomers()
  const { logs, mutateLogs } = useLogs()

  const { totalRemaining } = getSaleVars(cart, inventory)

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
        giftCard?.gift_card_code === giftCardCode.toUpperCase()
    )[0]
    console.log(gc?.gift_card_remaining)
    console.log(totalRemaining)
    if (gc?.gift_card_remaining / 100 < totalRemaining)
      setGiftCardPayment(`${Math.abs(gc.gift_card_remaining / 100).toFixed(2)}`)
    return gc
  }, [giftCardCode, giftCards])

  const [newGiftCardCode, setNewGiftCardCode] = useState(
    makeGiftCardCode(giftCards)
  )
  const [submitting, setSubmitting] = useState(false)

  // Constants
  const remainingOnGiftCard = giftCard?.gift_card_remaining / 100
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
          (!giftCard || !giftCard?.gift_card_is_valid || leftOver < 0)),
      loading: submitting,
      onClick: () => {
        setSubmitting(true)
        let giftCardUpdate: GiftCardObject = {}
        if (isRefund) {
          giftCardUpdate = {
            is_gift_card: true,
            gift_card_code: newGiftCardCode,
            gift_card_amount: parseFloat(giftCardPayment) * 100,
            gift_card_remaining: parseFloat(giftCardPayment) * 100,
            note: `Gift card created as refund payment${
              cart?.id ? ` for sale #${cart?.id}` : ''
            }.`,
            gift_card_is_valid: true,
          }
        } else {
          giftCardUpdate = { ...giftCard }
          giftCardUpdate.gift_card_remaining = leftOver * 100
          if (leftOver < 10) {
            giftCardUpdate.gift_card_is_valid = false
            giftCardUpdate.gift_card_remaining = 0
          }
        }
        let transaction: SaleTransactionObject = {
          date: dayjs.utc().format(),
          sale_id: cart?.id,
          clerk_id: clerk?.id,
          payment_method: PaymentMethodTypes.GiftCard,
          amount: isRefund
            ? parseFloat(giftCardPayment) * -100
            : parseFloat(giftCardPayment) * 100,
          register_id: registerID,
          gift_card_update: giftCardUpdate,
          is_refund: isRefund,
        }
        if (!isRefund) {
          transaction = {
            ...transaction,
            gift_card_id: giftCardUpdate?.id,
            gift_card_taken: giftCardUpdate?.gift_card_is_valid,
            gift_card_remaining: giftCardUpdate?.gift_card_remaining,
            gift_card_change: leftOver < 10 ? leftOver * 100 : 0,
          }
        }
        let transactions = cart?.transactions || []
        transactions.push(transaction)
        setCart({ ...cart, transactions })
        setSubmitting(false)
        setView({ ...view, giftPaymentDialog: false })
        saveLog(
          {
            log: `$${parseFloat(giftCardPayment)?.toFixed(2)} ${
              isRefund
                ? `refunded with new gift card #${newGiftCardCode} to`
                : `gift card payment from`
            } ${
              cart?.customer_id
                ? customers?.filter(
                    (c: CustomerObject) => c?.id === cart?.customer_id
                  )[0]?.name
                : 'customer'
            }${cart?.id ? ` (sale #${cart?.id})` : ''}.${
              isRefund
                ? ''
                : ` Gift card #${giftCardCode?.toUpperCase()}. ${
                    leftOver < 10
                      ? `Card taken.${
                          leftOver > 0
                            ? ` $${leftOver?.toFixed(
                                2
                              )} change given for remainder on card.`
                            : ''
                        }`
                      : `$${remainingOnGiftCard?.toFixed(2)} remaining on card.`
                  }`
            }`,
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
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
      closeFunction={() => setView({ ...view, giftPaymentDialog: false })}
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
          ) : !giftCard?.gift_card_is_valid ? (
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
