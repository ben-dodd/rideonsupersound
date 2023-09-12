import ListItem from './list-item'
import { useAppStore } from 'lib/store'

export default function SetPriceAndQuantities() {
  const { batchReceiveSession } = useAppStore()
  return (
    <div>
      <div className="help-text">
        Add the price, quantities received, and other details. Note you must have a price, vendor cut, quantity, and
        have selected new or used for every item to go to the next step.
      </div>
      {batchReceiveSession?.items?.map((receiveItem) => (
        <ListItem key={receiveItem?.key} receiveItem={receiveItem} />
      ))}
    </div>
  )
}
