import { ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useAppStore } from 'lib/store'
import { StockItemObject } from 'lib/types/stock'
import { getDefaultReceiveItem } from 'lib/functions/receiveStock'
import { getClothingDisplayName, getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import TextField from 'components/inputs/text-field'
import produce from 'immer'

export default function Clothing() {
  const { batchReceiveSession, addBatchReceiveItem } = useAppStore()
  const defaultItem = getDefaultReceiveItem(batchReceiveSession)
  // M - Reaper Crew Sweatshirt (Petrol Blue)
  const [item, setItem] = useState<StockItemObject>(defaultItem?.item)
  const [clothingList, setClothingList] = useState({})
  const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value })
  const itemCount = Object.values(clothingList)?.reduce?.((acc, row) => acc + parseInt(row?.qty) || 0, 0)

  return (
    <div>
      <div className="flex justify-end align-center">
        <button
          onClick={() => {
            addBatchReceiveItem({ ...defaultItem, item })
            setItem(defaultItem?.item)
          }}
          disabled={!item?.title}
          className="bg-col3-dark hover:bg-col3 ring-1 disabled:bg-gray-200 p-2 rounded"
        >
          {`Add ${itemCount ? `${itemCount} ` : ''}Item${itemCount === 1 ? '' : 's'} To Basket`} <ChevronRight />
        </button>
      </div>

      <div>
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
            <TextField
              id="displayAs"
              value={getClothingDisplayName({ ...item, ...clothingList?.[`0`] })}
              inputLabel="DISPLAY NAME (EXAMPLE)"
              displayOnly
            />
          </div>
        </div>
        <div className="py-2 border-b flex">
          <div className="font-bold w-1/6">SIZE</div>
          <div className="font-bold w-2/3">COLOUR</div>
          <div className="font-bold w-1/6">QTY</div>
        </div>
        {Array.from({ length: 20 }).map((k, i) => (
          <div key={i} className="flex">
            <div className="font-bold w-1/6">
              <TextField
                value={clothingList[`${i}`]?.size}
                onChange={(e) =>
                  setClothingList(
                    produce(clothingList, (draft) => {
                      if (!draft[`${i}`]) draft[`${i}`] = {}
                      draft[`${i}`].size = e.target.value?.toUpperCase()
                    }),
                  )
                }
              />
            </div>
            <div className="font-bold w-2/3">
              <TextField
                value={clothingList[`${i}`]?.colour}
                onChange={(e) =>
                  setClothingList(
                    produce(clothingList, (draft) => {
                      if (!draft[`${i}`]) draft[`${i}`] = {}
                      draft[`${i}`].colour = e.target.value
                    }),
                  )
                }
              />
            </div>
            <div className="font-bold w-1/6">
              <TextField
                valueNum={clothingList[`${i}`]?.qty}
                inputType="number"
                min={0}
                onChange={(e) =>
                  setClothingList(
                    produce(clothingList, (draft) => {
                      if (!draft[`${i}`]) draft[`${i}`] = {}
                      draft[`${i}`].qty = e.target.value
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
