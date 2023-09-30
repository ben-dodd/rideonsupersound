import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from 'lib/store'
import { deleteReceiveBatch, useReceiveBatch } from 'lib/api/stock'
import MidScreenContainer from 'components/container/mid-screen'
import { Delete, Edit, Print } from '@mui/icons-material'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import SetupReceive from './setup-receive'
import AddReceiveItems from './add-items'
import ViewReceiveBatch from './view-receive-batch'
import { getBatchListCSVData } from 'lib/functions/printLabels'
import dayjs from 'dayjs'
import { dateYMD } from 'lib/types/date'
import ConfigureItems from './configure-items'
import ReviewItems from './review-items'

export default function ReceiveStockScreen() {
  const { batchReceiveSession, loadBatchReceiveSession, resetBatchReceiveSession, openConfirm } = useAppStore()
  const router = useRouter()
  const id = router.query.id
  const { receiveBatch, isReceiveBatchLoading } = useReceiveBatch(`${id}`)
  const [stage, setStage] = useState('setup')
  const [update, setUpdate] = useState(0)
  const [bypassConfirmDialog, setBypassConfirmDialog] = useState(false)
  const { mutate } = useSWRConfig()

  useEffect(() => {
    console.log('change loadbatch', batchReceiveSession)
    if (!isReceiveBatchLoading && receiveBatch) {
      console.log('Loading batch receive session', receiveBatch)
      loadBatchReceiveSession(receiveBatch)
      setUpdate((update) => update + 1)
    }
  }, [id, isReceiveBatchLoading])

  console.log(batchReceiveSession)

  // useEffect(() => {
  //   // const saveBatchAndRedirect = (url) => {
  //   //   const receiveBatchToSave = {
  //   //     ...batchReceiveSession,
  //   //     itemList: getItemList(batchReceiveSession?.batchList),
  //   //     itemCount: getItemCount(batchReceiveSession?.batchList),
  //   //   }
  //   //   console.log('saving batch and redirect', receiveBatchToSave)
  //   //   saveReceiveBatch(receiveBatchToSave).then((savedReceiveBatch) => {
  //   //     console.log('saved batch', savedReceiveBatch)
  //   //     resetBatchReceiveSession()
  //   //     mutate(`stock/receive/${savedReceiveBatch?.id}`, savedReceiveBatch)
  //   //     mutate(`stock/receive`)
  //   //     router.push(url)
  //   //   })
  //   // }
  //   const changePage = (url) => {
  //     // console.log('changing page', batchReceiveSession)
  //     if (bypassConfirmDialog) {
  //       // console.log('Do nothing')
  //       // resetBatchReceiveSession()
  //     } else {
  //       openConfirm({
  //         open: true,
  //         title: 'Leave without saving?',
  //         message: 'If you leave the page you will lose unsaved changes. Continue or go back and save?',
  //         yesText: 'Continue',
  //         noText: 'Go Back and Save',
  //         action: () => saveBatchAndRedirect(url),

  //       })
  //     }
  //     //  else if (batchReceiveSession?.id) {
  //     //   console.log('save batch and redirect')
  //     //   saveBatchAndRedirect(url)
  //     // } else {
  //     //   openConfirm({
  //     //     open: true,
  //     //     title: 'Save session?',
  //     //     message: 'Do you want to save the current stock receive session?',
  //     //     yesText: 'Yes, Please Save',
  //     //     noText: 'No, Discard Changes',
  //     //     action: () => saveBatchAndRedirect(url),
  //     //   })
  //     // }
  //   }
  //   router.events.on('routeChangeStart', changePage)

  //   // unsubscribe on component destroy in useEffect return function
  //   return () => {
  //     router.events.off('routeChangeStart', changePage)
  //   }
  // }, [id, batchReceiveSession?.id, isReceiveBatchLoading, bypassConfirmDialog])

  const batchListLabelData = useMemo(
    () => getBatchListCSVData(batchReceiveSession?.batchList),
    [batchReceiveSession?.batchList],
  )

  const deleteBatch = () => {
    openConfirm({
      open: true,
      title: 'Delete receive session?',
      message: 'Do you want to delete the receive session?',
      action: () => {
        setBypassConfirmDialog(true)
        deleteReceiveBatch(receiveBatch?.id).then(() => {
          console.log('Delete batch complete')
          resetBatchReceiveSession()
          mutate(`stock/receive`)
          router.push(`/stock`)
        })
      },
    })
  }

  const menuItems = [{ text: 'Delete Batch', icon: <Delete />, onClick: deleteBatch }]

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
            <ReviewItems setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />
          ) : (
            <div />
          )}
        </div>
      </div>
    </MidScreenContainer>
  )
}
