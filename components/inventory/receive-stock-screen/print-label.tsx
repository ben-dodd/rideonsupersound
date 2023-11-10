import { clerkAtom } from '@/lib/atoms'
import {
  getCSVData,
  getImageSrc,
  getItemDisplayName,
  getItemSku,
} from '@/lib/data-functions'
import { saveLog } from '@/lib/db-functions'
import { useLogs } from '@/lib/swr-hooks'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { CSVLink } from 'react-csv'

export default function PrintLabel({ receivedStock }) {
  const { logs, mutateLogs } = useLogs()
  const [clerk] = useAtom(clerkAtom)
  const totalItemCount = receivedStock?.reduce(
    (prev, curr) => prev + parseInt(curr?.quantity),
    0
  )

  console.log('print label screen', receivedStock)

  function getStock() {
    let res = []
    receivedStock?.forEach((receiveItem) => {
      ;[...Array(parseInt(receiveItem?.quantity))]?.forEach(() =>
        res.push(receiveItem?.item)
      )
    })
    return res
  }

  return (
    <div>
      <div className="my-4 w-2/5">
        <div className="font-bold mb-4">{`Successfully received ${totalItemCount} ${
          totalItemCount > 1 ? 'items' : 'item'
        }...`}</div>
        {receivedStock?.map((item) => (
          <div className="flex justify-between mb-2" key={item?.item?.id}>
            <div className="w-20">
              <div className="w-20 h-20 relative">
                <img
                  className="object-cover absolute"
                  // layout="fill"
                  // objectFit="cover"
                  src={getImageSrc(item?.item)}
                  alt={item?.title || 'Inventory image'}
                />
                {!item?.item?.is_gift_card &&
                  !item?.item?.is_misc_item &&
                  item?.item?.id && (
                    <div className="absolute w-20 h-8 bg-opacity-50 bg-black text-white text-sm flex justify-center items-center">
                      {getItemSku(item?.item)}
                    </div>
                  )}
              </div>
            </div>
            <div>
              <div>{`${getItemDisplayName(item?.item)}`}</div>
              <div className="text-xl font-bold text-right">{` x ${item?.quantity}`}</div>
            </div>
          </div>
        ))}
      </div>
      <CSVLink
        className={`bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded`}
        data={getCSVData(getStock())}
        headers={[
          'SKU',
          'ARTIST',
          'TITLE',
          'NEW/USED',
          'SELL PRICE',
          'SECTION',
          'BARCODE',
        ]}
        filename={`label-print-${dayjs().format('YYYY-MM-DD')}.csv`}
        onClick={() =>
          saveLog(
            {
              log: 'Labels printed from receive stock dialog.',
              clerk_id: clerk?.id,
            },
            logs,
            mutateLogs
          )
        }
      >
        PRINT LABELS
      </CSVLink>
    </div>
  )
}
