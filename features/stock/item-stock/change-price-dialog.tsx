import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { ModalButton } from 'lib/types'
import { useEffect, useState } from 'react'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useRouter } from 'next/router'
import { createStockPrice, useStockItem } from 'lib/api/stock'
import { useSWRConfig } from 'swr'
import { centsToDollars, dollarsToCents } from 'lib/utils'
import { getProfitMargin, getStoreCut } from 'lib/functions/pay'

export default function ChangePriceDialog() {
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()
  const router = useRouter()
  const id = router.query.id
  const { mutate } = useSWRConfig()

  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const { item = {}, price: currPrice = {} } = stockItem || {}

  const [price, setPrice] = useState({ totalSell: '', vendorCut: '', storeCut: '', margin: '' })
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setPrice({
      totalSell: centsToDollars(currPrice?.totalSell).toFixed(2),
      vendorCut: centsToDollars(currPrice?.vendorCut).toFixed(2),
      storeCut: centsToDollars(getStoreCut(currPrice)).toFixed(2),
      margin: getProfitMargin(currPrice).toFixed(1),
    })
  }, [currPrice])

  const handleSetPrice = (e) => {
    const value = parseFloat(e.target.value)
    const textboxId = e.target.id
    if (isNaN(value) || (textboxId === 'margin' && value >= 100)) {
      setPrice({ ...price, [textboxId]: e.target.value })
      // Handle invalid input here
      return
    }
    let modifiedPrice = { ...price }

    switch (textboxId) {
      case 'totalSell':
        modifiedPrice.totalSell = e.target.value
        modifiedPrice.storeCut = (value - parseFloat(price?.vendorCut)).toFixed(2)
        modifiedPrice.margin = getProfitMargin(modifiedPrice)?.toFixed(1)
        setPrice(modifiedPrice)
        break
      case 'vendorCut':
        modifiedPrice.vendorCut = e.target.value
        modifiedPrice.storeCut = (parseFloat(price?.totalSell) - value).toFixed(2)
        modifiedPrice.margin = getProfitMargin(modifiedPrice)?.toFixed(1)
        setPrice(modifiedPrice)
        break
      case 'margin':
        modifiedPrice.margin = e.target.value
        modifiedPrice.totalSell = Math.round(parseFloat(price?.vendorCut) / (1 - value / 100)).toFixed(2)
        modifiedPrice.storeCut = (parseFloat(modifiedPrice?.totalSell) - parseFloat(modifiedPrice?.vendorCut)).toFixed(
          2,
        )
        setPrice(modifiedPrice)
        break
      case 'storeCut':
        modifiedPrice.storeCut = e.target.value
        modifiedPrice.totalSell = (parseFloat(price?.vendorCut) + value).toFixed(2)
        modifiedPrice.margin = getProfitMargin(modifiedPrice).toFixed(1)
        setPrice(modifiedPrice)
        break
      default:
        // Handle unknown textboxId here
        break
    }
  }

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        (price?.totalSell !== '' && isNaN(parseFloat(price?.totalSell))) ||
        (price?.vendorCut !== '' && isNaN(parseFloat(price?.vendorCut))) ||
        (price?.margin !== '' && isNaN(parseFloat(price?.margin))) ||
        (price?.totalSell !== '' && isNaN(parseFloat(price?.totalSell))),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        await createStockPrice({
          stockId: item?.id,
          clerkId: clerk?.id,
          totalSell: dollarsToCents(price?.totalSell),
          vendorCut: dollarsToCents(price?.vendorCut),
          note: 'New stock priced.',
        })
        mutate(`stock/${id}`)
        setSubmitting(false)
        closeView(ViewProps.changePriceDialog)
        // logChangePrice(stockItem, totalSell, vendorCut, clerk, stockPriceId)
        setAlert({
          open: true,
          type: 'success',
          message: `PRICE CHANGED`,
        })
      },
      text: 'CHANGE PRICE',
    },
  ]
  // TODO add ability to change by margin

  return (
    <Modal
      open={view?.changePriceDialog}
      closeFunction={() => closeView(ViewProps.changePriceDialog)}
      title={'CHANGE STOCK PRICE'}
      buttons={buttons}
      loading={isStockItemLoading}
    >
      <>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="totalSell"
            inputLabel="Total Sell"
            divClass="text-4xl"
            startAdornment="$"
            inputClass="text-center"
            value={price?.totalSell}
            error={isNaN(parseFloat(price?.totalSell))}
            onChange={handleSetPrice}
          />
          <TextField
            id="vendorCut"
            inputLabel="Vendor Cut"
            divClass="text-4xl w-full"
            startAdornment="$"
            inputClass="text-center"
            value={price?.vendorCut}
            error={isNaN(parseFloat(price?.vendorCut))}
            onChange={handleSetPrice}
          />
          <TextField
            id="margin"
            inputLabel="Margin"
            divClass="text-4xl"
            endAdornment="%"
            inputClass="text-center"
            value={price?.margin}
            error={isNaN(parseFloat(price?.margin)) || parseFloat(price?.margin) >= 100}
            onChange={handleSetPrice}
          />
          <TextField
            id="storeCut"
            inputLabel="Store Cut"
            divClass="text-4xl"
            startAdornment="$"
            inputClass="text-center"
            value={price?.storeCut}
            error={isNaN(parseFloat(price?.storeCut))}
            onChange={handleSetPrice}
          />
        </div>
        <TextField
          inputLabel="Notes"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
          rows={3}
        />
      </>
    </Modal>
  )
}
