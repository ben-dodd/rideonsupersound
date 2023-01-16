import { useCustomers } from 'lib/api/customer'
import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'
import { saveCart } from 'lib/api/sale'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useClerk } from 'lib/api/clerk'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import { Delete, DryCleaning, PanTool, Park } from '@mui/icons-material'
import { ViewProps } from 'lib/store/types'

const Actions = ({ totalRemaining }) => {
  const { cart, resetCart, setAlert, openView, setCustomer, openConfirm, setCart, closeView } = useAppStore()
  const router = useRouter()
  const { sale = {} } = cart || {}
  const { clerk } = useClerk()
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false)
  const { customers = [] } = useCustomers()
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
    openConfirm({
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
      text: 'HOLD ITEMS',
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
      icon: <Park />,
      text: 'PARK',
      onClick: clickParkSale,
      type: 'alt1',
    },
    {
      icon: <Delete />,
      text: 'CANCEL',
      onClick: onClickDiscardSale,
      type: 'cancel',
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

  const Button = ({ button }) => {
    const { icon, text, onClick, type = 'ok', loading, disabled } = button
    return (
      <button className={`w-full modal__button--${type}`} disabled={disabled} onClick={onClick}>
        {loading ? (
          <span className="pr-4">
            <CircularProgress color="inherit" size={18} />
          </span>
        ) : (
          icon
        )}
        <div className="ml-2">{text}</div>
      </button>
    )
  }

  return (
    <div>
      {totalRemaining !== 0 && (
        <div className="modal__button-div">
          {buttons?.map((button, i) => (
            <Button key={i} button={button} />
          ))}
        </div>
      )}
      {showCompleteSale && <Button button={completeButton} />}
    </div>
  )
}

export default Actions

// const buttons: ModalButton[] = [
//   // REVIEW discard sale, do confirm dialog
//   {
//     type: 'cancel',
//     onClick: () => {
//       resetCart()
//       router.push('/sell')
//     },
//     disabled: Boolean(cart?.transactions) || totalRemaining === 0,
//     text: sale?.state === SaleStateTypes.Layby ? 'CANCEL LAYBY' : 'DISCARD SALE',
//   },
//   // {
//   //   type: 'alt2',
//   //   onClick: () => router.push('/sell'),
//   //   disabled: totalRemaining === 0,
//   //   loading: addMoreItemsLoading,
//   //   text: 'CHANGE ITEMS',
//   // },
//   {
//     type: 'alt3',
//     onClick: clickParkSale,
//     disabled: sale?.state === SaleStateTypes.Layby || totalRemaining === 0,
//     text: 'PARK SALE',
//   },
//   {
//     type: 'alt1',
//     onClick: clickLayby,
//     disabled: !sale?.customerId || totalRemaining <= 0,
//     text: sale?.state === SaleStateTypes.Layby ? 'CONTINUE LAYBY' : 'START LAYBY',
//   },
//   {
//     type: 'ok',
//     onClick: clickCompleteSale,
//     disabled: completeSaleLoading || totalRemaining !== 0 || sale?.state === SaleStateTypes.Completed,
//     loading: completeSaleLoading,
//     text: 'COMPLETE SALE',
//   },
// ]

// const handleClickReturn = () => {
//   if (totalRemaining === 0) {
//     if (sale?.state === SaleStateTypes.Completed) resetCart()
//     else {
//       // clickCompleteSale()
//     }
//   }
//   router.push('/sell')
// }
