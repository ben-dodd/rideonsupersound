import { Delete, Edit, EventBusy } from '@mui/icons-material'
import MidScreenContainer from 'components/container/mid-screen'
import SaleSummary from 'features/sale-summary'
import React from 'react'
import SaleDetailsSidebar from './sale-details-sidebar'

const SaleItemScreen = ({ cart }) => {
  // const { clerk } = useClerk()
  // const { clerks } = useClerks()
  // const { cart, setCart, openConfirm } = useAppStore()
  // const [loadToCartLoading, setLoadToCartLoading] = useState(false)
  // const [nukeSaleLoading, setNukeSaleLoading] = useState(false)
  const { sale = {} } = cart || {}

  // TODO make sale info screen for LAYBY and SALES screen that needs to be activated to go to the SELL screen. So only one active sale will be present at a time.
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity

  // Functions
  async function loadSale() {
    // setLoadToCartLoading(true)
    // await loadSaleToCart(cart, setCart, sale, clerk, registerId, customers)
    // setLoadToCartLoading(false)
    // router.push('sell/')
    // setView({ ...view, saleScreen: true })
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

  const menuItems = [
    { text: 'Refund Items', icon: <EventBusy />, onClick: null },
    { text: 'Edit Sale', icon: <Edit />, onClick: null, adminOnly: true },
    { text: 'Delete Sale', icon: <Delete />, onClick: null, adminOnly: true },
  ]

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
          <SaleSummary cart={cart} />
        </div>
        <div className="w-1/3">
          <SaleDetailsSidebar cart={cart} />
        </div>
      </div>
    </MidScreenContainer>
  )
}

export default SaleItemScreen
