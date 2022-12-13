// Packages
import { useEffect, useState } from 'react'
import { ModalButton, StockObject } from 'lib/types'
import InventoryItemForm from 'features/inventory/features/item-inventory/components/inventory-item-form'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { useStockItem } from 'lib/api/stock'
import Loading from 'components/loading'
import Layout from 'components/layout'
import ScreenContainer from 'components/container/screen'

export default function InventoryItemScreen() {
  const router = useRouter()
  const { id } = router.query
  const { openConfirm } = useAppStore()
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const [item, setItem]: [StockObject, Function] = useState(stockItem)

  useEffect(() => {
    const exitingFunction = () => {
      console.log('exiting...')
    }
    router.events.on('routeChangeStart', exitingFunction)
    return () => router.events.off('routeChangeStart', exitingFunction)
  }, [])

  const handleCancelClick = () => {
    router.push(`../${id}`)
  }

  const handleSaveClick = () => {
    router.push(`../${id}`)
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: handleCancelClick,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: handleSaveClick,
      text: 'SAVE',
    },
  ]

  return (
    <ScreenContainer loading={isStockItemLoading} buttons={buttons}>
      <InventoryItemForm />
    </ScreenContainer>
  )
}

InventoryItemScreen.getLayout = (page) => <Layout>{page}</Layout>
