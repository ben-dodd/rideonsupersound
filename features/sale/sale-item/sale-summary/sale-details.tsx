import { priceDollarsString } from 'lib/utils'

const SaleDetails = ({ saleObject }) => {
  console.log(saleObject.props)
  const { totalRemaining, totalStoreCut, totalVendorCut, totalPrice, totalPaid, totalPostage } = saleObject?.props || {}

  return (
    <>
      <div className="flex justify-end mt-2 pt-2 border-t border-gray-500">
        <div>VENDOR CUT</div>
        <div className={`text-right w-2/12 text-gray-600 ${totalVendorCut < 0 && 'text-red-400'}`}>
          {priceDollarsString(totalVendorCut)}
        </div>
      </div>
      <div className="flex justify-end border-gray-500">
        <div>STORE CUT</div>
        <div className={`text-right w-2/12 text-gray-600 ${totalStoreCut < 0 && 'text-tertiary-dark'}`}>
          {priceDollarsString(totalStoreCut)}
        </div>
      </div>
      <div className="flex justify-end border-gray-500">
        <div>POSTAGE</div>
        <div className={`text-right w-2/12 text-gray-600 ${totalPostage < 0 && 'text-tertiary-dark'}`}>
          {priceDollarsString(totalPostage)}
        </div>
      </div>
      <div className="flex justify-end mt-1">
        <div>TOTAL</div>
        <div className="text-right w-2/12 font-bold">{priceDollarsString(totalPrice)}</div>
      </div>
      <div className="flex justify-end mt-1">
        <div>TOTAL PAID</div>
        <div className="text-right w-2/12 font-bold text-secondary-dark">{priceDollarsString(totalPaid)}</div>
      </div>
      <div className="flex justify-end mt-1">
        <div>TOTAL OWING</div>
        <div className="text-right w-2/12 font-bold text-tertiary-dark">{priceDollarsString(totalRemaining)}</div>
      </div>
    </>
  )
}

export default SaleDetails
