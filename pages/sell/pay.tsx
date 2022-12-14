import { useState } from 'react'
import {
  useGiftCards,
  useInventory,
  useLogs,
  useRegisterID,
  useSaleTransactionsForSale,
} from 'lib/database/read'
import { ModalButton, SaleStateTypes } from 'lib/types'

// Components
import ScreenContainer from 'components/container/screen'
import CreateCustomerSidebar from 'features/customer/components/sidebar'
import {
  logLaybyStarted,
  logSaleCompleted,
  saveSystemLog,
} from 'features/log/lib/functions'
import dayjs from 'dayjs'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { useRouter } from 'next/router'
import SaleSummary from 'features/pay/components/sale-summary'
import Pay from 'features/pay/components/pay'
import Acct from 'features/pay/components/payment/acct'
import Card from 'features/pay/components/payment/card'
import Gift from 'features/pay/components/payment/gift'
import Cash from 'features/pay/components/payment/cash'
import ReturnItemDialog from 'features/pay/components/return-item-dialog'
import {
  getSaleVars,
  saveSaleAndPark,
} from 'features/sale/features/item-sale/lib/functions'
import { useCustomers } from 'lib/api/customer'

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

export default function SaleScreen() {
  const router = useRouter()
  const { cart, view, resetCart, setAlert } = useAppStore()
  const { clerk } = useClerk()
  const { customers } = useCustomers()
  const { inventory, mutateInventory } = useInventory()
  const { isSaleTransactionsLoading } = useSaleTransactionsForSale(cart?.id)
  const { sales, mutateSales } = useSales()
  const { giftCards, mutateGiftCards } = useGiftCards()
  const { registerID } = useRegisterID()

  // State
  // const [saleLoading, setSaleLoading] = useState(false);
  const [laybyLoading, setLaybyLoading] = useState(false)
  const [addMoreItemsLoading, setAddMoreItemsLoading] = useState(false)
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false)
  const [parkSaleLoading, setParkSaleLoading] = useState(false)
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity
  // TODO refunding items, then adding the same item again

  const { totalRemaining, totalPrice, numberOfItems } = getSaleVars(
    cart,
    inventory
  )

  // Functions
  async function clickParkSale() {
    saveSystemLog('PARK SALE clicked.', clerk?.id)
    setParkSaleLoading(true)
    saveSaleAndPark(
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
    resetCart()
    router.back()
    setParkSaleLoading(false)
  }

  async function clickLayby() {
    saveSystemLog('START LAYBY started.', clerk?.id)
    setLaybyLoading(true)
    let laybySale = { ...cart }
    if (cart?.state !== SaleStateTypes.Layby) {
      // If not already a layby in progress...
      // Change cart state to layby
      // date_layby_started
      // layby_started_by
      laybySale = {
        ...laybySale,
        state: SaleStateTypes.Layby,
        dateLaybyStarted: dayjs.utc().format(),
        laybyStartedBy: clerk?.id,
      }
      logLaybyStarted(
        cart,
        customers,
        numberOfItems,
        totalPrice,
        totalRemaining,
        clerk
      )
      setAlert({
        open: true,
        type: 'success',
        message: 'LAYBY STARTED.',
      })
    }
    saveSaleItemsTransactionsToDatabase(
      laybySale,
      clerk,
      registerID,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards,
      cart?.state
    )
    // close dialog
    setLaybyLoading(false)
    resetCart()
    router.back()
  }

  async function clickCompleteSale() {
    saveSystemLog('COMPLETE SALE clicked.', clerk?.id)
    setCompleteSaleLoading(true)
    // Update sale to 'complete', add date_sale_closed, sale_closed_by
    let completedSale = {
      ...cart,
      postal_address: cart?.isMailOrder
        ? cart?.postalAddress ||
          customers?.filter((c) => c?.id === cart?.customerId)[0]
            ?.postalAddress ||
          null
        : null,
      state: SaleStateTypes.Completed,
      saleClosedBy: clerk?.id,
      dateSaleClosed: dayjs.utc().format(),
    }

    const saleId = await saveSaleItemsTransactionsToDatabase(
      completedSale,
      clerk,
      registerID,
      sales,
      mutateSales,
      inventory,
      mutateInventory,
      giftCards,
      mutateGiftCards,
      cart?.state,
      customers?.filter((c) => c?.id === cart?.customerId)[0]?.name
    )
    resetCart()
    router.back()
    setCompleteSaleLoading(false)
    logSaleCompleted(cart, saleId, clerk)
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE COMPLETED.',
    })
  }

  // Constants
  const buttons: ModalButton[] = [
    // REVIEW discard sale, do confirm dialog
    {
      type: 'cancel',
      onClick: () => {
        saveSystemLog('DISCARD SALE clicked.', clerk?.id)
        resetCart()
        router.back()
      },
      disabled: Boolean(cart?.transactions) || totalRemaining === 0,
      text:
        cart?.state === SaleStateTypes.Layby ? 'CANCEL LAYBY' : 'DISCARD SALE',
    },
    {
      type: 'alt2',
      onClick: () => {
        saveSystemLog('CHANGE ITEMS clicked.', clerk?.id)
        router.back()
      },
      disabled: totalRemaining === 0,
      loading: addMoreItemsLoading,
      text: 'CHANGE ITEMS',
    },
    {
      type: 'alt3',
      onClick: clickParkSale,
      disabled: cart?.state === SaleStateTypes.Layby || totalRemaining === 0,
      loading: parkSaleLoading,
      text: 'PARK SALE',
    },
    {
      type: 'alt1',
      onClick: clickLayby,
      disabled: laybyLoading || !cart?.customerId || totalRemaining <= 0,
      loading: laybyLoading,
      text:
        cart?.state === SaleStateTypes.Layby ? 'CONTINUE LAYBY' : 'START LAYBY',
    },
    {
      type: 'ok',
      onClick: clickCompleteSale,
      disabled:
        completeSaleLoading ||
        totalRemaining !== 0 ||
        cart?.state === SaleStateTypes.Completed,
      loading: completeSaleLoading,
      text: 'COMPLETE SALE',
    },
  ]

  return (
    <>
      <ScreenContainer
        show={view?.saleScreen}
        closeFunction={() => {
          if (totalRemaining === 0) {
            if (cart?.state === SaleStateTypes.Completed) {
              saveSystemLog(
                'Sale screen closed. Total remaining === 0. Cart set to null.',
                clerk?.id
              )
              resetCart()
            } else {
              saveSystemLog(
                'Sale screen closed. Total remaining === 0. Sale completed.',
                clerk?.id
              )
              clickCompleteSale()
            }
          }
          saveSystemLog('Sale screen closed. Total remaining not 0.', clerk?.id)
          router.back()
        }}
        title={`${cart?.id ? `SALE #${cart?.id}` : `NEW SALE`} [${
          cart?.state ? cart?.state.toUpperCase() : 'IN PROGRESS'
        }]`}
        loading={isSaleTransactionsLoading}
        buttons={buttons}
        titleClass="bg-col1"
      >
        <div className="flex items-start overflow-auto w-full">
          <div className="w-2/3">
            <SaleSummary sale={cart} />
          </div>
          <div className="w-1/3 p-2 flex flex-col justify-between">
            <Pay />
            {/*<Action />*/}
          </div>
        </div>
      </ScreenContainer>
      {view?.acctPaymentDialog && <Acct />}
      {view?.cardPaymentDialog && <Card />}
      {view?.cashPaymentDialog && <Cash />}
      {view?.giftPaymentDialog && <Gift />}
      {view?.createCustomer && <CreateCustomerSidebar />}
      {view?.returnItemDialog && <ReturnItemDialog sale={cart} />}
    </>
  )
}
