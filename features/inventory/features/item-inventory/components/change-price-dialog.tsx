import TextField from '@components/inputs/text-field'
import Modal from '@components/modal'
import { logChangePrice } from '@features/log/lib/functions'
import {
  alertAtom,
  clerkAtom,
  loadedItemIdAtom,
  pageAtom,
  viewAtom,
} from '@lib/atoms'
import { createStockPriceInDatabase } from '@lib/database/create'
import { useInventory, useStockItem } from '@lib/database/read'
import { ModalButton } from '@lib/types'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

export default function ChangePriceDialog() {
  const [loadedItemId] = useAtom(loadedItemIdAtom)
  const [clerk] = useAtom(clerkAtom)
  const [page] = useAtom(pageAtom)
  const [view, setView] = useAtom(viewAtom)
  const [, setAlert] = useAtom(alertAtom)

  // SWR
  const { inventory, mutateInventory } = useInventory()
  const { stockItem, isStockItemLoading, mutateStockItem } = useStockItem(
    loadedItemId[page]
  )

  // State
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
        const totalSellNum = parseFloat(totalSell) * 100
        const vendorCutNum = parseFloat(vendorCut) * 100
        mutateInventory(
          inventory?.map((i) =>
            i?.id === stockItem?.id
              ? { ...i, total_sell: totalSellNum, vendor_cut: vendorCutNum }
              : i
          ),
          false
        )
        mutateStockItem(
          [
            {
              ...stockItem,
              total_sell: totalSellNum,
              vendor_cut: vendorCutNum,
            },
          ],
          false
        )
        const stockPriceId = await createStockPriceInDatabase(
          stockItem?.id,
          clerk,
          totalSellNum,
          vendorCutNum,
          notes
        )
        setSubmitting(false)
        setView({ ...view, changePriceDialog: false })
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
      closeFunction={() => setView({ ...view, changePriceDialog: false })}
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
