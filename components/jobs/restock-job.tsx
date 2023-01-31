// DB
import { clerkAtom } from '@/lib/atoms'
import {
  getItemDisplayName,
  getItemSkuDisplayNameById,
} from '@/lib/data-functions'
import { completeRestockTask, saveLog } from '@/lib/db-functions'
import { useInventory, useLogs } from '@/lib/swr-hooks'
import { StockObject } from '@/lib/types'
import { useAtom } from 'jotai'

type ListItemProps = {
  item: StockObject
}

export default function RestockJob({ item }: ListItemProps) {
  // SWR
  const { inventory, mutateInventory } = useInventory()
  const { logs, mutateLogs } = useLogs()
  const [clerk] = useAtom(clerkAtom)
  console.log(inventory?.find((stock) => stock?.id === item?.id))

  return (
    <div
      className={`flex w-full border-b border-yellow-100 py-1 text-sm hover:bg-gray-100`}
    >
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="w-1/12">
            <input
              className="cursor-pointer"
              type="checkbox"
              onChange={() => {
                mutateInventory(
                  inventory?.map((i) =>
                    i?.id === item?.id ? { ...item, needs_restock: false } : i
                  ),
                  false
                )
                completeRestockTask(item?.id)
                saveLog(
                  {
                    log: `${getItemDisplayName(item)} restocked.`,
                    clerk_id: clerk?.id,
                  },
                  logs,
                  mutateLogs
                )
              }}
            />
          </div>
          <div className="w-1/6">{item?.format || ''}</div>
          <div className="w-7/12">{`${getItemSkuDisplayNameById(
            item?.id,
            inventory
          )}`}</div>
          <div
            className={`w-1/6 font-bold${
              item?.quantity < 1 ? ' text-red-500' : ''
            }`}
          >{`${item?.quantity} in Stock`}</div>
        </div>
      </div>
    </div>
  )
}
