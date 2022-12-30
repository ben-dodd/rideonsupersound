import { useRouter } from 'next/router'
import { Info, AddCircleOutline } from '@mui/icons-material'
import React from 'react'
import { skuScan } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import { getItemDisplayName } from 'lib/functions/displayInventory'
import { useClerk } from 'lib/api/clerk'

const Actions = ({ item, itemQuantity }) => {
  const router = useRouter()
  const { sellSearchBar, addCartItem, openConfirm } = useAppStore()
  const { clerk } = useClerk()

  function clickAddToCart() {
    if (itemQuantity < 1) {
      openConfirm({
        open: true,
        title: 'Are you sure you want to add to cart?',
        styledMessage: (
          <span>
            There is no more of <b>{getItemDisplayName(item)}</b> in stock. Are you sure you want to add to cart?
          </span>
        ),
        yesText: "YES, I'M SURE",
        action: () => handleAddItemToCart(),
      })
    } else handleAddItemToCart()
  }

  function handleAddItemToCart() {
    addCartItem({ itemId: item?.id, quantity: '1' }, clerk?.id)
  }

  skuScan(sellSearchBar, item, handleAddItemToCart)

  return (
    <div className="flex py-2">
      <div className="self-center pl-8 hidden sm:inline">
        {/* <Tooltip title="View and edit item details."> */}
        <button
          className="icon-button-large text-black hover:text-blue-500"
          onClick={() => router.push(`/stock/${item?.id}`)}
        >
          <Info style={{ fontSize: '40px' }} />
        </button>
        {/* </Tooltip> */}
      </div>
      <div className="self-center pl-1 hidden sm:inline">
        {/* <Tooltip title="Add item to sale."> */}
        <button
          className="icon-button-large text-black hover:text-blue-500"
          // disabled={!item?.totalSell}
          onClick={clickAddToCart}
        >
          <AddCircleOutline style={{ fontSize: '40px' }} />
        </button>
        {/* </Tooltip> */}
      </div>
    </div>
  )
}

export default Actions
