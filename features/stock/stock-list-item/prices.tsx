// import Tooltip from '@mui/material/Tooltip'
import { getProfitMargin } from 'lib/functions/pay'
import { priceCentsString } from 'lib/utils'

const Prices = ({ price }) => {
  return price?.totalSell && price?.vendorCut ? (
    <div className="flex flex-col justify-between items-end">
      <div className="text-xl">{priceCentsString(price?.totalSell)}</div>
      <div className="text-sm text-gray-500">{`${priceCentsString(
        price?.storeCut || price?.totalSell - price?.vendorCut || 0,
      )}/${priceCentsString(price?.vendorCut)}${
        getProfitMargin(price) ? ` (${getProfitMargin(price)?.toFixed(1)}%)` : ''
      }`}</div>
    </div>
  ) : (
    <div />
  )
}

export default Prices
