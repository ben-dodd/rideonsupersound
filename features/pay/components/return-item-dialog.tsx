import { useState } from 'react'
import { useInventory, useLogs, useSaleItemsForSale } from 'lib/database/read'
import { ModalButton, SaleItemObject, SaleStateTypes } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logSaleRefunded, saveSystemLog } from 'features/log/lib/functions'
import ItemListItem from './item-list-item'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function ReturnItemsDialog({ sale }) {
  const { clerk } = useClerk()
  const { cart, view, setCart, closeView, setAlert } = useAppStore()
  const { items, mutateSaleItems } = useSaleItemsForSale(sale?.id)
  const { logs, mutateLogs } = useLogs()
  const { inventory } = useInventory()

  // State
  const [refundItems, setRefundItems] = useState([])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
        saveSystemLog('RETURN ITEMS - OK clicked.', clerk?.id)
        const updatedCartItems = cart?.items?.map((item: SaleItemObject) =>
          refundItems.includes(item?.id)
            ? { ...item, isRefunded: true, refundNote: notes }
            : item
        )
        setCart({
          items: updatedCartItems,
          state:
            cart?.state === SaleStateTypes.Completed
              ? SaleStateTypes.InProgress
              : cart?.state,
        })
        closeDialog()
        logSaleRefunded(inventory, items, refundItems, sale, clerk)
        setAlert({
          open: true,
          type: 'success',
          message: `ITEM${refundItems?.length === 1 ? '' : 'S'} REFUNDED.`,
        })
      },
      text: 'COMPLETE',
    },
  ]

  // REVIEW allow returning less than the total quantity of an item

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
          ?.filter(
            (item: SaleItemObject) => !item?.isDeleted && !item?.isRefunded
          )
          ?.map((item: SaleItemObject) => (
            <div className="flex" key={item?.id}>
              <ItemListItem
                saleItem={item}
                selected={refundItems.includes(item?.id)}
                onClick={() => {
                  saveSystemLog(`ITEM ${item?.id} CLICKED`, clerk?.id)
                  let newRefundItems = [...refundItems]
                  if (refundItems?.includes(item?.id))
                    newRefundItems = newRefundItems.filter(
                      (x: number) => x !== item?.id
                    )
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
