import RadioButton from '@/components/_components/inputs/radio-button'
import Image from 'next/image'
import SettingsSelect from '@/components/_components/inputs/settings-select'
import TextField from '@/components/_components/inputs/text-field'
import {
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from '@/lib/data-functions'
import { StockObject, VendorObject } from '@/lib/types'
import { useMemo } from 'react'
import { useLogs, useVendors } from '@/lib/swr-hooks'
import CreateableSelect from '@/components/_components/inputs/createable-select'
import { saveLog, saveVendorToDatabase } from '@/lib/db-functions'
import { useAtom } from 'jotai'
import { clerkAtom } from '@/lib/atoms'
import { UploadableImage } from '@/components/_components/image/uploadable'

interface inventoryProps {
  item: StockObject
  setItem: Function
  disabled?: boolean
}

export default function InventoryItemForm({
  item,
  setItem,
  disabled,
}: inventoryProps) {
  const handleChange = (e) =>
    setItem({ ...item, [e.target.name]: e.target.value })
  const { vendors } = useVendors()
  const { logs, mutateLogs } = useLogs()
  const [clerk] = useAtom(clerkAtom)

  return (
    <div>
      <div className="flex justify-start w-full">
        {/* IMAGE */}
        <div className="pr-2 w-52 mr-2">
          <div className="w-52 h-52 relative">
            <UploadableImage
              imageUrl={getImageSrc(item)}
              onImageUpload={(imageUrl) =>
                handleChange({ target: { name: 'imageUrl', value: imageUrl } })
              }
              uploadFolder={'stock'}
            />
            {/* <img
              className="object-cover absolute"
              src={getImageSrc(item)}
              alt={item?.title || 'Inventory image'}
            /> */}
            {item?.id && (
              <div className="absolute w-52 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                {getItemSku(item)}
              </div>
            )}
          </div>
        </div>
        {/* MAIN DETAILS */}
        <div className="w-full">
          <TextField
            value={item?.artist || ''}
            onChange={(e: any) => setItem({ ...item, artist: e.target.value })}
            inputLabel="ARTIST"
            disabled={disabled}
          />
          <TextField
            value={item?.title || ''}
            onChange={(e: any) => setItem({ ...item, title: e.target.value })}
            inputLabel="TITLE"
            disabled={disabled}
          />
          <TextField
            value={item?.display_as || getItemDisplayName(item)}
            onChange={(e: any) =>
              setItem({ ...item, display_as: e.target.value })
            }
            inputLabel="DISPLAY NAME"
            disabled={disabled}
          />
          {item?.vendor_id && (
            <div>
              <CreateableSelect
                inputLabel="SELLING FOR VENDOR"
                fieldRequired
                value={item?.vendor_id}
                label={
                  vendors?.filter(
                    (v: VendorObject) => v?.id === item?.vendor_id
                  )?.[0]?.name || ''
                }
                onChange={(vendorObject: any) =>
                  setItem({ ...item, vendor_id: parseInt(vendorObject?.value) })
                }
                onCreateOption={async (inputValue: string) => {
                  const vendorId = await saveVendorToDatabase({
                    name: inputValue,
                  })
                  saveLog(
                    {
                      log: `Vendor ${inputValue} (${vendorId}) created.`,
                      clerk_id: clerk?.id,
                    },
                    logs,
                    mutateLogs
                  )
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
        <SettingsSelect
          object={item}
          onEdit={setItem}
          inputLabel="FORMAT"
          dbField="format"
          isDisabled={disabled}
        />
      </div>
      {item?.format == 'Shirt' ? (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <SettingsSelect
            object={item}
            onEdit={setItem}
            inputLabel="COLOUR"
            dbField="colour"
            isDisabled={disabled}
          />
          <SettingsSelect
            object={item}
            onEdit={setItem}
            inputLabel="SIZE"
            dbField="size"
            isDisabled={disabled}
          />
        </div>
      ) : (
        <div className="flex items-end">
          <RadioButton
            key={`isNew${item?.is_new}`}
            inputLabel="CONDITION"
            group="isNew"
            value={
              item?.is_new === null || item?.is_new === undefined
                ? 'true'
                : item?.is_new
                ? 'true'
                : 'false'
            }
            onChange={(value: string) =>
              setItem({ ...item, is_new: value === 'true' ? 1 : 0 })
            }
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
        <SettingsSelect
          object={item}
          onEdit={setItem}
          inputLabel="COUNTRY"
          dbField="country"
          isDisabled={disabled}
        />
      </div>
      <SettingsSelect
        object={item}
        onEdit={setItem}
        inputLabel="GENRE / TAGS"
        isMulti
        dbField="genre"
        isDisabled={disabled}
      />
      {/* <div className="gap-2 items-center justify-center">
        <TextField
          id="release_year"
          inputLabel="RELEASE YEAR"
          value={item?.release_year || ""}
          onChange={handleChange}
          disabled={disabled}
        />
      </div> */}
      {/* <SettingsSelect
        object={item}
        onEdit={setItem}
        isMulti
        inputLabel="TAGS"
        dbField="tag"
        isDisabled={disabled}
      /> */}
      <TextField
        id="description"
        inputLabel="DESCRIPTION / NOTES"
        value={item?.description || ''}
        onChange={handleChange}
        multiline
        disabled={disabled}
      />
      {/* <TextField
        id="note"
        inputLabel="NOTES"
        value={item?.note || ""}
        onChange={handleChange}
        multiline
        disabled={disabled}
      /> */}
      <div className="grid grid-cols-3 mt-4 gap-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={item?.do_list_on_website === 0 ? false : true}
            onChange={(e) =>
              setItem({ ...item, do_list_on_website: e.target.checked ? 1 : 0 })
            }
          />
          <div className="ml-2">List on website</div>
        </div>
        <div className="flex col-span-2 items-center">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={item?.has_no_quantity === 1 ? true : false}
            onChange={(e) =>
              setItem({ ...item, has_no_quantity: e.target.checked ? 1 : 0 })
            }
          />
          <div className="ml-2">
            Item has no stock quantity (e.g. lathe cut services)
          </div>
        </div>
      </div>
    </div>
  )
}
