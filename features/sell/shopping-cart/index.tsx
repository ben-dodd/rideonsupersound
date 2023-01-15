import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Actions from './actions'
import ListItem from './list-item'
import HoldIcon from '@mui/icons-material/PanTool'
import PayIcon from '@mui/icons-material/ShoppingCart'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useSaleProperties } from 'lib/hooks'
import { createSale } from 'lib/api/sale'
import { useClerk } from 'lib/api/clerk'
import { useRouter } from 'next/router'
import { SaleStateTypes } from 'lib/types/sale'

export default function ShoppingCart() {
  const { cart, view, setCartSale, openView } = useAppStore()
  const { sale = {}, items = [], transactions = [] } = cart || {}
  const { clerk } = useClerk()
  const router = useRouter()
  const [loadingSale, setLoadingSale] = useState(false)

  const { totalPrice, totalStoreCut, totalRemaining, totalPaid } = useSaleProperties(cart)

  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        view?.cart ? 'left-0' : 'left-full'
      } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-main`}
    >
      <div className="flex flex-col h-main px-2 bg-gray-200 text-black">
        <div className="flex justify-between relative">
          <div className="text-xl font-bold my-2 tracking-wide self-center">
            <div>SHOPPING CART</div>
            {sale?.id && (
              <div className="text-sm font-light">
                <div>{`Sale #${sale?.id} // ${(sale?.state || SaleStateTypes.InProgress)?.toUpperCase()}`}</div>
              </div>
            )}
          </div>
          <Actions />
        </div>
        <div className="flex-grow overflow-x-hidden overflow-y-scroll">
          {items?.length > 0 ? (
            items
              // .filter((cartItem: SaleItemObject) => !cartItem?.isDeleted)
              .map((cartItem) => <ListItem key={cartItem?.itemId} cartItem={cartItem} />)
          ) : (
            <Tooltip title="To add items to the cart. Use the search bar and then add items with the (+) icon.">
              <div>No items in cart...</div>
            </Tooltip>
          )}
        </div>
        <div className="pt-4">
          <div className="flex justify-between items-end">
            <button
              className="fab-button__secondary w-1/3"
              disabled={transactions?.length > 0 || loadingSale || totalRemaining === 0}
              onClick={() => openView(ViewProps.createHold)}
            >
              <HoldIcon className="mr-2" />
              HOLD
            </button>
            <div>
              {sale?.isMailOrder && (
                <div className="flex justify-between mt-1">
                  <div className="self-center">POSTAGE</div>
                  <div className={`self-center text-right ml-4 text-black`}>
                    ${sale?.postage ? Number(sale?.postage)?.toFixed(2) : '0.00'}
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-1">
                <div className="self-center">STORE CUT</div>
                <div className={`self-center text-right ml-4 ${totalStoreCut < 0 ? 'text-red-500' : 'text-black'}`}>
                  {totalStoreCut < 0 && '-'}${items?.length > 0 ? Math.abs(totalStoreCut)?.toFixed(2) : '0.00'}
                </div>
              </div>
              <div className="flex justify-between mt-1 font-bold">
                <div className="self-center">TOTAL</div>
                <div className="self-center text-right ml-4">${totalPrice?.toFixed(2)}</div>
              </div>
              {transactions?.length > 0 && (
                <div className="flex justify-between mt-1">
                  <div className="self-center">TOTAL PAID</div>
                  <div className={`self-center text-right ml-4 ${totalPaid < 0 ? 'text-red-500' : 'text-black'}`}>
                    {totalPaid < 0 && '-'}${Math.abs(totalPaid)?.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              className={`w-full my-4 modal__button--${totalRemaining < 0 ? 'alt1' : 'ok'}`}
              disabled={loadingSale || totalRemaining === 0}
              onClick={() => {
                if (sale?.id) router.push('sell/pay')
                else {
                  setLoadingSale(true)
                  createSale(sale, clerk).then((id) => {
                    setCartSale({ id })
                    setLoadingSale(false)
                    router.push('sell/pay')
                  })
                }
              }}
            >
              {loadingSale ? (
                <span className="pr-4">
                  <CircularProgress color="inherit" size={18} />
                </span>
              ) : (
                <PayIcon className="mr-2" />
              )}
              {totalRemaining < 0
                ? `REFUND $${Math.abs(totalRemaining)?.toFixed(2)}`
                : `PAY $${totalRemaining?.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// TODO include postage price if it is there
