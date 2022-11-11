import { cartAtom } from '@lib/atoms'
import { useJobs } from '@lib/database/read'
import { useInventory } from '@lib/database/read'
import { SaleItemObject, StockObject, TaskObject } from '@lib/types'
import { useAtom } from 'jotai'
import Menu from './components/menu'

// Types
type MenuType = {
  type: string
  page: string
  text: string
  badge: any
  class: string
  icon: any
  onClick: any
}

export default function MenuView() {
  const [cart] = useAtom(cartAtom)

  const { jobs } = useJobs()
  const { inventory } = useInventory()

  const numCartItems = cart?.items?.reduce?.(
    (accumulator: number, item: SaleItemObject) =>
      accumulator + (parseInt(item?.quantity) || 1),
    0
  )

  const numJobsToDo =
    (jobs?.filter?.((t: TaskObject) => !t?.is_deleted && !t?.is_completed)
      ?.length || 0) +
    (inventory?.filter?.((i: StockObject) => i?.needs_restock)?.length || 0)

  return <Menu badges={{ numCartItems, numJobsToDo }} />
}
