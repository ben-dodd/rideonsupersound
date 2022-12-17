import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logChangePrice } from 'features/log/lib/functions'
import { ModalButton } from 'lib/types'
import { useEffect, useState } from 'react'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useRouter } from 'next/router'
import { createStockPrice, useStockItem, useStockList } from 'lib/api/stock'

export default function ChangePriceDialog() {
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()
  const router = useRouter()
  const id = router.query.id

  const { inventory, mutateInventory } = useStockList()
  const { stockItem, isStockItemLoading, mutateStockItem } = useStockItem(
    `${id}`
  )

  const [totalSell, setTotalSell] = useState('')
  const [vendorCut, setVendorCut] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setTotalSell(`${(stockItem?.total_sell / 100)?.toFixed(2)}`)
    setVendorCut(`${(stockItem?.vendor_cut / 100)?.toFixed(2)}`)
  }, [stockItem])

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        (totalSell !== '' && isNaN(parseFloat(totalSell))) ||
        (vendorCut !== '' && isNaN(parseFloat(vendorCut))),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        const stockPriceId = await createStockPrice({
          stockId: stockItem?.id,
          clerkId: clerk?.id,
          totalSell: parseFloat(totalSell) * 100,
          vendorCut: parseFloat(vendorCut) * 100,
          note: 'New stock priced.',
        })
        setSubmitting(false)
        closeView(ViewProps.changePriceDialog)
        logChangePrice(stockItem, totalSell, vendorCut, clerk, stockPriceId)
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
        <div className="grid grid-cols-2 gap-4">
          <TextField
            inputLabel="Total Sell"
            divClass="text-4xl"
            startAdornment="$"
            inputClass="text-center"
            value={totalSell}
            error={isNaN(parseFloat(totalSell))}
            onChange={(e: any) => setTotalSell(e.target.value)}
          />
          <TextField
            inputLabel="Vendor Cut"
            divClass="text-4xl w-full"
            startAdornment="$"
            inputClass="text-center"
            value={vendorCut}
            error={isNaN(parseFloat(vendorCut))}
            onChange={(e: any) => setVendorCut(e.target.value)}
          />
          <TextField
            inputLabel="Margin"
            divClass="text-4xl"
            endAdornment="%"
            inputClass="text-center"
            displayOnly
            value={
              (
                ((parseFloat(totalSell) - parseFloat(vendorCut)) /
                  parseFloat(totalSell)) *
                100
              )?.toFixed(1) || 'N/A'
            }
          />
          <TextField
            inputLabel="Store Cut"
            divClass="text-4xl"
            startAdornment="$"
            inputClass="text-center"
            displayOnly
            value={
              (parseFloat(totalSell) - parseFloat(vendorCut)).toFixed(2) ||
              'N/A'
            }
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
