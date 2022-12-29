import Tooltip from '@mui/material/Tooltip'
import {
  getHoldQuantity,
  getLaybyQuantity,
} from 'lib/functions/displayInventory'
import React from 'react'

const Quantities = ({ item, itemQuantity }) => {
  return (
    <div className="flex justify-between items-end">
      <Tooltip title="Go to the INVENTORY screen to receive or return items.">
        <div
          className={`text-md ${itemQuantity < 1 && 'text-red-500'}`}
        >{`${itemQuantity} in stock${
          getHoldQuantity(item) > 0 ? `, ${getHoldQuantity(item)} on hold` : ''
        }${
          getLaybyQuantity(item) > 0
            ? `, ${getLaybyQuantity(item)} on layby`
            : ''
        }`}</div>
      </Tooltip>
      <Tooltip title="You can change the price in the item details screen.">
        <div className="text-xl">{`$${((item?.totalSell || 0) / 100)?.toFixed(
          2
        )}`}</div>
      </Tooltip>
    </div>
  )
}

export default Quantities
