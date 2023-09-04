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
import dayjs from 'dayjs'
import { dateTimeISO } from 'lib/types/date'
import ChangePriceForm from '../change-price-form'
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
  const [date, setDate] = useState(dayjs().format(dateTimeISO))
  const [submitting, setSubmitting] = useState(false)

  const expiryMinutes = 5

  useEffect(() => {
    setPrice({
      totalSell: centsToDollars(currPrice?.totalSell)?.toFixed(2),
      vendorCut: centsToDollars(currPrice?.vendorCut)?.toFixed(2),
      storeCut: centsToDollars(getStoreCut(currPrice))?.toFixed(2),
      margin: getProfitMargin(currPrice)?.toFixed(1),
    })
  }, [currPrice])

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        (price?.totalSell !== '' && isNaN(parseFloat(price?.totalSell))) ||
        (price?.vendorCut !== '' && isNaN(parseFloat(price?.vendorCut))) ||
        (price?.margin !== '' && isNaN(parseFloat(price?.margin))) ||
        (price?.totalSell !== '' && isNaN(parseFloat(price?.totalSell))) ||
        (dayjs(date).add(expiryMinutes, 'minute').isBefore(dayjs()) &&
          Number(price?.totalSell) !== centsToDollars(currPrice?.totalSell)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        await createStockPrice({
          stockId: item?.id,
          clerkId: clerk?.id,
          dateValidFrom: date || dayjs.utc().format(),
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

  return (
    <Modal
      open={view?.changePriceDialog}
      closeFunction={() => closeView(ViewProps.changePriceDialog)}
      title={'CHANGE STOCK PRICE'}
      buttons={buttons}
      loading={isStockItemLoading}
    >
      <>
        <ChangePriceForm obj={price} setObj={setPrice} />
        <TextField
          inputLabel="Date Valid From"
          value={date}
          onChange={(e: any) => setDate(e.target.value)}
          inputType="datetime-local"
          max={dayjs().format(dateTimeISO)}
        />
        <TextField
          inputLabel="Notes"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
          rows={3}
        />
        {dayjs(date).add(expiryMinutes, 'minute').isBefore(dayjs()) &&
          Number(price?.totalSell) !== centsToDollars(currPrice?.totalSell) && (
            <div className="text-red-500 text-xs">
              TOTAL PRICE MUST EQUAL PREVIOUS TOTAL PRICE FOR RETROACTIVE PRICE CHANGES
            </div>
          )}
      </>
    </Modal>
  )
}
