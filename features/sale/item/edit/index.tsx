import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import SaleSummary from '../sale-summary'
import CreateHoldSidebar from 'features/sell/create-hold/sidebar'
import CreateLaybySidebar from './create-layby/sidebar'
import CreateCustomerSidebar from 'features/sell/create-customer/sidebar'
import { saveCart } from 'lib/api/sale'
import MidScreenContainer from 'components/container/mid-screen'
import { Delete, DirectionsCar, DryCleaning } from '@mui/icons-material'
import { SaleStateTypes } from 'lib/types/sale'
import { ViewProps } from 'lib/store/types'
import { useSWRConfig } from 'swr'
import CreateMailOrder from './create-mail-order/sidebar'
import Pay from './pay'
import { useEffect } from 'react'

const SaleEditItemScreen = ({ totalRemaining, isLoading }) => {
  const { cart, resetCart, setCart, openView, closeView, setAlert, openConfirm } = useAppStore()
  const { sale = {}, transactions = [] } = cart || {}
  const router = useRouter()
  const { mutate } = useSWRConfig()

  useEffect(() => {
    const handleRouteChange = () => {
      console.log('resetting cart')
      resetCart()
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  function clearCart() {
    resetCart()
    closeView(ViewProps.cart)
  }

  async function clickParkSale() {
    const newCart = await saveCart(
      {
        ...cart,
        sale: { ...sale, state: SaleStateTypes.Parked },
      },
      sale?.state,
    )
    mutate(`/sale/${sale?.id}`, newCart)
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE PARKED',
    })
    router.push('/sell')
  }

  async function clickContinueLayby() {
    if (sale?.customerId) {
      if (sale?.state !== SaleStateTypes.Layby) {
        saveCart({ ...cart, sale: { ...sale, state: SaleStateTypes.Layby } })
      }
      setAlert({ open: true, type: 'success', message: 'LAYBY CONTINUED' })
      router.push('/sell')
    } else {
      openView(ViewProps.createLayby)
    }
  }

  async function clickAbortSale() {
    transactions?.filter((transaction) => !transaction?.isDeleted)?.length > 0
      ? openConfirm({
          open: true,
          title: 'Hold up',
          message:
            'To cancel this sale you need to delete the transactions already entered. Click on the rubbish bin icon on the left of each transaction to cancel it.',
          yesButtonOnly: true,
        })
      : openConfirm({
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

  const inProgressMenuItems = [
    { text: 'Park Sale', icon: <DirectionsCar />, onClick: clickParkSale },
    { text: 'Start Layby', icon: <DryCleaning />, onClick: () => openView(ViewProps.createLayby) },
    { text: 'Delete Sale', icon: <Delete />, onClick: clickAbortSale },
  ]

  const parkedMenuItems = [
    { text: 'Park Sale Again', icon: <DirectionsCar />, onClick: clickParkSale },
    { text: 'Start Layby', icon: <DryCleaning />, onClick: () => openView(ViewProps.createLayby) },
    { text: 'Delete Sale', icon: <Delete />, onClick: clickAbortSale },
  ]

  const laybyMenuItems = [
    { text: 'Continue Layby', icon: <DryCleaning />, onClick: clickContinueLayby },
    { text: 'Delete Layby', icon: <Delete />, onClick: clickAbortSale },
  ]

  const menuItems =
    sale?.state === SaleStateTypes.Parked
      ? parkedMenuItems
      : sale?.state === SaleStateTypes.Layby
      ? laybyMenuItems
      : inProgressMenuItems

  return (
    <MidScreenContainer
      title={`PAY - ${sale?.id ? `SALE #${sale?.id}` : `NEW SALE`} [${
        sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
      }]`}
      titleClass="bg-brown-dark text-white"
      menuItems={menuItems}
      showBackButton
      full
      dark
      isLoading={isLoading}
    >
      <div className="flex h-content">
        <div className="w-2/3">
          <SaleSummary cart={cart} />
        </div>
        <div className="w-1/3 h-content p-2 flex flex-col justify-between shadow-md">
          <Pay totalRemaining={totalRemaining} />
        </div>
      </div>
      <CreateHoldSidebar />
      <CreateLaybySidebar />
      <CreateMailOrder />
      <CreateCustomerSidebar />
    </MidScreenContainer>
  )
}

export default SaleEditItemScreen

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

// BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
// BUG fix bug where bottom of dialog is visible
// BUG dates are wrong on vercel
// BUG why are some sales showing items as separate line items, not 2x quantity
// TODO refunding items, then adding the same item again
