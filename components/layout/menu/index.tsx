import { SaleItemObject } from 'lib/types'
import Menu from './components/menu'
import { useAppStore } from 'lib/store'
import { useRestockList } from 'lib/api/stock'
import { useJobsToDo } from 'lib/api/jobs'

export default function MenuView() {
  const { cart } = useAppStore()
  const { jobsToDo } = useJobsToDo()
  const { restockList } = useRestockList()

  const numCartItems = cart?.items?.reduce?.(
    (accumulator: number, item: SaleItemObject) =>
      accumulator + (parseInt(item?.quantity) || 1),
    0
  )

  const numJobsToDo = (jobsToDo?.length || 0) + (restockList?.length || 0)

  return <Menu badges={{ numCartItems, numJobsToDo }} />
}
