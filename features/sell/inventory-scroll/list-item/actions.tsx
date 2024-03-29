import { useRouter } from 'next/router'
import { ArrowRight } from '@mui/icons-material'
import { skuScan } from 'lib/functions/sell'
import { useAppStore } from 'lib/store'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useClerk } from 'lib/api/clerk'
import { Pages, ViewProps } from 'lib/store/types'

const Actions = ({ item, itemQuantity }) => {
  const router = useRouter()
  const {
    sellPage: { searchBar },
    cart,
    resetSearchBar,
    addCartItem,
    openConfirm,
    setPage,
    openView,
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

  const handleCheckHolds = () => {
    setPage(Pages.sellPage, { activeItemId: item?.id })
    openView(ViewProps.checkHoldsDialog)
  }

  const addItemToCart = () => addCartItem({ itemId: item?.id, quantity: '1' }, clerk?.id)

  const itemIsNotInCart = cart?.items?.findIndex((cartItem) => cartItem?.itemId === item?.id) < 0

  const handleAddItemToCart = () => (item?.quantityHold > 0 && itemIsNotInCart ? handleCheckHolds() : addItemToCart())

  function handleInputSku() {
    resetSearchBar(Pages.sellPage)
    clickAddToCart()
  }

  skuScan(searchBar, item, handleInputSku)

  return (
    <div className="flex py-2">
      <div className="self-center pl-1 hidden sm:inline">
        {/* <Tooltip title="Add item to sale."> */}
        <button
          // disabled={isItemLoading}
          className={`white-button`}
          // className={`icon-button-large text-brown-dark ${isItemLoading ? 'text-gray-400' : 'hover:text-brown'}`}
          // disabled={!item?.totalSell}
          onClick={clickAddToCart}
        >
          <ArrowRight style={{ fontSize: '40px' }} />
        </button>
        {/* </Tooltip> */}
      </div>
    </div>
  )
}

export default Actions
