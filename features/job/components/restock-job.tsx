// DB
import {
  getItemDisplayName,
  getItemSkuDisplayName,
} from '@/features/inventory/features/display-inventory/lib/functions'
import { saveLog } from '@/features/log/lib/functions'
import { useAtom } from 'jotai'
import { clerkAtom } from 'lib/atoms'
import { useInventory, useLogs } from 'lib/database/read'
import { StockObject } from 'lib/types'
import { completeRestockTask } from '../lib/functions'

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
          <div>{getItemSkuDisplayName(item?.id, inventory)}</div>
        </div>
      </div>
    </div>
  )
}
