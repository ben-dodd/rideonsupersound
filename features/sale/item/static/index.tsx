import { Delete, Edit, EventBusy, PointOfSale } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import SaleSummary from 'features/sale/item/sale-summary'
import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'
import { useRouter } from 'next/router'
import SaleDetailsSidebar from '../static/sale-details-sidebar'
import { deleteSale } from 'lib/api/sale'
import { useSWRConfig } from 'swr'
import { ViewProps } from 'lib/store/types'

const SaleItemScreen = ({ saleItem }) => {
  const router = useRouter()
  const { openView, loadSaleToCart, openConfirm, setAlert, closeView, resetCart } = useAppStore()
  const { sale = {} } = saleItem || {}
  const { mutate } = useSWRConfig()

  // TODO make sale info screen for LAYBY and SALES screen that needs to be activated to go to the SELL screen. So only one active sale will be present at a time.
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity
  function loadRefund() {
    openView(ViewProps.returnItemDialog)
    loadSale()
  }

  function loadSale() {
    loadSaleToCart(saleItem)
    router.push('/sell/pay')
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

  const completedMenuItems = [
    { text: 'Refund Items', icon: <EventBusy />, onClick: loadRefund },
    { text: 'Edit Sale', icon: <Edit />, onClick: loadSale },
    { text: 'Delete Sale', icon: <Delete />, onClick: clickDeleteSale, adminOnly: true },
  ]

  const parkedMenuItems = [
    { text: 'Resume Sale', icon: <PointOfSale />, onClick: loadSale },
    { text: 'Delete Sale', icon: <Delete />, onClick: clickDeleteSale, adminOnly: true },
  ]

  const laybyMenuItems = [
    { text: 'Load Layby to Cart', icon: <PointOfSale />, onClick: loadSale },
    { text: 'Delete Layby', icon: <Delete />, onClick: clickDeleteSale, adminOnly: true },
  ]

  const menuItems =
    sale?.state === SaleStateTypes.Completed
      ? completedMenuItems
      : sale?.state === SaleStateTypes.Layby
      ? laybyMenuItems
      : parkedMenuItems

  return (
    <MidScreenContainer
      title={`${sale?.id ? `SALE #${sale?.id}` : `NEW SALE`} [${
        sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
      }]`}
      titleClass={'bg-brown-dark text-white'}
      // showBackButton
      full
      dark
      menuItems={menuItems}
    >
      <div className="flex">
        <div className="w-2/3">
          <SaleSummary cart={saleItem} />
        </div>
        <div className="w-1/3">
          <SaleDetailsSidebar cart={saleItem} />
        </div>
      </div>
    </MidScreenContainer>
  )
}

export default SaleItemScreen
