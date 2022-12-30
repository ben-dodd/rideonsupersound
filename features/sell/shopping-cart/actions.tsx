import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { SaleStateTypes } from 'lib/types/sale'
import DiscardSaleIcon from '@mui/icons-material/Close'
import SaveSaleIcon from '@mui/icons-material/Save'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useSWRConfig } from 'swr'
import { saveCart } from 'lib/api/sale'

// TODO fix action icons alignment
export default function ShoppingCartActions() {
  const { cart, setCart, setAlert, openConfirm, openView, closeView, resetCart, resetSellSearchBar } = useAppStore()
  const { sale = {}, items = [] } = cart || {}
  const [saveSaleLoading, setSaveSaleLoading] = useState(false)
  const { mutate } = useSWRConfig()

  function clearCart() {
    resetCart()
    closeView(ViewProps.cart)
  }

  async function onClickSaveSale() {
    setSaveSaleLoading(true)
    await saveCart({ ...cart, sale: { ...sale, state: SaleStateTypes.Parked } }, sale?.state)
    mutate('stock')
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE PARKED',
    })
    resetSellSearchBar()
    clearCart()
    setSaveSaleLoading(false)
  }

  async function onClickContinueLayby() {
    setSaveSaleLoading(true)
    saveCart({ ...cart, sale: { ...sale, state: SaleStateTypes.Layby } }, sale?.state)
    setAlert({
      open: true,
      type: 'success',
      message: 'LAYBY CONTINUED',
    })
    clearCart()
    setSaveSaleLoading(false)
  }

  async function onClickDiscardSale() {
    openConfirm({
      open: true,
      title: 'Are you sure?',
      message: 'Are you sure you want to clear the cart of all items?',
      yesText: 'DISCARD SALE',
      action: () => {
        // saveLog(`Cart cleared.`, clerk?.id)
        setAlert({
          open: true,
          type: 'warning',
          message: 'SALE DISCARDED',
          undo: () => {
            // saveLog(`Cart uncleared.`, clerk?.id)
            setCart(cart)
          },
        })
        clearCart()
      },
      noText: 'CANCEL',
    })
  }
  return (
    <div>
      <Tooltip title={sale?.state === SaleStateTypes.Layby ? 'Continue Layby' : 'Park sale'}>
        <button
          className="icon-button-small-white"
          onClick={sale?.state === SaleStateTypes.Layby ? onClickContinueLayby : onClickSaveSale}
          disabled={Boolean(saveSaleLoading || cart?.items?.length < 1)}
        >
          {saveSaleLoading ? <CircularProgress color="inherit" size={16} /> : <SaveSaleIcon />}
        </button>
      </Tooltip>
      {!sale?.id && (
        <Tooltip title="Discard sale">
          <button
            className="icon-button-small-white"
            onClick={onClickDiscardSale}
            disabled={Boolean(items?.length < 1)}
          >
            <DiscardSaleIcon />
          </button>
        </Tooltip>
      )}
    </div>
  )
}
