import React, { useEffect, useState } from 'react'
import ScreenContainer from 'components/container/screen'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useSaleProperties } from 'lib/hooks'
import { SaleStateTypes } from 'lib/types/sale'
import { saveCart } from 'lib/api/sale'
import dayjs from 'dayjs'
import { ModalButton } from 'lib/types'
import SaleSummary from '../sale-summary'
import Pay from './pay'

const PayScreen = () => {
  const { cart, view, resetCart, setAlert } = useAppStore()
  const { sale = {}, items = [] } = cart || {}
  const router = useRouter()
  useEffect(() => {
    if (!sale?.id && items?.length === 0) router.replace('/sell')
  }, [sale, items])
  const { clerk } = useClerk()
  const [addMoreItemsLoading] = useState(false)
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false)
  const { totalRemaining } = useSaleProperties(cart)

  function clickParkSale() {
    saveCart({ ...cart, sale: { ...sale, state: SaleStateTypes.Parked } }, sale?.state)
    resetCart()
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE PARKED',
    })
    router.push('/sell')
  }

  function clickLayby() {
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
    saveCart({ ...cart, sale: laybySale }, sale?.state)
    resetCart()
    router.push('/sell')
  }

  // TODO should it complete automatically
  async function clickCompleteSale() {
    setCompleteSaleLoading(true)
    let completedSale = {
      ...sale,
      state: SaleStateTypes.Completed,
      saleClosedBy: clerk?.id,
      dateSaleClosed: dayjs.utc().format(),
    }
    await saveCart({ ...cart, sale: completedSale }, sale?.state)
    resetCart()
    router.push('/sell')
    setCompleteSaleLoading(false)
    setAlert({
      open: true,
      type: 'success',
      message: 'SALE COMPLETED.',
    })
  }

  const buttons: ModalButton[] = [
    // REVIEW discard sale, do confirm dialog
    {
      type: 'cancel',
      onClick: () => {
        resetCart()
        router.push('/sell')
      },
      disabled: Boolean(cart?.transactions) || totalRemaining === 0,
      text: sale?.state === SaleStateTypes.Layby ? 'CANCEL LAYBY' : 'DISCARD SALE',
    },
    // {
    //   type: 'alt2',
    //   onClick: () => router.push('/sell'),
    //   disabled: totalRemaining === 0,
    //   loading: addMoreItemsLoading,
    //   text: 'CHANGE ITEMS',
    // },
    {
      type: 'alt3',
      onClick: clickParkSale,
      disabled: sale?.state === SaleStateTypes.Layby || totalRemaining === 0,
      text: 'PARK SALE',
    },
    {
      type: 'alt1',
      onClick: clickLayby,
      disabled: !sale?.customerId || totalRemaining <= 0,
      text: sale?.state === SaleStateTypes.Layby ? 'CONTINUE LAYBY' : 'START LAYBY',
    },
    {
      type: 'ok',
      onClick: clickCompleteSale,
      disabled: completeSaleLoading || totalRemaining !== 0 || sale?.state === SaleStateTypes.Completed,
      loading: completeSaleLoading,
      text: 'COMPLETE SALE',
    },
  ]
  return (
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
  )
}

export default PayScreen

// TODO add returns to sale items
// TODO refund dialog like PAY, refund with store credit, cash or card

// BUG fix bug where close register screen appears (pressing TAB) - have fixed by just hiding sidebars and screens
// BUG fix bug where bottom of dialog is visible
// BUG dates are wrong on vercel
// BUG why are some sales showing items as separate line items, not 2x quantity
// TODO refunding items, then adding the same item again
