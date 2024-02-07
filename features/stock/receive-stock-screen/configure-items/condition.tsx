import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import ButtonGroup from 'components/inputs/button-group'
import { DiscogsConditionTypes } from 'lib/types/discogs'
const CassetteGradingGuide = dynamic(() => import('./resources').then((resources) => resources.cassetteGradingGuide))
const CdGradingGuide = dynamic(() => import('./resources').then((resources) => resources.cdGradingGuide))
const VinylGradingGuide = dynamic(() => import('./resources').then((resources) => resources.vinylGradingGuide))

export default function Condition() {
  const { batchReceiveSession, updateBatchReceiveItemField, openInfo } = useAppStore()
  const [bulkChange, setBulkChange] = useState<any>({})
  const handleBulkChange = (value, field) => {
    setBulkChange({ ...bulkChange, [field]: value })
    batchReceiveSession?.batchList?.forEach((batchItem, index) => {
      handleItemChange(index, value, field)
    })
  }
  const handleItemChange = (index, value, field) => {
    updateBatchReceiveItemField(index, 'item', field, value)
  }

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
      <div className="grid grid-cols-4 gap-2">
        Record Grading Guides
        <button
          className={'icon-text-button'}
          onClick={() => openInfo({ open: true, title: 'How To Grade Vinyl', styledMessage: VinylGradingGuide })}
        >
          How To Grade Vinyl
        </button>
        <button
          className={'icon-text-button'}
          onClick={() => openInfo({ open: true, title: 'How To Grade CDs', styledMessage: CdGradingGuide })}
        >
          How To Grade CDs
        </button>
        <button
          className={'icon-text-button'}
          onClick={() => openInfo({ open: true, title: 'How To Grade Cassettes', styledMessage: CassetteGradingGuide })}
        >
          How To Grade Cassettes
        </button>
      </div>
      <div className="w-full border-b bg-green-300 p-2">
        <div className="font-bold">BULK EDIT</div>
        <div className="flex w-full">
          <ButtonGroup
            className="w-1/6"
            items={newItems}
            value={Boolean(bulkChange?.isNew)}
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
                value={Boolean(batchItem?.item?.isNew)}
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
