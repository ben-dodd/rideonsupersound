import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'
import { saveCart } from 'lib/api/sale'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useClerk } from 'lib/api/clerk'
import { useState } from 'react'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import { Delete, DryCleaning, PanTool, Park } from '@mui/icons-material'
import { ViewProps } from 'lib/store/types'
import ActionButton from 'components/button/action-button'

const Actions = ({ totalRemaining }) => {
  const { cart, resetCart, setAlert, openView, openConfirm, setCart, closeView } = useAppStore()
  const router = useRouter()
  const { sale = {}, transactions = [] } = cart || {}
  const { clerk } = useClerk()
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false)
  function clearCart() {
    resetCart()
    closeView(ViewProps.cart)
  }
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

  async function onClickDiscardSale() {
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

  const buttons = [
    {
      icon: <PanTool />,
      text: 'HOLD',
      onClick: () => openView(ViewProps.createHold),
      type: 'alt1',
    },
    {
      icon: <DryCleaning />,
      text: 'LAYBY',
      onClick: () => openView(ViewProps.createLayby),
      type: 'alt1',
    },
    {
      icon: <Delete />,
      text: 'DELETE',
      onClick: onClickDiscardSale,
      type: 'cancel',
    },
    {
      icon: <Park />,
      text: 'PARK',
      onClick: clickParkSale,
      type: 'alt1',
    },
  ]

  const completeButton = {
    icon: <CheckCircleOutline />,
    text: 'COMPLETE',
    onClick: clickCompleteSale,
    type: 'ok',
    disabled: completeSaleLoading || totalRemaining !== 0 || sale?.state === SaleStateTypes.Completed,
    loading: completeSaleLoading,
  }

  const showCompleteSale = totalRemaining === 0

  return (
    <div>
      {totalRemaining !== 0 && (
        <div className={`grid gap-4 ${buttons?.length == 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {buttons?.map((button, i) => (
            <ActionButton key={i} button={button} />
          ))}
        </div>
      )}
      {showCompleteSale && <ActionButton button={completeButton} />}
    </div>
  )
}

export default Actions
