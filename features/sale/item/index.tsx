import { Delete } from '@mui/icons-material'
import Loading from 'components/loading'
import SaleSummary from 'features/sale-summary'
import { useClerk, useClerks } from 'lib/api/clerk'
import { useSale } from 'lib/api/sale'
import { useAppStore } from 'lib/store'
import React, { useState } from 'react'
import SaleDetails from './sale-details'

const SaleItemScreen = ({ id }) => {
  console.log('ID is', id)
  const { sale, isSaleLoading } = useSale(id)
  console.log(sale)
  const { clerk } = useClerk()
  const { clerks } = useClerks()
  const { cart, setCart, openConfirm } = useAppStore()
  const [loadToCartLoading, setLoadToCartLoading] = useState(false)
  const [nukeSaleLoading, setNukeSaleLoading] = useState(false)

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

  return (
    <div className="flex items-start overflow-auto w-full h-main">
      {isSaleLoading ? (
        <Loading />
      ) : (
        <>
          <div className="w-2/3">
            <SaleSummary cart={sale} />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <SaleDetails cart={sale} />
            <div className="flex justify-start py-2">
              <button
                className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
                onClick={() => {
                  openConfirm({
                    open: true,
                    title: 'Are you sure you want to delete this sale?',
                    styledMessage: (
                      <span>This will delete the sale and all associated transactions. There is no coming back.</span>
                    ),
                    yesText: "YES, I'M SURE",
                    action: nukeSale,
                  })
                }}
              >
                <Delete />
                Nuke Sale
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SaleItemScreen
