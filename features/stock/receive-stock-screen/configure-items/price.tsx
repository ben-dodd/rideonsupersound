import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { getPriceSuggestionText } from 'lib/functions/discogs'
import TextField from 'components/inputs/text-field'
import { centsToDollars, dollarsToCents } from 'lib/utils'
import { getProfitMargin, getStoreCut } from 'lib/functions/pay'
import produce from 'immer'
import { Lock, LockOpen } from '@mui/icons-material'
const Tooltip = dynamic(() => import('@mui/material/Tooltip'))
import { getPriceEdits } from 'lib/functions/stock'

export default function Price() {
  const { batchReceiveSession, updateBatchReceiveItem } = useAppStore()
  const [bulkChange, setBulkChange] = useState({ vendorCut: '', storeCut: '', margin: '', totalSell: '' })
  const [itemPrices, setItemPrices] = useState([{ vendorCut: '', storeCut: '', margin: '', totalSell: '' }])
  const [locked, setLocked] = useState('vendorCut')
  const handleBulkChange = (e, field) => {
    setBulkChange({ ...bulkChange, [field]: e.target.value })
    batchReceiveSession?.batchList?.forEach((batchItem, index) => {
      handleItemChange(batchItem?.key, index, e, field)
    })
  }

  const handleItemChange = (key, index, e, field) => {
    if (!isNaN(Number(e?.target?.value))) {
      const priceEdits = getPriceEdits(itemPrices[index], field, e?.target?.value || '', locked)
      setItemPrices((itemPrices) =>
        produce(itemPrices, (draft) => {
          draft[index] = priceEdits
        }),
      )
      const convertedPrices = {
        storeCut: dollarsToCents(priceEdits?.storeCut),
        vendorCut: dollarsToCents(priceEdits?.vendorCut),
        totalSell: dollarsToCents(priceEdits?.totalSell),
        margin: priceEdits?.margin,
      }
      updateBatchReceiveItem(key, { price: convertedPrices })
    }
  }
  useEffect(() => {
    const prices = []
    batchReceiveSession?.batchList?.forEach((batchItem) => {
      prices.push({
        vendorCut: centsToDollars(batchItem?.price?.vendorCut),
        totalSell: centsToDollars(batchItem?.price?.totalSell),
        margin: getProfitMargin(batchItem?.price)?.toFixed(1),
        storeCut: centsToDollars(getStoreCut(batchItem?.price)),
      })
    })
    setItemPrices(prices)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchReceiveSession?.id])

  return (
    <div className="w-full">
      <div className="w-full border-b bg-green-300 p-2">
        <div className="grid grid-cols-6 gap-2 items-center">
          <div className="font-bold col-span-2">BULK EDIT</div>
          <div>
            <Tooltip title="Lock vendor cut price">
              <button
                onClick={() => setLocked('vendorCut')}
                className={`${
                  locked === 'vendorCut' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
                } rounded-full p-2`}
              >
                {locked === 'vendorCut' ? <Lock /> : <LockOpen />}
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Lock store cut price">
              <button
                onClick={() => setLocked('storeCut')}
                className={`${
                  locked === 'storeCut' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
                } rounded-full p-2`}
              >
                {locked === 'storeCut' ? <Lock /> : <LockOpen />}
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Lock margin">
              <button
                onClick={() => setLocked('margin')}
                className={`${
                  locked === 'margin' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
                } rounded-full p-2`}
              >
                {locked === 'margin' ? <Lock /> : <LockOpen />}
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Lock total sell price">
              <button
                onClick={() => setLocked('totalSell')}
                className={`${
                  locked === 'totalSell' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
                } rounded-full p-2`}
              >
                {locked === 'totalSell' ? <Lock /> : <LockOpen />}
              </button>
            </Tooltip>
          </div>
          <div className="col-span-2" />
          <TextField
            inputLabel="VENDOR CUT"
            startAdornment={'$'}
            value={bulkChange?.vendorCut}
            onChange={(e) => handleBulkChange(e, 'vendorCut')}
          />
          <TextField
            inputLabel="STORE CUT"
            startAdornment={'$'}
            value={bulkChange?.storeCut}
            onChange={(e) => handleBulkChange(e, 'storeCut')}
          />
          <TextField
            inputLabel="MARGIN"
            endAdornment={'%'}
            value={bulkChange?.margin}
            onChange={(e) => handleBulkChange(e, 'margin')}
          />
          <TextField
            inputLabel="SELL PRICE"
            startAdornment={'$'}
            value={bulkChange?.totalSell}
            onChange={(e) => handleBulkChange(e, 'totalSell')}
            divClass="bg-yellow-400 font-bold selection:bg-blue-400 hover:bg-yellow-300"
          />
        </div>
      </div>
      {batchReceiveSession?.batchList?.map((batchItem, index) => {
        return (
          <div key={batchItem?.key} className="p-2 border-b">
            <div className="font-bold">{getItemDisplayName(batchItem?.item)}</div>
            <div className="grid grid-cols-6 gap-2 items-center">
              <div className="col-span-2">
                {batchItem?.item?.discogsItem?.priceSuggestions ? (
                  <div className="bg-green-200 border p-2">
                    <div className="text-xs my-1">SUGGESTED DISCOGS PRICE</div>
                    <div className="font-bold text-sm">{getPriceSuggestionText(batchItem?.item)}</div>
                  </div>
                ) : (
                  <div />
                )}
              </div>
              <TextField
                inputLabel="VENDOR CUT"
                startAdornment={'$'}
                value={itemPrices[index]?.vendorCut || ''}
                onChange={(e) => handleItemChange(batchItem?.key, index, e, 'vendorCut')}
              />
              <TextField
                inputLabel="STORE CUT"
                startAdornment={'$'}
                value={itemPrices[index]?.storeCut || ''}
                onChange={(e) => handleItemChange(batchItem?.key, index, e, 'storeCut')}
              />
              <TextField
                inputLabel="MARGIN"
                endAdornment={'%'}
                value={itemPrices[index]?.margin || ''}
                onChange={(e) => handleItemChange(batchItem?.key, index, e, 'margin')}
              />
              <TextField
                inputLabel="SELL PRICE"
                startAdornment={'$'}
                value={itemPrices[index]?.totalSell || ''}
                onChange={(e) => handleItemChange(batchItem?.key, index, e, 'totalSell')}
                divClass="bg-yellow-400 font-bold selection:bg-blue-400 hover:bg-yellow-300"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
