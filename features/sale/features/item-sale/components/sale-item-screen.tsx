// Packages
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

// DB
import {
  alertAtom,
  cartAtom,
  clerkAtom,
  confirmModalAtom,
  loadedSaleIdAtom,
  pageAtom,
  viewAtom,
} from '@lib/atoms'
import {
  useCustomers,
  useGiftCards,
  useInventory,
  useLogs,
  useRegisterID,
  useSaleItemsForSale,
  useSales,
  useSaleTransactionsForSale,
} from '@lib/database/read'
import { ModalButton, SaleItemObject, SaleObject } from '@lib/types'

// Functions
import { getSaleVars } from '@lib/data-functions'
import {
  loadSaleToCart,
  nukeSaleInDatabase,
  saveSystemLog,
} from '@lib/db-functions'

// Components
import ScreenContainer from '@components/container/screen'
import SaleDetails from './sale-details'
import SaleSummary from './sale-summary'

import DeleteIcon from '@mui/icons-material/Delete'

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

export default function SaleItemScreen() {
  // Atoms
  const [loadedSaleId, setLoadedSaleId] = useAtom(loadedSaleIdAtom)
  const [clerk] = useAtom(clerkAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [, setAlert] = useAtom(alertAtom)
  const [view, setView] = useAtom(viewAtom)
  const [page, setPage] = useAtom(pageAtom)
  const [, setConfirmModal] = useAtom(confirmModalAtom)

  // SWR
  const { customers } = useCustomers()
  const { inventory, mutateInventory } = useInventory()
  const { giftCards, mutateGiftCards } = useGiftCards()
  const { items, isSaleItemsLoading } = useSaleItemsForSale(loadedSaleId[page])
  const { transactions, isSaleTransactionsLoading } =
    useSaleTransactionsForSale(loadedSaleId[page])
  const { sales, mutateSales } = useSales()
  const { logs, mutateLogs } = useLogs()
  const { registerID } = useRegisterID()

  // State
  const [saleLoading, setSaleLoading] = useState(false)
  const [loadToCartLoading, setLoadToCartLoading] = useState(false)
  const [nukeSaleLoading, setNukeSaleLoading] = useState(false)

  // State
  const [sale, setSale]: [SaleObject, Function] = useState({})

  // Load
  useEffect(() => {
    setSaleLoading(true)
    if (!isSaleItemsLoading && !isSaleTransactionsLoading) {
      let loadedSale =
        sales?.filter((s: SaleObject) => s?.id === loadedSaleId[page])[0] || {}
      loadedSale.items = items
      loadedSale.transactions = transactions
      console.log(loadedSale)
      setSale(loadedSale)
      setSaleLoading(false)
    }
  }, [loadedSaleId[page], isSaleItemsLoading, isSaleTransactionsLoading])

  // TODO make sale info screen for LAYBY and SALES screen that needs to be activated to go to the SELL screen. So only one active sale will be present at a time.
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity

  const { totalRemaining } = getSaleVars(sale, inventory)

  // Functions
  async function loadSale() {
    saveSystemLog('LOAD SALE clicked.', clerk?.id)
    setLoadToCartLoading(true)
    await loadSaleToCart(
      cart,
      setCart,
      sale,
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
    setLoadToCartLoading(false)
    setSale(null)
    setLoadedSaleId({ ...loadedSaleId, [page]: null })
    setView({ ...view, saleScreen: true })
    setPage('sell')
  }

  async function nukeSale() {
    saveSystemLog('SALE NUKED', clerk?.id)
    await nukeSaleInDatabase(sale, clerk, registerID, logs, mutateLogs)
    setSale(null)
    setLoadedSaleId({ ...loadedSaleId, [page]: null })
  }

  // Constants
  const buttons: ModalButton[] = [
    // {
    //   type: "cancel",
    //   onClick: () => {
    //     saveSystemLog("NUKE SALE clicked.", clerk?.id);
    //     setConfirmModal({
    //       open: true,
    //       title: "Are you sure you want to delete this sale?",
    //       styledMessage: (
    //         <span>
    //           This will delete the sale and all associated transactions. There
    //           is no coming back.
    //         </span>
    //       ),
    //       yesText: "YES, I'M SURE",
    //       action: nukeSale,
    //     });
    //   },
    //   loading: nukeSaleLoading,
    //   text: "NUKE SALE",
    // },
    {
      type: 'ok',
      onClick: loadSale,
      loading: loadToCartLoading,
      text: totalRemaining === 0 ? 'RETURN ITEMS' : 'LOAD SALE TO CART',
    },
  ]

  const titleClass =
    page === 'sell' ? 'bg-col1' : page === 'sales' ? 'bg-col5' : 'bg-col6'

  return (
    <>
      <ScreenContainer
        show={loadedSaleId[page]}
        closeFunction={() => setLoadedSaleId({ ...loadedSaleId, [page]: null })}
        title={`SALE #${sale?.id} [${
          sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
        }]`}
        loading={saleLoading}
        buttons={
          sale?.items?.filter(
            (s: SaleItemObject) => !s?.is_refunded && !s?.is_deleted
          )?.length > 0
            ? buttons
            : null
        }
        titleClass={titleClass}
      >
        <div className="flex items-start overflow-auto w-full">
          <div className="w-2/3">
            <SaleSummary sale={sale} />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <SaleDetails sale={sale} />
            <div className="flex justify-start py-2">
              <button
                className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
                onClick={() => {
                  saveSystemLog('NUKE SALE clicked.', clerk?.id)
                  setConfirmModal({
                    open: true,
                    title: 'Are you sure you want to delete this sale?',
                    styledMessage: (
                      <span>
                        This will delete the sale and all associated
                        transactions. There is no coming back.
                      </span>
                    ),
                    yesText: "YES, I'M SURE",
                    action: nukeSale,
                  })
                }}
              >
                <DeleteIcon />
                Nuke Sale
              </button>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </>
  )
}
