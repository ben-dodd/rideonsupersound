import { useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import ItemListItem from '../sale-summary/item-list-item'
import { SaleItemObject, SaleStateTypes } from 'lib/types/sale'
import { saveCart } from 'lib/api/sale'
import { useSWRConfig } from 'swr'

export default function ReturnItemDialog({ saleObject }) {
  const { view, closeView, setAlert } = useAppStore()
  const { items = [], sale = {} } = saleObject || {}
  const [refundItems, setRefundItems] = useState([])
  const [notes, setNotes] = useState('')
  const [submitting] = useState(false)
  const { mutate } = useSWRConfig()

  function closeDialog() {
    closeView(ViewProps.returnItemDialog)
    setRefundItems([])
    setNotes('')
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: 'ok',
      loading: submitting,
      onClick: async () => {
        const updatedCartItems = items?.map((item: SaleItemObject) =>
          refundItems.includes(item?.id) ? { ...item, isRefunded: true, refundNote: notes } : item,
        )
        await saveCart(
          {
            ...saleObject,
            items: updatedCartItems,
            sale: { ...saleObject?.sale, state: SaleStateTypes.InProgress },
          },
          saleObject?.state,
          mutate,
        )
        closeDialog()
        setAlert({
          open: true,
          type: 'success',
          message: `ITEM${refundItems?.length === 1 ? '' : 'S'} REFUNDED.`,
        })
      },
      text: 'COMPLETE',
    },
  ]

  // TODO allow returning less than the total quantity of an item

  return (
    <Modal
      open={view?.returnItemDialog}
      closeFunction={closeDialog}
      title={'REFUND ITEMS'}
      buttons={buttons}
      width="max-w-xl"
    >
      <>
        <div className="help-text">Select items to return.</div>
        {items
          ?.filter((item: SaleItemObject) => !item?.isDeleted && !item?.isRefunded)
          ?.map((item: SaleItemObject) => (
            <div className="flex" key={item?.id}>
              <ItemListItem
                saleItem={item}
                selected={refundItems.includes(item?.id)}
                onClick={() => {
                  let newRefundItems = [...refundItems]
                  if (refundItems?.includes(item?.id))
                    newRefundItems = newRefundItems.filter((x: number) => x !== item?.id)
                  else newRefundItems.push(item?.id)
                  setRefundItems(newRefundItems)
                }}
              />
            </div>
          ))}
        <TextField
          inputLabel="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
        />
      </>
    </Modal>
  )
}
