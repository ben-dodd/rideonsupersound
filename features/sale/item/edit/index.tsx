import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import SaleSummary from '../sale-summary'
import CreateHoldSidebar from 'features/sell/create-hold/sidebar'
import CreateLaybySidebar from './create-layby/sidebar'
import CreateCustomerSidebar from 'features/sell/create-customer/sidebar'
import { deleteSale, saveCart } from 'lib/api/sale'
import MidScreenContainer from 'components/container/mid-screen'
import { CheckCircleOutline, Delete, DirectionsCar, DryCleaning, EventBusy, Mail, PostAdd } from '@mui/icons-material'
import { SaleStateTypes } from 'lib/types/sale'
import { ViewProps } from 'lib/store/types'
import { useSWRConfig } from 'swr'
import CreateMailOrder from './create-mail-order/sidebar'
import Pay from './pay'
import dayjs from 'dayjs'
import { useClerk } from 'lib/api/clerk'

const SaleEditItemScreen = ({ totalRemaining, isLoading }) => {
  const { cart, resetCart, openView, closeView, setAlert, openConfirm } = useAppStore()
  const { clerk } = useClerk()
  const { sale = {}, transactions = [] } = cart || {}
  const router = useRouter()
  const { mutate } = useSWRConfig()

  function clearCart() {
    resetCart()
    closeView(ViewProps.cart)
  }

  async function clickParkSale() {
    const newCart = await saveCart({
      ...cart,
      sale: { ...sale, state: SaleStateTypes.Parked },
    })
    router.push('/sell')
    mutate(`/sale/${sale?.id}`, newCart)
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE PARKED',
    })
    clearCart()
  }

  async function clickLayby() {
    if (sale?.customerId) {
      if (sale?.state !== SaleStateTypes.Layby) {
        saveCart({ ...cart, sale: { ...sale, state: SaleStateTypes.Layby } })
      }
      router.push('/sell')
      setAlert({ open: true, type: 'success', message: 'LAYBY CONTINUED' })
      clearCart()
    } else {
      openView(ViewProps.createLayby)
    }
  }

  function clickAddItems() {
    router.push('/sell')
  }

  async function clickDeleteSale() {
    openConfirm({
      open: true,
      title: 'Are you absolutely positively sure?',
      message:
        'Are you sure you want to delete this sale? This will delete all transactions associated with the sale. Only do this action if transactions were not actually processed. Otherwise, you might want to edit the sale instead and process refunds.',
      yesText: 'DELETE SALE',
      action: () => {
        deleteSale(sale?.id).then(() => {
          setAlert({
            open: true,
            type: 'error',
            message: `SALE DELETED`,
            undo: () => {
              console.log('TODO - save sale again')
            },
          })
          if (sale?.state === SaleStateTypes.Parked) mutate(`sale/parked`)
          if (sale?.state === SaleStateTypes.Layby) mutate(`sale/layby`)
          router.push('/sell')
        })
      },
      noText: 'CANCEL',
    })
  }

  async function clickCompleteSale() {
    let completedSale = {
      ...sale,
      state: SaleStateTypes.Completed,
      saleClosedBy: sale?.saleClosedBy || clerk?.id,
      dateSaleClosed: sale?.dateSaleClosed || dayjs.utc().format(),
    }
    await saveCart({ ...cart, sale: completedSale })
    router.push('/sell')
    clearCart()
    setAlert({
      open: true,
      type: 'success',
      message: sale?.state === SaleStateTypes.Completed ? 'SALE SAVED' : 'SALE COMPLETED.',
    })
  }

  function clickMailOrder() {
    openView(ViewProps.createMailOrder)
  }

  const inProgressMenuItems = [
    { text: 'Add More Items', icon: <PostAdd />, onClick: clickAddItems },
    { text: 'Park Sale', icon: <DirectionsCar />, onClick: clickParkSale },
    { text: 'Start Layby', icon: <DryCleaning />, onClick: clickLayby },
    { text: 'Create Mail Order', icon: <Mail />, onClick: clickMailOrder },
    { text: 'Delete Sale', icon: <Delete />, onClick: clickDeleteSale },
  ]

  const parkedMenuItems = [
    { text: 'Add More Items', icon: <PostAdd />, onClick: clickAddItems },
    { text: 'Park Sale Again', icon: <DirectionsCar />, onClick: clickParkSale },
    { text: 'Start Layby', icon: <DryCleaning />, onClick: clickLayby },
    { text: 'Create Mail Order', icon: <Mail />, onClick: clickMailOrder },
    { text: 'Delete Sale', icon: <Delete />, onClick: clickDeleteSale },
  ]

  const laybyMenuItems = [
    { text: 'Add More Items', icon: <PostAdd />, onClick: clickAddItems },
    { text: 'Continue Layby', icon: <DryCleaning />, onClick: clickLayby },
    { text: 'Create Mail Order', icon: <Mail />, onClick: clickMailOrder },
    { text: 'Delete Layby', icon: <Delete />, onClick: clickDeleteSale },
  ]

  const completedMenuItems = [
    { text: 'Refund Items', icon: <EventBusy />, onClick: () => openView(ViewProps.returnItemDialog) },
    { text: 'Add More Items', icon: <PostAdd />, onClick: clickAddItems },
    { text: 'Park Sale', icon: <DirectionsCar />, onClick: clickParkSale },
    // { text: 'Start Layby', icon: <DryCleaning />, onClick: clickLayby },
    { text: 'Create Mail Order', icon: <Mail />, onClick: clickMailOrder },
    { text: 'Delete Sale', icon: <Delete />, onClick: clickDeleteSale },
  ]

  const menuItems =
    sale?.state === SaleStateTypes.Parked
      ? parkedMenuItems
      : sale?.state === SaleStateTypes.Layby
      ? laybyMenuItems
      : sale?.state === SaleStateTypes.Completed
      ? completedMenuItems
      : inProgressMenuItems

  const defaultAction =
    totalRemaining === 0
      ? {
          label: sale?.state === SaleStateTypes.Completed ? 'SAVE SALE' : 'COMPLETE SALE',
          onClick: clickCompleteSale,
          icon: <CheckCircleOutline />,
        }
      : sale?.state === SaleStateTypes.Parked
      ? { label: 'PARK SALE AGAIN', onClick: clickParkSale, icon: <DirectionsCar /> }
      : sale?.state === SaleStateTypes.Layby
      ? { label: 'CLOSE LAYBY', onClick: clickLayby, icon: <DryCleaning /> }
      : null

  return (
    <MidScreenContainer
      title={`PAY - ${sale?.id ? `SALE #${sale?.id}` : `NEW SALE`} [${
        sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
      }]`}
      titleClass="bg-brown-dark text-white"
      menuItems={menuItems}
      // showBackButton
      full
      dark
      isLoading={isLoading}
    >
      <div className="flex h-content">
        <div className="w-2/3">
          <SaleSummary cart={cart} isEditable />
        </div>
        <div className="w-1/3 h-content p-2 flex flex-col justify-between shadow-md">
          <Pay totalRemaining={totalRemaining} defaultAction={defaultAction} />
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
