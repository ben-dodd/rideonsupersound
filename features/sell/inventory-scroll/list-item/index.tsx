import { StockObject } from 'lib/types'
import Warning from './warning'
import Quantities from './quantities'
import ItemDetails from './item-details'
import Actions from './actions'
import { getItemQuantity } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import ItemImage from './item-image'
import Title from './title'

export default function ListItem({ item }: { item: StockObject }) {
  const { cart } = useAppStore()
  const itemQuantity = getItemQuantity(item, cart?.items)

  return (
    <div
      className={`flex w-full mb-2 text-black ${
        item?.quantity < 1 ? 'bg-pink-200' : 'bg-gray-200'
      }`}
    >
      <ItemImage item={item} />
      <div className="flex flex-col w-full px-2">
        <div className="flex justify-between border-b items-center border-gray-400">
          <Title item={item} />
          <Actions item={item} itemQuantity={itemQuantity} />
        </div>
        <div className="flex w-full h-full justify-between">
          <div className="flex flex-col justify-between w-full">
            <div className="flex justify-between items-end">
              <ItemDetails item={item} />
              <Warning item={item} itemQuantity={itemQuantity} />
            </div>
            <Quantities item={item} itemQuantity={itemQuantity} />
          </div>
        </div>
      </div>
    </div>
  )
}
