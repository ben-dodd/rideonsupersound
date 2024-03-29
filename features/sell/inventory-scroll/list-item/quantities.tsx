// import Tooltip from '@mui/material/Tooltip'
import { priceCentsString } from 'lib/utils'

const Quantities = ({ item, itemQuantity, isInCart }) => {
  return (
    <div className="flex justify-between items-end">
      {/* <Tooltip title="Go to the STOCK screen to receive or return items."> */}
      <div className={`text-md ${itemQuantity < 1 && 'text-red-500'}`}>
        {`${itemQuantity ? `${itemQuantity}${isInCart ? ' left' : ''} in stock` : isInCart ? 'No more in stock' : 'Out of stock'}${
          item?.quantityHold > 0 ? `, ${item?.quantityHold} on hold` : ''
        }${item?.quantityLayby > 0 ? `, ${item?.quantityLayby} on layby` : ''}`}
      </div>
      {/* </Tooltip> */}
      {/* <Tooltip title="You can change the price in the item details screen."> */}
      <div className="text-xl">{priceCentsString(item?.totalSell)}</div>
      {/* </Tooltip> */}
    </div>
  )
}

export default Quantities
