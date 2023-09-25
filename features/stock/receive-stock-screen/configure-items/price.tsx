import { useAppStore } from 'lib/store'
import { useState } from 'react'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { getPriceSuggestionText } from 'lib/functions/discogs'
import TextField from 'components/inputs/text-field'

export default function Price() {
  const { batchReceiveSession, updateBatchReceiveItemField } = useAppStore()
  const [bulkChange, setBulkChange] = useState({})
  const handleBulkChange = (e, field) => {
    setBulkChange({ ...bulkChange, [field]: e.target.value })
    batchReceiveSession?.batchList?.forEach((batchItem, index) => {
      handleItemChange(index, e, field)
    })
  }
  const handleItemChange = (index, e, field) => {
    updateBatchReceiveItemField(index, 'price', field, e.target.value)
  }
  return (
    <div className="w-full">
      <div className="w-full border-b bg-green-300 p-2">
        <div className="font-bold">BULK EDIT</div>
        <div className="grid grid-cols-6"></div>
      </div>
      {batchReceiveSession?.batchList?.map((batchItem, index) => {
        console.log(batchItem)
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
                value={batchItem?.price?.vendorCut}
                onChange={null}
              />
              <TextField
                inputLabel="STORE CUT"
                startAdornment={'$'}
                value={batchItem?.price?.storeCut}
                onChange={null}
              />
              <TextField inputLabel="MARGIN" endAdornment={'%'} value={batchItem?.price?.margin} onChange={null} />
              <TextField
                inputLabel="SELL PRICE"
                startAdornment={'$'}
                value={batchItem?.price?.totalSell}
                onChange={null}
                divClass="bg-yellow-500 font-bold"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
