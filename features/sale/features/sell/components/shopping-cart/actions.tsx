import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { saveLog } from 'features/log/lib/functions'
import { SaleStateTypes } from 'lib/types'
import DiscardSaleIcon from '@mui/icons-material/Close'
import SaveSaleIcon from '@mui/icons-material/Save'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { saveSaleAndPark } from 'features/pay/lib/functions'
import { useCustomers } from 'lib/api/customer'
import { useLogs } from 'lib/api/log'
import { useCurrentRegisterId } from 'lib/api/register'

export default function ShoppingCartActions() {
  const { clerk } = useClerk()
  const {
    cart,
    setCart,
    setAlert,
    openConfirm,
    openView,
    closeView,
    resetCart,
  } = useAppStore()
  // SWR
  const { customers } = useCustomers()
  const { logs, mutateLogs } = useLogs()
  // const { sales, mutateSales } = useSales()
  // const { inventory, mutateInventory } = useInventory()
  // const { giftCards, mutateGiftCards } = useGiftCards()
  const { registerID } = useCurrentRegisterId()

  // State
  const [saveSaleLoading, setSaveSaleLoading] = useState(false)

  // Functions
  function clearCart() {
    resetCart()
    closeView(ViewProps.cart)
  }

  function onClickLoadSales() {
    openView(ViewProps.loadSalesDialog)
  }

  async function onClickSaveSale() {
    setSaveSaleLoading(true)
    await saveSaleAndPark(
      cart,
      clerk,
      registerID,
      customers,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards
    )
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE PARKED',
    })
    clearCart()
    setSaveSaleLoading(false)
  }

  async function onClickContinueLayby() {
    setSaveSaleLoading(true)
    saveSaleItemsTransactionsToDatabase(
      { ...cart, state: SaleStateTypes.Layby },
      clerk,
      registerID,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards
    )
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
        saveLog(`Cart cleared.`, clerk?.id)
        setAlert({
          open: true,
          type: 'warning',
          message: 'SALE DISCARDED',
          undo: () => {
            saveLog(`Cart uncleared.`, clerk?.id)
            setCart({ ...cart })
          },
        })
        clearCart()
      },
      noText: 'CANCEL',
    })
  }
  return (
    <div>
      {/*<Tooltip title="Load parked sales and laybys">
        <button
          className={"icon-button-small-white relative"}
          onClick={onClickLoadSales}
        >
          <RetrieveSaleIcon />
        </button>
  </Tooltip>*/}
      <Tooltip
        title={
          cart?.state === SaleStateTypes.Layby ? 'Continue Layby' : 'Park sale'
        }
      >
        <button
          className="icon-button-small-white"
          onClick={
            cart?.state === SaleStateTypes.Layby
              ? onClickContinueLayby
              : onClickSaveSale
          }
          disabled={Boolean(
            saveSaleLoading || !cart || !cart?.items || cart?.items?.length < 1
          )}
        >
          {saveSaleLoading ? (
            <CircularProgress color="inherit" size={16} />
          ) : (
            <SaveSaleIcon />
          )}
        </button>
      </Tooltip>
      {!cart?.id && (
        <Tooltip title="Discard sale">
          <button
            className="icon-button-small-white"
            onClick={onClickDiscardSale}
            disabled={Boolean(!cart || !cart?.items || cart?.items?.length < 1)}
          >
            <DiscardSaleIcon />
          </button>
        </Tooltip>
      )}
    </div>
  )
}
