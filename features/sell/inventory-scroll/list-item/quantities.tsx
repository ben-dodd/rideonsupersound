// import Tooltip from '@mui/material/Tooltip'
import { priceCentsString } from 'lib/utils'

const Quantities = ({ quantities, price, itemQuantity, isInCart }) => {
  return (
    <div className="flex justify-between items-end">
      {/* <Tooltip title="Go to the STOCK screen to receive or return items."> */}
      <div className={`text-md ${itemQuantity < 1 && 'text-red-500'}`}>
        {`${itemQuantity}${isInCart ? ' left' : ''} in stock${
          quantities?.hold > 0 ? `, ${quantities?.hold} on hold` : ''
        }${quantities?.layby > 0 ? `, ${quantities?.layby} on layby` : ''}`}
      </div>
      {/* </Tooltip> */}
      {/* <Tooltip title="You can change the price in the item details screen."> */}
      <div className="text-xl">{priceCentsString(price?.totalSell)}</div>
      {/* </Tooltip> */}
    </div>
  )
}

export default Quantities
