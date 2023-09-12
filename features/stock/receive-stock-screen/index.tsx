import { useEffect, useState } from 'react'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { saveReceiveBatch, useReceiveBatch } from 'lib/api/stock'
import MidScreenContainer from 'components/container/mid-screen'
import { Delete, Edit, ImportContacts, Print } from '@mui/icons-material'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import SetupReceive from './setup-receive'
import AddReceiveItems from './add-items'

export default function ReceiveStockScreen() {
  const { batchReceiveSession, resetBatchReceiveSession, setBatchReceiveSession, openConfirm, closeView } =
    useAppStore()
  const { batch = {} } = batchReceiveSession || {}
  const router = useRouter()
  const id = router.query.id
  const { receiveBatch } = useReceiveBatch(`${id}`)
  const { clerk } = useClerk()
  const [stage, setStage] = useState('setup')
  const [bypassConfirmDialog, setBypassConfirmDialog] = useState(false)
  const { mutate } = useSWRConfig()
  useEffect(() => {
    console.log('New receive batch')
    console.log(receiveBatch)
    setBatchReceiveSession(receiveBatch)
  }, [id])
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
        : batch?.id
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

  const menuItems = [
    { text: 'Edit', icon: <Edit />, onClick: null },
    { text: 'Import Items from CSV', icon: <ImportContacts />, onClick: null },
    { text: 'Print Labels', icon: <Print />, onClick: null },
    { text: 'Delete Batch', icon: <Delete />, onClick: null },
  ]

  const noVendor = !batch?.vendorId
  const noItems = batch?.batchList?.length === 0

  return (
    <MidScreenContainer
      showBackButton
      title={'RECEIVE STOCK'}
      titleClass={'bg-brown-dark text-white'}
      menuItems={menuItems}
      dark
      full
    >
      <div className="flex flex-col w-full h-dialog">
        {/* <Stepper
          steps={['Setup', 'Add items', 'Check details', 'Set price and quantities', 'Print labels']}
          disabled={[false, noVendor, noItems, noItems, noItems]}
          value={step}
          onChange={setStep}
        /> */}
        <div className="p-4">
          {stage === 'setup' && <SetupReceive setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />}
          {stage === 'add' && <AddReceiveItems setStage={setStage} setBypassConfirmDialog={setBypassConfirmDialog} />}
          {/* {step == 2 && <CheckDetails />}
          {step == 3 && <SetPriceAndQuantities />}
          {step == 4 && <PrintLabel receivedStock={receivedStock} />} */}
        </div>
      </div>
    </MidScreenContainer>
  )

  function isDisabled() {
    return (
      !batch?.vendorId ||
      batch?.batchList?.length === 0 ||
      batch?.batchList?.filter(
        (item) =>
          // !item?.item?.section ||
          item?.item?.isNew === null ||
          // (!item?.item?.is_new && !item?.item?.cond) ||
          !Number.isInteger(parseInt(`${item?.quantity}`)) ||
          !(
            (Number.isInteger(parseInt(`${item?.vendorCut}`)) && Number.isInteger(parseInt(`${item?.totalSell}`))) ||
            item?.item?.id
          ),
      ).length > 0
    )
  }
}
