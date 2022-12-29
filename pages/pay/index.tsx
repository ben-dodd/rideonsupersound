import { useEffect, useState } from 'react'
import { ModalButton, SaleStateTypes } from 'lib/types'
import Layout from 'components/layout'
import ScreenContainer from 'components/container/screen'
import CreateCustomerSidebar from 'features/sell/create-customer/sidebar'
import { saveSystemLog } from 'lib/functions/log'
import dayjs from 'dayjs'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { useRouter } from 'next/router'
import SaleSummary from 'features/pay/sale-summary'
import Pay from 'features/pay/pay'
import Acct from 'features/pay/payment/acct'
import Card from 'features/pay/payment/card'
import Gift from 'features/pay/payment/gift'
import Cash from 'features/pay/payment/cash'
import ReturnItemDialog from 'features/pay/return-item-dialog'
import { useCustomers } from 'lib/api/customer'
import { useSaleProperties } from 'lib/hooks'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { saveCart } from 'lib/api/sale'

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

export default function PayScreen() {
  const router = useRouter()
  const { cart, view, resetCart, setAlert } = useAppStore()
  const { sale = {}, items = [] } = cart || {}
  useEffect(() => {
    // if (router.asPath === router.pathname) router.replace('sell')
    // TODO cart needs type fixed
    if (!sale?.id && items?.length === 0) router.replace('sell')
  }, [sale, items])
  console.log(cart)
  const { clerk } = useClerk()
  const { customers } = useCustomers()
  const [laybyLoading, setLaybyLoading] = useState(false)
  const [addMoreItemsLoading] = useState(false)
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false)
  const [parkSaleLoading, setParkSaleLoading] = useState(false)
  // BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
  // BUG fix bug where bottom of dialog is visible
  // BUG dates are wrong on vercel
  // BUG why are some sales showing items as separate line items, not 2x quantity
  // TODO refunding items, then adding the same item again

  const { totalRemaining } = useSaleProperties(cart)

  // Functions
  async function clickParkSale() {
    saveSystemLog('PARK SALE clicked.', clerk?.id)
    setParkSaleLoading(true)
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
    let laybySale = { ...sale }
    if (sale?.state !== SaleStateTypes.Layby) {
      laybySale = {
        ...sale,
        state: SaleStateTypes.Layby,
        dateLaybyStarted: dayjs.utc().format(),
        laybyStartedBy: clerk?.id,
      }
      setAlert({
        open: true,
        type: 'success',
        message: 'LAYBY STARTED.',
      })
    }
    await saveCart({ ...cart, sale: laybySale })
    setLaybyLoading(false)
    resetCart()
    router.back()
  }

  async function clickCompleteSale() {
    setCompleteSaleLoading(true)
    let completedSale = {
      ...sale,
      postalAddress: sale?.isMailOrder
        ? sale?.postalAddress ||
          customers?.find((c) => c?.id === sale?.customerId)?.postalAddress ||
          null
        : null,
      state: SaleStateTypes.Completed,
      saleClosedBy: clerk?.id,
      dateSaleClosed: dayjs.utc().format(),
    }
    await saveCart({ ...cart, sale: completedSale })
    resetCart()
    router.back()
    setCompleteSaleLoading(false)
    // logSaleCompleted(cart, saleId, clerk)
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
        resetCart()
        router.back()
      },
      disabled: Boolean(cart?.transactions) || totalRemaining === 0,
      text:
        sale?.state === SaleStateTypes.Layby ? 'CANCEL LAYBY' : 'DISCARD SALE',
    },
    {
      type: 'alt2',
      onClick: () => router.back(),
      disabled: totalRemaining === 0,
      loading: addMoreItemsLoading,
      text: 'CHANGE ITEMS',
    },
    {
      type: 'alt3',
      onClick: clickParkSale,
      disabled: sale?.state === SaleStateTypes.Layby || totalRemaining === 0,
      loading: parkSaleLoading,
      text: 'PARK SALE',
    },
    {
      type: 'alt1',
      onClick: clickLayby,
      disabled: laybyLoading || !sale?.customerId || totalRemaining <= 0,
      loading: laybyLoading,
      text:
        sale?.state === SaleStateTypes.Layby ? 'CONTINUE LAYBY' : 'START LAYBY',
    },
    {
      type: 'ok',
      onClick: clickCompleteSale,
      disabled:
        completeSaleLoading ||
        totalRemaining !== 0 ||
        sale?.state === SaleStateTypes.Completed,
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
            if (sale?.state === SaleStateTypes.Completed) resetCart()
            else clickCompleteSale()
          }
          router.back()
        }}
        title={`${sale?.id ? `SALE #${sale?.id}` : `NEW SALE`} [${
          sale?.state ? sale?.state.toUpperCase() : 'IN PROGRESS'
        }]`}
        // loading={isSaleTransactionsLoading}
        buttons={buttons}
        titleClass="bg-col1"
      >
        <div className="flex items-start overflow-auto w-full">
          <div className="w-2/3">
            <SaleSummary cart={cart} />
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

PayScreen.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
