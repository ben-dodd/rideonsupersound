import { useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import ItemListItem from '../sale-summary/static-sale-item'
import { SaleItemObject, SaleStateTypes } from 'lib/types/sale'

export default function ReturnItemsDialog({ sale }) {
  const { cart, view, setCart, setCartSale, closeView, setAlert } = useAppStore()
  const { items = [] } = cart || {}
  const [refundItems, setRefundItems] = useState([])
  const [notes, setNotes] = useState('')
  const [submitting] = useState(false)

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
      onClick: () => {
        const updatedCartItems = cart?.items?.map((item: SaleItemObject) =>
          refundItems.includes(item?.id) ? { ...item, isRefunded: true, refundNote: notes } : item,
        )
        setCart({
          items: updatedCartItems,
        })
        setCartSale({
          state: sale?.state === SaleStateTypes.Completed ? SaleStateTypes.InProgress : sale?.state,
        })
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
      title={'RETURN ITEMS'}
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
