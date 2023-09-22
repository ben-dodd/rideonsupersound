import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { saveReceiveBatch, useReceiveBatch } from 'lib/api/stock'
import MidScreenContainer from 'components/container/mid-screen'
import { Delete, Edit, ImportContacts, Print } from '@mui/icons-material'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import SetupReceive from './setup-receive'
import AddReceiveItems from './add-items'
import ViewReceiveBatch from './view-receive-batch'
import { getBatchListCSVData } from 'lib/functions/printLabels'
import dayjs from 'dayjs'
import { dateYMD } from 'lib/types/date'
import ConfigureItems from './configure-items'

export default function ReceiveStockScreen() {
  const { batchReceiveSession, setBatchReceiveSession, resetBatchReceiveSession, openConfirm } = useAppStore()
  const router = useRouter()
  const id = router.query.id
  const { receiveBatch, isReceiveBatchLoading } = useReceiveBatch(`${id}`)
  const { clerk } = useClerk()
  const [stage, setStage] = useState('setup')
  const [bypassConfirmDialog, setBypassConfirmDialog] = useState(false)
  const { mutate } = useSWRConfig()

  useEffect(() => {
    console.log('New receive batch')
    console.log(receiveBatch)
    if (!isReceiveBatchLoading && receiveBatch) {
      resetBatchReceiveSession()
      setBatchReceiveSession(receiveBatch)
    }
  }, [id, isReceiveBatchLoading])

  console.log(batchReceiveSession)

  useEffect(() => {
    const saveBatchAndRedirect = (url) => {
      console.log('saving batch and redirect')
      saveReceiveBatch(batchReceiveSession).then((savedReceiveBatch) => {
        // mutate(`stock/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
        // mutate(`vendor/payment/batch`)
        // mutate(`vendor/payment`)
        router.push(url)
      })
    }
    const changePage = (url) => {
      bypassConfirmDialog
        ? null
        : batchReceiveSession?.id
        ? saveBatchAndRedirect(url)
        : openConfirm({
            open: true,
            title: 'Save session?',
            message: 'Do you want to save the current stock receive session?',
            yesText: 'Yes, Please Save',
            noText: 'No, Discard Changes',
            action: () => saveBatchAndRedirect(url),
          })
    }
    router.events.on('routeChangeStart', changePage)

    // unsubscribe on component destroy in useEffect return function
    return () => {
      router.events.off('routeChangeStart', changePage)
    }
  }, [id, bypassConfirmDialog])

  const batchListLabelData = useMemo(
    () => getBatchListCSVData(batchReceiveSession?.batchList),
    [batchReceiveSession?.batchList],
  )

  const menuItems = [
    { text: 'Edit', icon: <Edit />, onClick: null },
    { text: 'Import Items from CSV', icon: <ImportContacts />, onClick: null },
    { text: 'Print Labels', icon: <Print />, onClick: null },
    { text: 'Delete Batch', icon: <Delete />, onClick: null },
  ]

  const completedMenuItems = [
    { text: 'Edit', icon: <Edit />, onClick: null, isDisabled: true },
    {
      text: 'Print Labels',
      icon: <Print />,
      data: batchListLabelData,
      headers: ['SKU', 'ARTIST', 'TITLE', 'NEW/USED', 'SELL PRICE', 'SECTION', 'BARCODE'],
      fileName: `label-print-${dayjs().format(dateYMD)}.csv`,
    },
    { text: 'Delete Batch', icon: <Delete />, onClick: null, isDisabled: true },
  ]

  return (
    <MidScreenContainer
      showBackButton
      title={'RECEIVE STOCK'}
      titleClass={'bg-brown-dark text-white'}
      menuItems={batchReceiveSession?.dateCompleted ? completedMenuItems : menuItems}
      dark
      full
    >
      <div className="flex flex-col w-full h-dialog">
        <div className="p-4">
          {batchReceiveSession?.dateCompleted ? (
            <ViewReceiveBatch />
          ) : stage === 'setup' ? (
            <SetupReceive setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />
          ) : stage === 'add' ? (
            <AddReceiveItems setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />
          ) : stage === 'configure' ? (
            <ConfigureItems setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />
          ) : stage === 'review' ? (
            <div />
          ) : (
            <div />
          )}
        </div>
      </div>
    </MidScreenContainer>
  )
}
