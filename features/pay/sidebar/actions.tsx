import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'
import { saveCart } from 'lib/api/sale'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useClerk } from 'lib/api/clerk'
import { useState } from 'react'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import ActionButton from 'components/button/action-button'

const Actions = ({ totalRemaining }) => {
  const { cart, resetCart, setAlert } = useAppStore()
  const router = useRouter()
  const { sale = {} } = cart || {}
  const { clerk } = useClerk()
  const [completeSaleLoading, setCompleteSaleLoading] = useState(false)

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

  // const buttons = [
  //   {
  //     icon: <PanTool />,
  //     text: 'HOLD',
  //     onClick: () => openView(ViewProps.createHold),
  //     type: 'alt1',
  //   },
  //   {
  //     icon: <DryCleaning />,
  //     text: 'LAYBY',
  //     onClick: () => openView(ViewProps.createLayby),
  //     type: 'alt1',
  //   },
  //   {
  //     icon: <Delete />,
  //     text: 'DELETE',
  //     onClick: onClickDiscardSale,
  //     type: 'cancel',
  //   },
  //   {
  //     icon: <Park />,
  //     text: 'PARK',
  //     onClick: clickParkSale,
  //     type: 'alt1',
  //   },
  // ]

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
      {/* {totalRemaining !== 0 && (
        <div className={`grid gap-4 ${buttons?.length == 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {buttons?.map((button, i) => (
            <ActionButton key={i} button={button} />
          ))}
        </div>
      )} */}
      {showCompleteSale && <ActionButton button={completeButton} />}
    </div>
  )
}

export default Actions
