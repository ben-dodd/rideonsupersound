import { receiveStockAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import ListItem from './list-item'

export default function SetPriceAndQuantities() {
  const [bucket, setBucket] = useAtom(receiveStockAtom)
  console.log(bucket)
  return (
    <div>
      <div className="help-text">
        Add the price, quantities received, and other details. Note you must
        have a price, vendor cut, quantity, and have selected new or used for
        every item to go to the next step.
      </div>
      {bucket?.items?.map((receiveItem) => (
        <ListItem
          key={receiveItem?.key}
          receiveItem={receiveItem}
          bucket={bucket}
          setBucket={setBucket}
        />
      ))}
    </div>
  )
}
