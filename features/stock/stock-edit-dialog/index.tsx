import CreateableSelect from 'components/inputs/createable-select'
import RadioButton from 'components/inputs/radio-button'
import SettingsSelect from 'components/inputs/settings-select'
import TextField from 'components/inputs/text-field'
import { ModalButton } from 'lib/types'
import { getImageSrc, getItemDisplayName, getItemSku } from 'lib/functions/displayInventory'
import { createVendor, useVendors } from 'lib/api/vendor'
import { updateStockItem } from 'lib/api/stock'
import { useState } from 'react'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import Modal from 'components/modal'
import { useSWRConfig } from 'swr'
import { VendorObject } from 'lib/types/vendor'
import { StockItemObject } from 'lib/types/stock'
import { getObjectDifference } from 'lib/utils'

export default function StockEditDialog({ stockItem: { item: currItem } }) {
  const { view, closeView, setAlert } = useAppStore()
  const [item, setItem]: [StockItemObject, Function] = useState(currItem || {})
  const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value })
  const { vendors } = useVendors()
  const disabled = false
  const { mutate } = useSWRConfig()

  const [submitting, setSubmitting] = useState(false)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: false,
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        const update = getObjectDifference(item, currItem)
        await updateStockItem(update, currItem?.id)
        mutate(`stock/${currItem?.id}`)
        setSubmitting(false)
        closeView(ViewProps.stockEditDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `STOCK ITEM UPDATED`,
        })
      },
      text: 'UPDATE ITEM',
    },
  ]

  return (
    <Modal
      open={view?.stockEditDialog}
      closeFunction={() => closeView(ViewProps.stockEditDialog)}
      title={'EDIT ITEM'}
      buttons={buttons}
      loading={false}
      width="max-w-screen-md"
    >
      <div>
        <div className="flex justify-start w-full">
          <div className="pr-2 w-52 mr-2">
            <div className="w-52 h-52 relative">
              <img
                className="object-cover absolute"
                src={getImageSrc(item)}
                alt={item?.title || currItem?.title || 'Stock image'}
              />
              {currItem?.id && (
                <div className="absolute w-52 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                  {getItemSku(item)}
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <TextField
              id="artist"
              value={item?.artist || ''}
              onChange={handleChange}
              inputLabel="ARTIST"
              disabled={disabled}
            />
            <TextField
              id="title"
              value={item?.title || ''}
              onChange={handleChange}
              inputLabel="TITLE"
              disabled={disabled}
            />
            <TextField
              id="displayAs"
              value={item?.displayAs || getItemDisplayName(item)}
              onChange={handleChange}
              inputLabel="DISPLAY NAME"
              disabled={disabled}
            />
            {item?.vendorId && (
              <div>
                <CreateableSelect
                  inputLabel="SELLING FOR VENDOR"
                  fieldRequired
                  value={item?.vendorId}
                  label={vendors?.filter((v: VendorObject) => v?.id === item?.vendorId)?.[0]?.name || ''}
                  onChange={(vendorObject: any) =>
                    setItem({
                      ...item,
                      vendorId: parseInt(vendorObject?.value),
                    })
                  }
                  onCreateOption={async (vendorName: string) => {
                    const vendorId = await createVendor({
                      name: vendorName,
                    })
                    // logCreateVendor(clerk, vendorName, vendorId)
                    setItem({ ...item, vendor_id: vendorId })
                  }}
                  options={vendors?.map((val: VendorObject) => ({
                    value: val?.id,
                    label: val?.name || '',
                  }))}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mb-2">
          <TextField
            id="barcode"
            multiline
            inputLabel="BARCODE"
            value={item?.barcode || ''}
            onChange={handleChange}
            disabled={disabled}
            rows={1}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <SettingsSelect
            object={item}
            onEdit={setItem}
            inputLabel="TYPE"
            dbField="media"
            isCreateDisabled={true}
            isDisabled={disabled}
          />
          <SettingsSelect object={item} onEdit={setItem} inputLabel="FORMAT" dbField="format" isDisabled={disabled} />
        </div>
        {item?.format == 'Shirt' ? (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <SettingsSelect object={item} onEdit={setItem} inputLabel="COLOUR" dbField="colour" isDisabled={disabled} />
            <SettingsSelect object={item} onEdit={setItem} inputLabel="SIZE" dbField="size" isDisabled={disabled} />
          </div>
        ) : (
          <div className="flex items-end">
            <RadioButton
              key={`isNew${item?.isNew}`}
              inputLabel="CONDITION"
              group="isNew"
              value={item?.isNew ? 'true' : 'false'}
              onChange={(value: string) => setItem({ ...item, isNew: value === 'true' ? 1 : 0 })}
              options={[
                { id: 'new', value: 'true', label: 'New' },
                { id: 'used', value: 'false', label: 'Used' },
              ]}
              disabled={disabled}
            />
            <SettingsSelect
              className="w-full"
              object={item}
              onEdit={setItem}
              dbField="cond"
              isCreateDisabled={true}
              isDisabled={disabled}
              sorted={false}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 items-center justify-center">
          <SettingsSelect
            object={item}
            onEdit={setItem}
            inputLabel="SECTION"
            dbField="section"
            isCreateDisabled={true}
            isDisabled={disabled}
          />
          <SettingsSelect object={item} onEdit={setItem} inputLabel="COUNTRY" dbField="country" isDisabled={disabled} />
        </div>
        <SettingsSelect
          object={item}
          onEdit={setItem}
          inputLabel="GENRE / TAGS"
          isMulti
          dbField="genre"
          isDisabled={disabled}
        />
        <TextField
          id="description"
          inputLabel="DESCRIPTION / NOTES"
          value={item?.description || ''}
          onChange={handleChange}
          multiline
          disabled={disabled}
        />
        <div className="grid grid-cols-3 mt-4 gap-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={item?.doListOnWebsite}
              onChange={(e) => setItem({ ...item, doListOnWebsite: e.target.checked ? 1 : 0 })}
            />
            <div className="ml-2">List on website</div>
          </div>
          <div className="flex col-span-2 items-center">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={item?.hasNoQuantity}
              onChange={(e) => setItem({ ...item, hasNoQuantity: e.target.checked ? 1 : 0 })}
            />
            <div className="ml-2">Item has no stock quantity (e.g. lathe cut services)</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
