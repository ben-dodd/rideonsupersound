import { Delete, Edit, EventBusy, PointOfSale } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import SaleSummary from 'features/sale/item/sale-summary'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { SaleStateTypes } from 'lib/types/sale'
import { useRouter } from 'next/router'
import React from 'react'
import SaleDetailsSidebar from '../static/sale-details-sidebar'

const SaleItemScreen = ({ saleItem }) => {
  const router = useRouter()
  const { openView, loadSaleToCart } = useAppStore()
  const { sale = {} } = saleItem || {}

  // TODO make sale info screen for LAYBY and SALES screen that needs to be activated to go to the SELL screen. So only one active sale will be present at a time.
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity

  // Functions
  async function loadSale() {
    loadSaleToCart(saleItem)
    router.push('/sell/pay')
  }

  async function nukeSale() {
    // await nukeSaleInDatabase(sale, clerk, registerID)
    // setSale(null)
    // router.back()
  }

  //   <div className="flex justify-start py-2">
  //   <button
  //     className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
  //     onClick={() => {
  //       openConfirm({
  //         open: true,
  //         title: 'Are you sure you want to delete this sale?',
  //         styledMessage: (
  //           <span>This will delete the sale and all associated transactions. There is no coming back.</span>
  //         ),
  //         yesText: "YES, I'M SURE",
  //         action: nukeSale,
  //       })
  //     }}
  //   >
  //     <Delete />
  //     Nuke Sale
  //   </button>
  // </div>

  const completedMenuItems = [
    { text: 'Refund Items', icon: <EventBusy />, onClick: () => openView(ViewProps.returnItemDialog) },
    { text: 'Edit Sale', icon: <Edit />, onClick: loadSale, adminOnly: true },
    { text: 'Delete Sale', icon: <Delete />, onClick: null, adminOnly: true },
  ]

  const parkedMenuItems = [
    { text: 'Resume Sale', icon: <PointOfSale />, onClick: loadSale },
    { text: 'Delete Sale', icon: <Delete />, onClick: null, adminOnly: true },
  ]

  const laybyMenuItems = [
    { text: 'Load Layby to Cart', icon: <PointOfSale />, onClick: loadSale },
    { text: 'Delete Layby', icon: <Delete />, onClick: null, adminOnly: true },
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
      showBackButton
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
