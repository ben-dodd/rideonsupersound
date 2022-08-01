// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import { alertAtom, cartAtom, clerkAtom, viewAtom } from 'lib/atoms'
import { useInventory, useLogs, useSaleItemsForSale } from 'lib/database/read'
import { ModalButton, SaleItemObject, SaleStateTypes } from 'lib/types'

// Functions
import { writeItemList } from 'lib/data-functions'
import { saveLog, saveSystemLog } from 'lib/db-functions'

// Components
import TextField from '@/components/inputs/text-field'
import Modal from '@/components/modal'
import ItemListItem from './item-list-item'

export default function ReturnItemsDialog({ sale }) {
  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)
  const [, setAlert] = useAtom(alertAtom)
  const [cart, setCart] = useAtom(cartAtom)

  // SWR
  const { items, mutateSaleItems } = useSaleItemsForSale(sale?.id)
  const { logs, mutateLogs } = useLogs()
  const { inventory } = useInventory()

  // State
  const [refundItems, setRefundItems] = useState([])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function closeDialog() {
    setView({ ...view, returnItemDialog: false })
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
            ? { ...item, is_refunded: true, refund_note: notes }
            : item
        )
        setCart({
          ...cart,
          items: updatedCartItems,
          state:
            cart?.state === SaleStateTypes.Completed
              ? SaleStateTypes.InProgress
              : cart?.state,
        })
        closeDialog()
        saveLog(
          {
            log: `${writeItemList(
              inventory,
              items?.filter((i: SaleItemObject) => refundItems?.includes(i?.id))
            )} refunded (sale #${sale?.id}).`,
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        )
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
            (item: SaleItemObject) => !item?.is_deleted && !item?.is_refunded
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
