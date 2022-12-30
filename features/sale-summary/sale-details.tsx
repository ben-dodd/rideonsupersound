import { useSaleProperties } from 'lib/hooks'

const SaleDetails = ({ cart }) => {
  const { totalRemaining, totalStoreCut, totalVendorCut, totalPrice, totalPaid, totalPostage } = useSaleProperties(cart)

  return (
    <>
      <div className="flex justify-end mt-2 pt-2 border-t border-gray-500">
        <div>VENDOR CUT</div>
        <div className={`text-right w-2/12 text-gray-600 ${totalVendorCut < 0 && 'text-red-400'}`}>
          {`$${totalVendorCut?.toFixed(2)}`}
        </div>
      </div>
      <div className="flex justify-end border-gray-500">
        <div>STORE CUT</div>
        <div className={`text-right w-2/12 text-gray-600 ${totalStoreCut < 0 && 'text-tertiary-dark'}`}>
          {`$${totalStoreCut?.toFixed(2)}`}
        </div>
      </div>
      <div className="flex justify-end border-gray-500">
        <div>POSTAGE</div>
        <div className={`text-right w-2/12 text-gray-600 ${totalPostage < 0 && 'text-tertiary-dark'}`}>
          {`$${totalPostage?.toFixed(2)}`}
        </div>
      </div>
      <div className="flex justify-end mt-1">
        <div>TOTAL</div>
        <div className="text-right w-2/12 font-bold">${totalPrice?.toFixed(2)}</div>
      </div>
      <div className="flex justify-end mt-1">
        <div>TOTAL PAID</div>
        <div className="text-right w-2/12 font-bold text-secondary-dark">${totalPaid?.toFixed(2)}</div>
      </div>
      <div className="flex justify-end mt-1">
        <div>TOTAL OWING</div>
        <div className="text-right w-2/12 font-bold text-tertiary-dark">${totalRemaining?.toFixed(2)}</div>
      </div>
    </>
  )
}

export default SaleDetails
