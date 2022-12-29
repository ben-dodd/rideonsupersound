import { useState } from 'react'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { ModalButton } from 'lib/types'
import SyncIcon from '@mui/icons-material/Sync'
import { makeGiftCardCode } from 'lib/functions/sell'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { createStockItem, useGiftCards } from 'lib/api/stock'

export default function GiftCardDialog() {
  const { clerk } = useClerk()
  const { giftCards } = useGiftCards()
  const { view, setAlert, addCartItem, closeView } = useAppStore()

  const defaultAmount = '20'
  const [giftCardCode, setGiftCardCode] = useState(makeGiftCardCode(giftCards))
  const [amount, setAmount] = useState(defaultAmount)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const clearDialog = () => {
    setAmount(defaultAmount)
    setNote('')
    closeView(ViewProps.giftCardDialog)
  }

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: amount === '' || isNaN(parseFloat(amount)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        const newGiftCard = await createStockItem(
          {
            isGiftCard: true,
            giftCardIsValid: false,
            giftCardAmount: parseFloat(defaultAmount) * 100,
            giftCardRemaining: parseFloat(defaultAmount) * 100,
            giftCardCode,
            note,
          },
          clerk
        )
        setSubmitting(false)
        addCartItem(
          {
            itemId: newGiftCard?.id,
            quantity: '1',
            isGiftCard: true,
          },
          clerk?.id
        )
        clearDialog()
        setAlert({
          open: true,
          type: 'success',
          message: `NEW GIFT CARD CREATED`,
        })
      },
      text: 'CREATE GIFT CARD',
    },
  ]

  return (
    <Modal
      open={view?.giftCardDialog}
      closeFunction={clearDialog}
      title={'CREATE GIFT CARD'}
      buttons={buttons}
    >
      <>
        <div className="flex justify-between items-center">
          <div className="text-8xl text-red-800 font-mono">{giftCardCode}</div>
          <button
            className="icon-button-small-mid"
            onClick={() => setGiftCardCode(makeGiftCardCode(giftCards))}
          >
            <SyncIcon />
          </button>
        </div>
        <TextField
          autoFocus
          className="mt-8"
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={amount}
          error={isNaN(parseFloat(amount))}
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <TextField
          inputLabel="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={3}
        />
      </>
    </Modal>
  )
}

// setCart({
//   id: cart?.id || null,
//   // REVIEW check the date to string thing works ok
//   date_sale_opened: cart?.dateSaleOpened || dayjs.utc().format(),
//   sale_opened_by: cart?.saleOpenedBy || clerk?.id,
//   items: newItems,
// })
