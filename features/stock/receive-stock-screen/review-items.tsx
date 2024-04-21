import dayjs from 'dayjs'
import { useClerk } from 'lib/api/clerk'
import { ArrowLeft, Done, Save } from '@mui/icons-material'
import { useAppStore } from 'lib/store'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { saveReceiveBatch } from 'lib/api/stock'
import { getItemCount, getItemList } from 'lib/functions/receiveStock'
import StockListItem from '../stock-list-item'

export default function ReviewItems({ setStage, setBypassConfirmDialog }) {
  const { clerk } = useClerk()
  const { batchReceiveSession, openConfirm, closeConfirm } = useAppStore()
  const { mutate } = useSWRConfig()
  const router = useRouter()

  const completeReceiveBatch = () => {
    openConfirm({
      open: true,
      title: 'Receive Items?',
      yesText: 'Yes, Receive Items',
      noText: 'Cancel',
      action: () => {
        setBypassConfirmDialog(true)
        saveReceiveBatch(
          {
            ...batchReceiveSession,
            completedByClerkId: clerk?.id,
            dateCompleted: dayjs.utc().format(),
            itemList: getItemList(batchReceiveSession?.batchList),
            itemCount: getItemCount(batchReceiveSession?.batchList),
          },
          true,
        )
          .then((savedReceiveBatch) => {
            mutate(`stock/receive/${savedReceiveBatch?.id}`, savedReceiveBatch)
            mutate(`stock/receive`)
            closeConfirm()
            router.push(`/stock`)
          })
          .catch(() => {
            closeConfirm()
          })
      },
    })
  }

  return (
    <div>
      <div className="w-full">
        <div className="flex justify-between p-2">
          <div>
            <div className="text-2xl">REVIEW ITEMS</div>
            <div className="help-text max-w-50">
              <p>Check all details are correct.</p>
              <p>
                Click <b>COMPLETE RECEIVE</b> to receive the items and download the CSV file for the label printer.
              </p>
            </div>
          </div>
          <div className="px-4">
            <div className="icon-text-button-final" onClick={completeReceiveBatch}>
              COMPLETE RECEIVE <Done />
            </div>
            <div className="icon-text-button" onClick={() => setStage('configure')}>
              BACK TO CONFIGURE <ArrowLeft />
            </div>
            <div
              className="icon-text-button"
              onClick={() => {
                saveReceiveBatch(batchReceiveSession).then((savedBatchPayment) => {
                  mutate(`vendor/payment/batch/${savedBatchPayment?.id}`, savedBatchPayment)
                  setBypassConfirmDialog(true)
                  router.push('/stock')
                })
              }}
            >
              SAVE AND CLOSE <Save />
            </div>
          </div>
        </div>
        <div className="h-dialog overflow-y-scroll">
          {batchReceiveSession?.batchList?.length === 0
            ? 'NO ITEMS'
            : batchReceiveSession?.batchList?.map((batchItem) => (
                // eslint-disable-next-line react/jsx-no-undef
                <StockListItem
                  key={batchItem?.key}
                  stockListItem={{
                    ...batchItem,
                    item: { ...batchItem?.item, vendorId: batchReceiveSession?.vendorId },
                  }}
                  noClick={true}
                />
              ))}
        </div>
      </div>
    </div>
  )
}
