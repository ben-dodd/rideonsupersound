import { useState } from 'react'
import { useVendors } from 'lib/api/vendor'
import MidScreenContainer from 'components/container/mid-screen'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { useCurrentRegisterId } from 'lib/api/register'
import { useStockList } from 'lib/api/stock'
import AddBatchReceiveItems from './add-batch-receive-items'
import ReviewBatchReceiveItems from './review-batch-receive-items'
import { Delete, Edit, ImportContacts, Print } from '@mui/icons-material'

export default function ReceiveStockScreen({ receiveBatch }) {
  const router = useRouter()
  const { isStockListLoading } = useStockList()
  const { receiveBasket, resetReceiveBasket, openConfirm, closeView } = useAppStore()
  const { clerk } = useClerk()
  const [receivedStock, setReceivedStock] = useState(null)
  const [receiveLoading, setReceiveLoading] = useState(false)
  const { registerId } = useCurrentRegisterId()
  const { batch = {}, stockMovements = [], stockItems = [] } = receiveBatch || {}
  const { isVendorsLoading } = useVendors()
  const id = router.query.id
  const [stage, setStage] = useState('add')

  const menuItems = [
    { text: 'Edit', icon: <Edit />, onClick: null },
    { text: 'Import Items from CSV', icon: <ImportContacts />, onClick: null },
    { text: 'Print Labels', icon: <Print />, onClick: null },
    { text: 'Delete Batch', icon: <Delete />, onClick: null },
  ]

  return (
    <MidScreenContainer
      title={`${id}`?.toLowerCase() === 'new' ? 'NEW RECEIVE BATCH' : `RECEIVE BATCH #${`00000${id}`.slice(-5)}`}
      titleClass="bg-brown-dark text-white"
      menuItems={menuItems}
      isLoading={isStockListLoading || isVendorsLoading}
      showBackButton
      full
      dark
    >
      {receiveBasket?.dateCompleted ? (
        // <ViewReceiveBatch />
        <div />
      ) : stage === 'add' ? (
        <AddBatchReceiveItems setStage={setStage} />
      ) : // ) : stage === 'price' ? (
      //   <PriceBatchReceiveItems setStage={setStage} />
      stage === 'review' ? (
        <ReviewBatchReceiveItems setStage={setStage} />
      ) : (
        <div />
      )}
    </MidScreenContainer>
  )
}
