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

  return (
    <div className={`flex w-full border-b border-yellow-100 py-1 text-sm`}>
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row w-3/5">
          <div className="mx-2">
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
          <div>{`${getItemSkuDisplayNameById(item?.id, inventory)}${
            item?.format ? ` (${item?.format})` : ''
          }`}</div>
        </div>
      </div>
    </div>
  )
}
