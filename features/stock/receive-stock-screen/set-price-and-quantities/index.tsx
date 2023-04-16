import ListItem from './list-item'
import { useAppStore } from 'lib/store'

export default function SetPriceAndQuantities() {
  const { receiveBasket } = useAppStore()
  return (
    <div>
      <div className="help-text">
        Add the price, quantities received, and other details. Note you must
        have a price, vendor cut, quantity, and have selected new or used for
        every item to go to the next step.
      </div>
      {receiveBasket?.items?.map((receiveItem) => (
        <ListItem key={receiveItem?.key} receiveItem={receiveItem} />
      ))}
    </div>
  )
}
