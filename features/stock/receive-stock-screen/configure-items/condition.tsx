import { useAppStore } from 'lib/store'
import { useState } from 'react'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import ButtonGroup from 'components/inputs/button-group'
import { DiscogsConditionTypes } from 'lib/types/discogs'

export default function Condition() {
  const { batchReceiveSession, updateBatchReceiveItemField } = useAppStore()
  const [bulkChange, setBulkChange] = useState({})
  const handleBulkChange = (value, field) => {
    setBulkChange({ ...bulkChange, [field]: value })
    batchReceiveSession?.batchList?.forEach((batchItem, index) => {
      handleItemChange(index, value, field)
    })
  }
  const handleItemChange = (index, value, field) => {
    console.log(index, field, value)
    updateBatchReceiveItemField(index, 'item', field, value)
  }

  console.log(bulkChange)

  const newItems = [
    { key: true, label: 'NEW' },
    { key: false, label: 'USED' },
  ]

  const condItems = [
    {
      key: DiscogsConditionTypes.P,
    },
    {
      key: DiscogsConditionTypes.F,
    },
    {
      key: DiscogsConditionTypes.G,
    },
    {
      key: DiscogsConditionTypes.GP,
    },
    {
      key: DiscogsConditionTypes.VG,
    },
    {
      key: DiscogsConditionTypes.VGP,
    },
    {
      key: DiscogsConditionTypes.NM,
    },
    {
      key: DiscogsConditionTypes.M,
    },
  ]
  return (
    <div className="w-full">
      <div className="w-full border-b bg-green-300 p-2">
        <div className="font-bold">BULK EDIT</div>
        <div className="flex w-full">
          <ButtonGroup
            className="w-1/6"
            items={newItems}
            value={bulkChange?.isNew}
            onChange={(item) => handleBulkChange(item?.key, 'isNew')}
          />
          <div className="mx-2" />
          <ButtonGroup
            className="w-5/6"
            items={condItems}
            value={bulkChange?.cond}
            onChange={(item) => handleBulkChange(item?.key, 'cond')}
          />
        </div>
      </div>
      {batchReceiveSession?.batchList?.map((batchItem, index) => {
        return (
          <div key={batchItem?.key} className="p-2 w-full">
            <div className="font-bold">{getItemDisplayName(batchItem?.item)}</div>
            <div className="flex w-full">
              <ButtonGroup
                className="w-1/6"
                items={newItems}
                value={batchItem?.item?.isNew}
                onChange={(item) => handleItemChange(index, item?.key, 'isNew')}
              />
              <div className="mx-2" />
              <ButtonGroup
                className="w-5/6"
                items={condItems}
                value={batchItem?.item?.cond}
                onChange={(item) => handleItemChange(index, item?.key, 'cond')}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
