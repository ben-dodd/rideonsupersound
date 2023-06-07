// DB
import { getItemDisplayName } from 'lib/functions/displayInventory'
import dayjs from 'dayjs'
import { VendorSaleItemObject } from 'lib/types/vendor'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { getDiscountedPrice } from 'lib/functions/sell'
import { dateSimple } from 'lib/types/date'

export default function VendorSales({ sales }) {
  const router = useRouter()

  return (
    <div>
      <div className="flex bg-brown text-white text-xs items-center">
        <div className="w-1/12 pl-2">ID</div>
        <div className="w-1/6">DATE</div>
        <div className="w-1/3">ITEMS</div>
        <div className="w-1/6">FORMAT</div>
        <div className="w-1/6">TOTAL RETAIL</div>
        <div className="w-1/12">VENDOR CUT</div>
      </div>
      {sales
        ?.sort((saleA: VendorSaleItemObject, saleB: VendorSaleItemObject) => {
          const a = dayjs(saleA?.dateSaleClosed)
          const b = dayjs(saleB?.dateSaleClosed)
          return a < b ? 1 : b < a ? -1 : 0
        })
        ?.map((sale: VendorSaleItemObject) => {
          return (
            <div className="border-b py-1 flex hover:bg-gray-100 text-sm" key={`${sale?.id}${sale?.itemId}`}>
              <div className="w-1/12 link-blue pl-2" onClick={() => router.push(`/sales/${sale?.saleId}`)}>
                #{sale?.saleId}
              </div>
              <div className="font-bold w-1/6">{dayjs(sale?.dateSaleClosed).format(dateSimple)}</div>
              <div className="w-1/3 link-blue" onClick={() => router.push(`/stock/${sale?.itemId}`)}>{`${
                sale?.quantity
              } x ${getItemDisplayName(sale)}${sale?.isRefunded ? ' [REFUNDED]' : ''}`}</div>
              <div className="w-1/6">{sale?.format}</div>
              <div className={`w-1/6${sale?.isRefunded ? ' line-through' : ''}`}>
                {priceCentsString(sale?.itemTotalSell)}
              </div>
              <div className={`w-1/12${sale?.isRefunded ? ' line-through' : ''}`}>
                {`${priceCentsString(sale?.itemVendorCut)}${
                  sale?.vendorDiscount
                    ? ` (${priceCentsString(
                        getDiscountedPrice(sale?.itemVendorCut, sale?.vendorDiscount, sale?.quantity),
                      )} w/${sale?.vendorDiscount}% OFF)`
                    : ''
                }`}
              </div>
            </div>
          )
        })}
    </div>
  )
}
