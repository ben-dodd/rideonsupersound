import { ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useAppStore } from 'lib/store'
import { StockItemObject } from 'lib/types/stock'
import { getDefaultReceiveItem } from 'lib/functions/receiveStock'
import { getClothingDisplayName, getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import TextField from 'components/inputs/text-field'
import produce from 'immer'
import SettingsSelect from 'components/inputs/settings-select'

export default function Clothing() {
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const defaultItem = getDefaultReceiveItem(batchReceiveSession)
  const initClothingList = Array(20).fill({ size: '', colour: '', qty: '' })
  // M - Reaper Crew Sweatshirt (Petrol Blue)
  const [item, setItem] = useState<StockItemObject>(defaultItem?.item)
  const [clothingList, setClothingList] = useState(initClothingList)
  const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value })
  const itemCount = clothingList?.reduce?.((acc, row) => acc + (parseInt(row?.qty) || 0), 0)
  return (
    <div>
      <div className="flex justify-end align-center">
        <button
          onClick={() => {
            Object.values(clothingList)?.forEach(
              (row) =>
                row?.size &&
                row?.colour &&
                addBatchReceiveItem({
                  ...defaultItem,
                  item: {
                    ...item,
                    media: 'Clothing/Accessories',
                    format: item?.format || 'Shirt',
                    size: row?.size,
                    colour: row?.colour,
                  },
                  quantity: row?.quantity || defaultItem?.quantity,
                }),
            )
            setItem(defaultItem?.item)
            setClothingList(initClothingList)
          }}
          disabled={!item?.title && Object.keys(clothingList)?.length > 0}
          className="bg-col3-dark hover:bg-col3 ring-1 disabled:bg-gray-200 p-2 rounded"
        >
          {`Add ${itemCount ? `${itemCount} ` : ''}Item${itemCount === 1 ? '' : 's'} To Basket`} <ChevronRight />
        </button>
      </div>

      <div>
        <TextField
          divClass="bg-green-500"
          value={getClothingDisplayName({ ...item, ...clothingList?.[`0`] })}
          inputLabel="DISPLAY NAME (EXAMPLE)"
          displayOnly
        />
        <div className="flex justify-start w-full">
          <div className="pr-2 w-52 mr-2">
            <div className="w-52 h-52 relative">
              <img className="object-cover absolute" src={getImageSrc(item)} alt={item?.title || 'Stock image'} />
              {item?.id && (
                <div className="absolute w-52 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                  {getItemSku(item)}
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <TextField id="artist" value={item?.artist || ''} onChange={handleChange} inputLabel="ARTIST" />
            <TextField id="title" value={item?.title || ''} onChange={handleChange} inputLabel="TITLE" />
            <SettingsSelect object={item} onEdit={setItem} inputLabel="FORMAT" dbField="format" />
          </div>
        </div>
        <div className="py-2 border-b flex">
          <div className="font-bold w-1/6">SIZE</div>
          <div className="font-bold w-2/3">COLOUR</div>
          <div className="font-bold w-1/6">QTY</div>
        </div>
        {clothingList?.map((row, i) => (
          <div key={i} className="flex">
            <div className="font-bold w-1/6">
              <TextField
                value={row?.size}
                onChange={(e) =>
                  setClothingList(
                    produce(clothingList, (draft) => {
                      draft[i].size = e.target.value?.toUpperCase()
                    }),
                  )
                }
              />
            </div>
            <div className="font-bold w-2/3">
              <TextField
                value={row?.colour}
                onChange={(e) =>
                  setClothingList(
                    produce(clothingList, (draft) => {
                      draft[i].colour = e.target.value
                    }),
                  )
                }
              />
            </div>
            <div className="font-bold w-1/6">
              <TextField
                valueNum={row?.qty}
                inputType="number"
                min={0}
                onChange={(e) =>
                  setClothingList(
                    produce(clothingList, (draft) => {
                      draft[i].qty = e.target.value
                    }),
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
