import { ModalButton } from 'lib/types'
import { updateStockItem } from 'lib/api/stock'
import { useState } from 'react'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import Modal from 'components/modal'
import { useSWRConfig } from 'swr'
import { StockItemObject } from 'lib/types/stock'
import { getObjectDifference } from 'lib/utils'
import StockEditForm from './form'

export default function StockEditDialog({ stockItem: { item: currItem } }) {
  const { view, closeView, setAlert } = useAppStore()
  const [item, setItem]: [StockItemObject, Function] = useState(currItem || {})
  const { mutate } = useSWRConfig()

  const [submitting, setSubmitting] = useState(false)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: false,
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        const update = getObjectDifference(item, currItem)
        await updateStockItem(update, currItem?.id)
        mutate(`stock/${currItem?.id}`)
        setSubmitting(false)
        closeView(ViewProps.stockEditDialog)
        setAlert({
          open: true,
          type: 'success',
          message: `STOCK ITEM UPDATED`,
        })
      },
      text: 'UPDATE ITEM',
    },
  ]

  return (
    <Modal
      open={view?.stockEditDialog}
      closeFunction={() => closeView(ViewProps.stockEditDialog)}
      title={'EDIT ITEM'}
      buttons={buttons}
      loading={false}
      width="max-w-screen-md"
    >
      <StockEditForm item={item} setItem={setItem} />
    </Modal>
  )
}
