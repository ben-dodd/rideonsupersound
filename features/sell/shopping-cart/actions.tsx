import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { SaleStateTypes } from 'lib/types/sale'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import { useSWRConfig } from 'swr'
import { saveCart, useParkedSales } from 'lib/api/sale'
import { Delete, Folder, Save } from '@mui/icons-material'
import DropdownMenu from 'components/dropdown-menu'
import dayjs from 'dayjs'

// TODO fix action icons alignment
export default function ShoppingCartActions() {
  const { cart, setCart, loadSaleToCart, setAlert, openConfirm, closeView, resetCart, resetSearchBar } = useAppStore()
  const { parkedSales } = useParkedSales()
  const { sale = {}, items = [] } = cart || {}
  const [saveSaleLoading, setSaveSaleLoading] = useState(false)
  const { mutate } = useSWRConfig()

  function clearCart() {
    resetCart()
    closeView(ViewProps.cart)
  }

  const parkedSaleItems = parkedSales?.map((sale) => ({
    text: `[${dayjs(sale?.dateSaleOpened).format('DD/MM/YYYY h:mma')}] ${sale?.itemList}`,
    onClick: () => loadSaleToCart(sale),
  }))

  async function onClickSaveSale() {
    setSaveSaleLoading(true)
    await saveCart({ ...cart, sale: { ...sale, state: SaleStateTypes.Parked } }, sale?.state)
    mutate('stock')
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE PARKED',
    })
    resetSearchBar(Pages.sellPage)
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
    <div className="flex">
      <Tooltip title={`Open Parked Sales`}>
        <DropdownMenu items={parkedSaleItems} icon={<Folder />} buttonClass="icon-button-small-white" />
      </Tooltip>
      <Tooltip title={sale?.state === SaleStateTypes.Layby ? 'Continue Layby' : 'Park sale'}>
        <button
          className="icon-button-small-white"
          onClick={sale?.state === SaleStateTypes.Layby ? onClickContinueLayby : onClickSaveSale}
          disabled={Boolean(saveSaleLoading || cart?.items?.length < 1)}
        >
          {saveSaleLoading ? <CircularProgress color="inherit" size={16} /> : <Save />}
        </button>
      </Tooltip>
      {cart?.transactions?.filter((transaction) => !transaction.isDeleted)?.length === 0 && (
        <Tooltip title="Discard sale">
          <button
            className="icon-button-small-white"
            onClick={onClickDiscardSale}
            disabled={Boolean(items?.length < 1)}
          >
            <Delete />
          </button>
        </Tooltip>
      )}
    </div>
  )
}
