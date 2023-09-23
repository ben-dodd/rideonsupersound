import { useAppStore } from 'lib/store'
import { useState } from 'react'
import SettingsSelect from 'components/inputs/settings-select'
import { getItemDisplayName } from 'lib/functions/displayInventory'

export default function Quantities() {
  const { batchReceiveSession, updateBatchReceiveItemField } = useAppStore()
  const [bulkChange, setBulkChange] = useState({})
  const handleBulkChange = (e, field, multi = false) => {
    setBulkChange({ ...bulkChange, [field]: multi ? e?.map((obj) => obj.value) : e?.value || null })
    batchReceiveSession?.batchList?.forEach((batchItem, index) => {
      handleItemChange(index, e, field, multi)
    })
  }
  const handleItemChange = (index, e, field, multi = false) => {
    updateBatchReceiveItemField(index, 'item', field, multi ? e?.map((obj) => obj.value) : e.value)
  }
  return (
    <div className="w-full">
      <div className="w-full border-b bg-green-300 p-2">
        <div className="font-bold">BULK EDIT</div>
        <div className="grid grid-cols-6 gap-2">
          <SettingsSelect
            object={bulkChange}
            customEdit={(e) => handleBulkChange(e, 'media')}
            inputLabel="TYPE"
            dbField="media"
            isCreateDisabled={true}
          />
          <SettingsSelect
            object={bulkChange}
            customEdit={(e) => handleBulkChange(e, 'format')}
            inputLabel="FORMAT"
            dbField="format"
          />

          <SettingsSelect
            object={bulkChange}
            customEdit={(e) => handleBulkChange(e, 'section')}
            inputLabel="SECTION"
            dbField="section"
            isCreateDisabled={true}
          />
          <SettingsSelect
            object={bulkChange}
            customEdit={(e) => handleBulkChange(e, 'country')}
            inputLabel="COUNTRY"
            dbField="country"
          />
          <SettingsSelect
            className="col-span-2"
            object={bulkChange}
            customEdit={(e) => handleBulkChange(e, 'genre', true)}
            inputLabel="GENRE / TAGS"
            isMulti
            dbField="genre"
          />
        </div>
      </div>
      {batchReceiveSession?.batchList?.map((batchItem, index) => {
        return (
          <div key={batchItem?.key} className="p-2">
            <div className="font-bold">{getItemDisplayName(batchItem?.item)}</div>
            <div className="grid grid-cols-6 gap-2">
              <SettingsSelect
                object={batchItem?.item}
                customEdit={(e) => handleItemChange(index, e, 'media')}
                dbField="media"
                isCreateDisabled={true}
              />
              <SettingsSelect
                object={batchItem?.item}
                customEdit={(e) => handleItemChange(index, e, 'format')}
                dbField="format"
              />

              <SettingsSelect
                object={batchItem?.item}
                customEdit={(e) => handleItemChange(index, e, 'section')}
                dbField="section"
                isCreateDisabled={true}
              />
              <SettingsSelect
                object={batchItem?.item}
                customEdit={(e) => handleItemChange(index, e, 'country')}
                dbField="country"
              />
              <SettingsSelect
                className="col-span-2"
                object={batchItem?.item}
                customEdit={(e) => handleItemChange(index, e, 'genre', true)}
                isMulti
                dbField="genre"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
