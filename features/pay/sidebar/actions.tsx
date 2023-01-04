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
import { DryCleaning, Park } from '@mui/icons-material'

const Actions = ({ totalRemaining }) => {
  const { cart, resetCart, setAlert, openView, setCustomer } = useAppStore()
  const router = useRouter()
  const { sale = {} } = cart || {}
  const { clerk } = useClerk()
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false)
  const { customers = [] } = useCustomers()
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

  const buttons = [
    {
      icon: <DryCleaning />,
      text: 'LAYBY',
      onClick: clickLayby,
      type: 'cancel',
      disabled: !sale?.customerId || totalRemaining <= 0,
    },
    {
      icon: <Park />,
      text: 'PARK',
      onClick: clickParkSale,
      type: 'cancel',
      disabled: sale?.state === SaleStateTypes.Layby || totalRemaining === 0,
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

  const Button = ({ button }) => {
    const { icon, text, onClick, type = 'ok', loading, disabled } = button
    return (
      <button className={`w-full my-4 modal__button--${type}`} disabled={disabled} onClick={onClick}>
        {loading ? (
          <span className="pr-4">
            <CircularProgress color="inherit" size={18} />
          </span>
        ) : (
          icon
        )}
        {text}
      </button>
    )
  }

  return (
    <>
      {totalRemaining !== 0 && (
        <div className="grid grid-cols-2 gap-4">
          {buttons?.map((button, i) => (
            <Button key={i} button={button} />
          ))}
        </div>
      )}
      <Button button={completeButton} />
    </>
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
