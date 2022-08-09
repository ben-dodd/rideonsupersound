// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import {
  alertAtom,
  cartAtom,
  clerkAtom,
  confirmModalAtom,
  viewAtom,
} from '@lib/atoms'
import {
  useCustomers,
  useGiftCards,
  useInventory,
  useLogs,
  useRegisterID,
  useSales,
} from '@lib/database/read'

// Functions
import {
  saveLog,
  saveSaleAndPark,
  saveSaleItemsTransactionsToDatabase,
} from '@lib/db-functions'

// Components
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'

// Icons
import { SaleStateTypes } from '@lib/types'
import DiscardSaleIcon from '@mui/icons-material/Close'
import SaveSaleIcon from '@mui/icons-material/Save'

export default function ShoppingCartActions() {
  // SWR
  const { customers } = useCustomers()
  const { logs, mutateLogs } = useLogs()
  const { sales, mutateSales } = useSales()
  const { inventory, mutateInventory } = useInventory()
  const { giftCards, mutateGiftCards } = useGiftCards()
  const { registerID } = useRegisterID()

  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [, setAlert] = useAtom(alertAtom)
  const [, setConfirmModal] = useAtom(confirmModalAtom)
  const [view, setView] = useAtom(viewAtom)

  // State
  const [saveSaleLoading, setSaveSaleLoading] = useState(false)

  // Functions
  function clearCart() {
    setCart({ id: null, items: [] })
    setView({ ...view, cart: false })
  }

  function onClickLoadSales() {
    setView({ ...view, loadSalesDialog: true })
  }

  async function onClickSaveSale() {
    setSaveSaleLoading(true)
    await saveSaleAndPark(
      cart,
      clerk,
      registerID,
      customers,
      logs,
      mutateLogs,
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
    await saveSaleItemsTransactionsToDatabase(
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
    setConfirmModal({
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
