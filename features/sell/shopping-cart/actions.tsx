import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { SaleStateTypes } from 'lib/types/sale'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import { useSWRConfig } from 'swr'
import { deleteSale, saveCart, useParkedSales } from 'lib/api/sale'
import { Clear, Delete, DirectionsCar, DryCleaning, Folder } from '@mui/icons-material'
import DropdownMenu from 'components/dropdown-menu'
import dayjs from 'dayjs'

export default function ShoppingCartActions() {
  const { cart, setCart, loadSaleToCart, setAlert, openConfirm, closeView, resetCart, resetSearchBar } = useAppStore()
  const { parkedSales } = useParkedSales()
  const [parkedSaleItems, setParkedSaleItems] = useState([])
  const { sale = {}, items = [] } = cart || {}
  const [saveSaleLoading, setSaveSaleLoading] = useState(false)
  const { mutate } = useSWRConfig()

  function clearCart() {
    resetCart()
    closeView(ViewProps.cart)
  }

  useEffect(() => {
    setParkedSaleItems(
      parkedSales?.map((sale) => ({
        text: `[${dayjs(sale?.dateSaleOpened).format('DD/MM/YYYY h:mma')}] ${sale?.itemList}`,
        onClick: () => loadSaleToCart(sale?.id),
      })),
    )
  }, [parkedSales, loadSaleToCart])

  async function onClickSaveSale() {
    setSaveSaleLoading(true)
    await saveCart({ ...cart, sale: { ...sale, state: SaleStateTypes.Parked } })
    mutate('stock')
    mutate(`sale/parked`)
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
    const hasID = cart?.sale?.id
    const hasTransactions = cart?.transactions?.filter((transaction) => !transaction.isDeleted)?.length > 0
    hasTransactions
      ? openConfirm({
          open: true,
          title: 'Hang on',
          message:
            'Transactions have already been made for this sale. To delete the sale you will first need to open up the sale to delete the transactions.',
          yesText: 'OK',
          yesButtonOnly: true,
        })
      : openConfirm({
          open: true,
          title: 'Are you sure?',
          message: hasID
            ? 'Are you sure you want to delete this sale? '
            : 'Are you sure you want to clear the cart of all items?',
          yesText: `${hasID ? 'DELETE' : 'DISCARD'} SALE`,
          action: () => {
            deleteSale(sale?.id).then(() => {
              setAlert({
                open: true,
                type: 'warning',
                message: `SALE ${hasID ? 'DELETED' : 'DISCARDED'}`,
                undo: () => {
                  hasID && console.log('TODO - save sale again')
                  setCart(cart)
                },
              })
              mutate(`sale/parked`)
              clearCart()
            })
          },
          noText: 'CANCEL',
        })
  }

  function onClickClearCart() {
    clearCart()
  }

  return (
    <div className="flex">
      <Tooltip title={`Open Parked Sales`}>
        <span className="flex items-center">
          <DropdownMenu items={parkedSaleItems} icon={<Folder />} buttonClass="icon-button-small-white" />
        </span>
      </Tooltip>
      {sale?.state !== SaleStateTypes.Completed ? (
        <>
          <Tooltip title={sale?.state === SaleStateTypes.Layby ? 'Continue Layby' : 'Park sale'}>
            <span className="flex items-center">
              <button
                className="icon-button-small-white"
                onClick={sale?.state === SaleStateTypes.Layby ? onClickContinueLayby : onClickSaveSale}
                disabled={Boolean(saveSaleLoading || cart?.items?.length < 1)}
              >
                {saveSaleLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : sale?.state === SaleStateTypes.Layby ? (
                  <DryCleaning />
                ) : (
                  <DirectionsCar />
                )}
              </button>
            </span>
          </Tooltip>
          {sale?.state !== SaleStateTypes.Layby && (
            <Tooltip title="Discard sale">
              <span className="flex items-center">
                <button
                  className="icon-button-small-white"
                  onClick={onClickDiscardSale}
                  disabled={Boolean(items?.length < 1)}
                >
                  <Delete />
                </button>
              </span>
            </Tooltip>
          )}
        </>
      ) : (
        <Tooltip title="Clear cart">
          <span className="flex items-center">
            <button className="icon-button-small-white" onClick={onClickClearCart}>
              <Clear />
            </button>
          </span>
        </Tooltip>
      )}
    </div>
  )
}
