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
import { createSale, deleteSale, deleteSaleItem } from 'lib/api/sale'
import { useClerk } from 'lib/api/clerk'
import { useCurrentRegisterId } from 'lib/api/register'
import { useRouter } from 'next/router'
import { SaleStateTypes } from 'lib/types/sale'

export default function ShoppingCart() {
  const { cart, view, setCart, setCartSale, resetCart, setAlert, closeView, openView } = useAppStore()
  const { sale = {}, items = [], transactions = [] } = cart || {}
  const { clerk } = useClerk()
  const { registerId } = useCurrentRegisterId()
  const router = useRouter()
  const [loadingSale] = useState(false)

  function deleteCartItem(cartItem) {
    let updatedCartItems = items?.filter((item) => item?.itemId !== cartItem?.itemId)
    if (cartItem?.id)
      // Cart has been saved to the database, delete sale_item
      deleteSaleItem(cartItem?.id)
    if (updatedCartItems.length < 1 && transactions?.length < 1) {
      // No items left and no transactions, delete cart
      closeView(ViewProps.cart)
      resetCart()
      if (sale?.id) deleteSale(sale?.id, { clerk, registerId })
    } else {
      setCart({
        items: updatedCartItems,
      })
    }
    setAlert({
      open: true,
      type: 'success',
      message: `ITEM REMOVED FROM CART`,
    })
  }

  console.log('refreshing cart', cart)

  const { totalPrice, totalStoreCut, totalRemaining, totalPaid } = useSaleProperties(cart)

  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        view?.cart ? 'left-0' : 'left-full'
      } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
    >
      <div className="flex flex-col h-menu px-2 bg-gray-200 text-black">
        <div className="flex justify-between relative">
          <div className="text-lg font-bold my-2 tracking-wide self-center">
            <div>Shopping Cart</div>
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
              .map((cartItem) => (
                <ListItem key={cartItem?.itemId} cartItem={cartItem} deleteCartItem={deleteCartItem} />
              ))
          ) : (
            <Tooltip title="To add items to the cart. Use the search bar and then add items with the (+) icon.">
              <div>No items in cart...</div>
            </Tooltip>
          )}
        </div>
        {transactions?.length > 0 ? (
          <div className="flex justify-end mt-2">
            <div className="self-center">TOTAL PAID</div>
            <div className={`self-center text-right ml-7 ${totalPaid < 0 ? 'text-red-500' : 'text-black'}`}>
              {totalPaid < 0 && '-'}${Math.abs(totalPaid)?.toFixed(2)}
            </div>
          </div>
        ) : (
          <div />
        )}
        <div className="pt-4">
          <div className="flex justify-between">
            <button
              className="fab-button__secondary w-1/3 mb-4"
              disabled={transactions?.length > 0 || loadingSale || totalRemaining === 0}
              onClick={() => openView(ViewProps.createHold)}
            >
              <HoldIcon className="mr-2" />
              HOLD
            </button>
            <div>
              <div className="flex justify-end mt-2">
                <div className="self-center">STORE CUT</div>
                <div className={`self-center text-right ml-7 ${totalStoreCut < 0 ? 'text-red-500' : 'text-black'}`}>
                  {totalStoreCut < 0 && '-'}${items?.length > 0 ? Math.abs(totalStoreCut)?.toFixed(2) : '0.00'}
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <div className="self-center">TOTAL</div>
                <div className="self-center text-right ml-4">${totalPrice?.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div>
            <button
              className={`w-full my-4 modal__button--${totalRemaining < 0 ? 'cancel' : 'ok'}`}
              disabled={loadingSale || totalRemaining === 0}
              onClick={() => {
                if (sale?.id) router.push('pay')
                else
                  createSale(sale, clerk).then((id) => {
                    setCartSale({ id })
                    console.log('new sale', id)
                    router.push('pay')
                  })
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
