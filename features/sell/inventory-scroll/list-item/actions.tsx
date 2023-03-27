import { useRouter } from 'next/router'
import { Info, AddCircleOutline } from '@mui/icons-material'
import React from 'react'
import { skuScan } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useClerk } from 'lib/api/clerk'
import { Pages } from 'lib/store/types'

const Actions = ({ item, itemQuantity, holdsQuantity, isItemLoading }) => {
  const router = useRouter()
  const {
    sellPage: { searchBar },
    cart,
    resetSearchBar,
    addCartItem,
    openConfirm,
    closeConfirm,
  } = useAppStore()
  const { clerk } = useClerk()
  function clickAddToCart() {
    if (itemQuantity < 1) {
      openConfirm({
        open: true,
        title: 'Are you sure you want to add to cart?',
        styledMessage: (
          <span>
            There is no more of <b>{getItemSkuDisplayName(item)}</b> in stock. Are you sure you want to add to cart?
          </span>
        ),
        yesText: "YES, I'M SURE",
        action: () => handleAddItemToCart(),
      })
    } else handleAddItemToCart()
  }

  const addItemToCart = () => addCartItem({ itemId: item?.id, quantity: '1' }, clerk?.id)

  const checkHolds = (
    <>
      <div>Item is on hold for X people.</div>
      <div className="flex flex-col">
        <button className="bg-red-500" onClick={closeConfirm}>
          Cancel
        </button>
        <button
          className="bg-green-500"
          onClick={() => {
            closeConfirm()
            addItemToCart()
          }}
        >
          Add It Anyway
        </button>
      </div>
    </>
  )

  const itemIsNotInCart = cart?.items?.findIndex((cartItem) => cartItem?.itemId === item?.id) < 0

  const handleAddItemToCart = () =>
    holdsQuantity > 0 && itemIsNotInCart
      ? openConfirm({ open: true, title: 'Check Holds', styledMessage: checkHolds, buttons: [] })
      : addItemToCart()

  function handleInputSku() {
    resetSearchBar(Pages.sellPage)
    clickAddToCart()
  }

  skuScan(searchBar, item, handleInputSku)

  return (
    <div className="flex py-2">
      <div className="self-center pl-8 hidden sm:inline">
        <span>
          {/* <Tooltip title="View and edit item details."> */}
          <button
            // className="icon-button-large text-brown-dark hover:text-brown"
            className={`pill-button`}
            onClick={() => router.push(`/stock/${item?.id}`)}
          >
            <Info style={{ fontSize: '40px' }} />
          </button>
        </span>
        {/* </Tooltip> */}
      </div>
      <div className="self-center pl-1 hidden sm:inline">
        {/* <Tooltip title="Add item to sale."> */}
        <button
          disabled={isItemLoading}
          className={`pill-button`}
          // className={`icon-button-large text-brown-dark ${isItemLoading ? 'text-gray-400' : 'hover:text-brown'}`}
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
