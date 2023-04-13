import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Actions from './actions'
import ListItem from './list-item'
import HoldIcon from '@mui/icons-material/PanTool'
import PayIcon from '@mui/icons-material/ShoppingCart'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useSaleProperties } from 'lib/hooks/sale'
import { saveCart } from 'lib/api/sale'
import { useClerk } from 'lib/api/clerk'
import { useRouter } from 'next/router'
import { SaleStateTypes } from 'lib/types/sale'
import { ArrowCircleLeftRounded } from '@mui/icons-material'
import { priceDollarsString } from 'lib/utils'

export default function ShoppingCart() {
  const { cart, view, setCart, openView, closeView } = useAppStore()
  const { sale = {}, items = [], transactions = [] } = cart || {}
  const { clerk } = useClerk()
  const router = useRouter()
  const [loadingSale, setLoadingSale] = useState(false)

  const { totalPrice, totalStoreCut, totalRemaining, totalPaid } = useSaleProperties(cart, true)
  const handleBackClick = () => closeView(ViewProps.cart)
  console.log(cart)
  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        view?.cart ? 'left-0' : 'left-full'
      } md:left-2/3 h-full w-full md:w-1/3 md:h-main`}
    >
      <div className="flex flex-col h-main px-2 bg-brown-dark text-white">
        <div className="flex justify-between relative">
          <div className="text-xl font-bold my-2 tracking-wide self-center">
            <div className="flex items-center">
              <button className="hover:text-brown-light px-2 md:hidden" onClick={handleBackClick}>
                <ArrowCircleLeftRounded />
              </button>
              SHOPPING CART
            </div>
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
              .filter((cartItem) => !cartItem?.isDeleted && !cartItem?.isRefunded)
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
              disabled={transactions?.length > 0 || loadingSale || !totalRemaining}
              onClick={() => openView(ViewProps.createHold)}
            >
              <HoldIcon className="mr-2" />
              HOLD
            </button>
            <div>
              {sale?.isMailOrder && sale?.postage > 0 ? (
                <div className="flex justify-between mt-1">
                  <div className="self-center">POSTAGE</div>
                  <div className={`self-center text-right ml-4 text-white`}>{priceDollarsString(sale?.postage)}</div>
                </div>
              ) : (
                <div />
              )}
              <div className="flex justify-between mt-1">
                <div className="self-center">STORE CUT</div>
                <div className={`self-center text-right ml-4 ${totalStoreCut < 0 ? 'text-red-500' : 'text-white'}`}>
                  {totalStoreCut < 0 && '-'}${Math.abs(totalStoreCut || 0)?.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between mt-1 font-bold">
                <div className="self-center">TOTAL</div>
                <div className="self-center text-right ml-4">${(totalPrice || 0)?.toFixed(2)}</div>
              </div>
              {transactions?.length > 0 && (
                <div className="flex justify-between mt-1">
                  <div className="self-center">TOTAL PAID</div>
                  <div className={`self-center text-right ml-4 ${totalPaid < 0 ? 'text-red-500' : 'text-white'}`}>
                    {totalPaid < 0 && '-'}${Math.abs(totalPaid)?.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              className={`w-full my-4 modal__button--${totalRemaining < 0 ? 'alt1' : 'ok'}`}
              disabled={loadingSale || !totalRemaining}
              onClick={() => {
                if (sale?.id) router.push('sell/pay')
                else {
                  setLoadingSale(true)
                  console.log('saving cart')
                  saveCart(
                    { ...cart, sale: { ...sale, state: SaleStateTypes.InProgress, saleOpenedBy: clerk?.id } },
                    SaleStateTypes.InProgress,
                  ).then((newCart) => {
                    setCart(newCart)
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
                : `PAY${totalRemaining ? ` $${totalRemaining?.toFixed(2)}` : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
