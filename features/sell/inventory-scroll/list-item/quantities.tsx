// import Tooltip from '@mui/material/Tooltip'
import React from 'react'

const Quantities = ({ quantities, price, itemQuantity }) => {
  return (
    <div className="flex justify-between items-end">
      {/* <Tooltip title="Go to the INVENTORY screen to receive or return items."> */}
      <div className={`text-md ${itemQuantity < 1 && 'text-red-500'}`}>{`${itemQuantity} in stock${
        quantities?.hold > 0 ? `, ${quantities?.hold} on hold` : ''
      }${quantities?.layby > 0 ? `, ${quantities?.layby} on layby` : ''}`}</div>
      {/* </Tooltip> */}
      {/* <Tooltip title="You can change the price in the item details screen."> */}
      <div className="text-xl">
        {price?.totalSell === undefined || price?.totalSell === null
          ? 'N/A'
          : `$${(price?.totalSell / 100)?.toFixed(2)}`}
      </div>
      {/* </Tooltip> */}
    </div>
  )
}

export default Quantities
