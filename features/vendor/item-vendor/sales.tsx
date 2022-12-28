// DB
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { getCartItemPrice } from 'lib/functions/sell'
import { StockObject, VendorSaleItemObject } from 'lib/types'

// Components
import dayjs from 'dayjs'
import { CSVLink } from 'react-csv'
import { useRouter } from 'next/router'
import { useVendor } from 'lib/api/vendor'

export default function VendorSales() {
  const router = useRouter()
  const id = router.query
  const { vendor } = useVendor(id)

  return (
    <div>
      {vendor?.sales?.length > 0 && (
        <div className="mt-4">
          <CSVLink
            className={`bg-white hover:bg-gray-100 disabled:bg-gray-200 p-2 rounded border`}
            filename={`${vendor?.name}-sales-${dayjs().format(
              'YYYY-MM-DD'
            )}.csv`}
            data={vendor?.sales?.map((s) => {
              const prices = getCartItemPrice(s, null)
              return { ...s, ...prices }
            })}
          >
            DOWNLOAD DATA
          </CSVLink>
          <div className="border-b mb-2 flex text-sm mt-4">
            <div className="w-1/12">ID</div>
            <div className="w-1/6">DATE SOLD</div>
            <div className="w-1/3">ITEM SOLD</div>
            <div className="w-1/6">FORMAT</div>
            <div className="w-1/6">TOTAL SELL</div>
            <div className="w-1/12">VENDOR TAKE</div>
          </div>

          <div className="border-b py-1 flex text-sm font-bold">
            <div className="w-3/12" />
            <div className="w-1/2">{`${vendor?.sales?.length} ITEM${
              vendor?.sales?.length === 1 ? '' : 'S'
            } SOLD`}</div>
            <div className="w-1/6">
              {`$${((vendor?.totalStoreCut + vendor?.totalSell) / 100)?.toFixed(
                2
              )}`}
            </div>
            <div className="w-1/12">
              {`$${(vendor?.totalSell / 100)?.toFixed(2)}`}
            </div>
          </div>
          {vendor?.sales
            ?.sort(
              (saleA: VendorSaleItemObject, saleB: VendorSaleItemObject) => {
                const a = dayjs(saleA?.dateSaleClosed)
                const b = dayjs(saleB?.dateSaleClosed)
                return a < b ? 1 : b < a ? -1 : 0
              }
            )
            // ?.slice(0, 5)
            ?.map((sale: VendorSaleItemObject) => {
              const { totalPrice, vendorPrice } = getCartItemPrice(sale, null)
              return (
                <div
                  className="border-b py-1 flex hover:bg-gray-100 text-sm"
                  key={`${sale?.saleId}${sale?.itemId}`}
                >
                  <div className="w-1/12">#{sale?.id}</div>
                  <div className="font-bold w-1/6">
                    {dayjs(sale?.dateSaleClosed).format('D MMMM YYYY')}
                  </div>
                  <div className="w-1/3">{`${
                    sale?.quantity
                  } x ${getItemDisplayName(sale)}${
                    sale?.isRefunded ? ' [REFUNDED]' : ''
                  }`}</div>
                  <div className="w-1/6">{sale?.format}</div>
                  <div
                    className={`w-1/6${
                      sale?.isRefunded ? ' line-through' : ''
                    }`}
                  >
                    {`$${(totalPrice / 100)?.toFixed(2)}`}
                  </div>
                  <div
                    className={`w-1/12${
                      sale?.isRefunded ? ' line-through' : ''
                    }`}
                  >
                    {`$${(vendorPrice / 100)?.toFixed(2)}${
                      sale?.vendorDiscount
                        ? ` (${sale?.vendorDiscount}% DISCOUNT)`
                        : ''
                    }`}
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
