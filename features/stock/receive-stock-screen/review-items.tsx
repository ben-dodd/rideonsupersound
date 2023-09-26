import dayjs from 'dayjs'
import { CSVLink } from 'react-csv'
import { getBatchListCSVData } from 'lib/functions/printLabels'
import { useClerk } from 'lib/api/clerk'
import { dateYMD } from 'lib/types/date'
import { ArrowLeft, Done, Save } from '@mui/icons-material'
import { useAppStore } from 'lib/store'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { saveReceiveBatch } from 'lib/api/stock'
import { getItemCount, getItemList } from 'lib/functions/receiveStock'
import { useState } from 'react'
import StockListItem from '../stock-list/stock-list-item'

export default function ReviewItems({ setStage, setBypassConfirmDialog }) {
  const { clerk } = useClerk()
  const { batchReceiveSession, openConfirm, closeConfirm } = useAppStore()
  const [batchListLabelData, setBatchListLabelData] = useState('')
  const { mutate } = useSWRConfig()
  const router = useRouter()

  const completeReceiveBatch = (event, done) => {
    openConfirm({
      open: true,
      title: 'Receive Items?',
      yesText: 'Yes, Receive Items',
      noText: 'Cancel',
      action: () => {
        saveReceiveBatch({
          ...batchReceiveSession,
          completedByClerkId: clerk?.id,
          dateCompleted: dayjs.utc().format(),
          itemList: getItemList(batchReceiveSession?.batchList),
          itemCount: getItemCount(batchReceiveSession?.batchList),
        })
          .then((savedReceiveBatch) => {
            setBatchListLabelData(getBatchListCSVData(savedReceiveBatch?.batchList))
            mutate(`stock/receive/${savedReceiveBatch?.id}`, savedReceiveBatch)
            mutate(`stock/receive`)
            router.push(`/stock`)
            done()
          })
          .catch((e) => {
            done(false)
          })
        closeConfirm()
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
            <CSVLink
              className="icon-text-button-final"
              data={batchListLabelData}
              headers={['SKU', 'ARTIST', 'TITLE', 'NEW/USED', 'SELL PRICE', 'SECTION', 'BARCODE']}
              filename={`label-print-${dayjs().format(dateYMD)}.csv`}
              onClick={completeReceiveBatch}
              asyncOnClick={true}
            >
              COMPLETE RECEIVE <Done />
            </CSVLink>
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
                <StockListItem
                  key={batchItem?.key}
                  stockListItem={{ ...batchItem?.item, vendorId: batchReceiveSession?.vendorId }}
                  stockPrice={batchItem?.price}
                  stockQuantities={{ receiving: batchItem?.quantity }}
                />
              ))}
        </div>
      </div>
    </div>
  )
}
