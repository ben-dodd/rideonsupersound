import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logChangeQuantity } from 'features/log/lib/functions'
import {
  alertAtom,
  clerkAtom,
  loadedItemIdAtom,
  pageAtom,
  viewAtom,
} from 'lib/atoms'
import { createStockMovementInDatabase } from 'lib/database/create'
import { useInventory, useRegisterID, useStockItem } from 'lib/database/read'
import { ModalButton, StockMovementTypes } from 'lib/types'
import { useAtom } from 'jotai'
import { useState } from 'react'
import Select from 'react-select'

export default function ChangePriceDialog() {
  // Atoms
  const [loadedItemId] = useAtom(loadedItemIdAtom)
  const [clerk] = useAtom(clerkAtom)
  const [page] = useAtom(pageAtom)
  const [view, setView] = useAtom(viewAtom)
  const [, setAlert] = useAtom(alertAtom)

  // SWR
  const { inventory, mutateInventory } = useInventory()
  const { stockItem, isStockItemLoading, mutateStockItem } = useStockItem(
    loadedItemId[page]
  )
  const { registerID } = useRegisterID()

  // State
  const [movement, setMovement] = useState(StockMovementTypes?.Received)
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        quantity === undefined ||
        quantity === null ||
        movement === null ||
        isNaN(parseInt(quantity)) ||
        parseInt(quantity) < 0,
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        let originalQuantity = stockItem?.quantity
        let newQuantity = stockItem?.quantity
        let adjustment = parseInt(quantity)
        if (movement === StockMovementTypes?.Adjustment) {
          newQuantity = parseInt(quantity)
          adjustment = newQuantity - originalQuantity
        } else if (
          movement === StockMovementTypes?.Discarded ||
          movement === StockMovementTypes?.Lost ||
          movement === StockMovementTypes?.Returned
        ) {
          newQuantity -= adjustment
        } else {
          newQuantity += adjustment
        }
        mutateInventory(
          inventory?.map((i) =>
            i?.id === stockItem?.id ? { ...i, quantity: newQuantity } : i
          ),
          false
        )
        mutateStockItem(
          [
            {
              ...stockItem,
              quantity: newQuantity,
              [`quantity_${movement}`]:
                (stockItem[`quantity_${movement}`] || 0) + adjustment,
            },
          ],
          false
        )
        const stockMovementId = await createStockMovementInDatabase({
          item: {
            item_id: stockItem?.id,
            quantity:
              movement === StockMovementTypes?.Adjustment
                ? adjustment?.toString()
                : quantity,
          },
          clerk,
          registerID,
          act: movement,
          note,
        })
        setSubmitting(false)
        setView({ ...view, changeStockQuantityDialog: false })
        setMovement(null)
        setQuantity('')
        setNote('')
        logChangeQuantity(
          movement,
          stockItem,
          quantity,
          originalQuantity,
          newQuantity,
          clerk,
          stockMovementId
        )
        setAlert({
          open: true,
          type: 'success',
          message: `${
            movement === StockMovementTypes?.Adjustment
              ? 'STOCK QUANTITY ADJUSTED'
              : `STOCK MARKED AS ${movement?.toUpperCase()}`
          }`,
        })
      },
      text: 'CHANGE QUANTITY',
    },
  ]

  return (
    <Modal
      open={view?.changeStockQuantityDialog}
      closeFunction={() =>
        setView({ ...view, changeStockQuantityDialog: false })
      }
      title={'CHANGE STOCK QUANTITY'}
      buttons={buttons}
      loading={isStockItemLoading}
    >
      <>
        <Select
          className="w-full"
          value={{ value: movement, label: movement?.toUpperCase() }}
          options={[
            StockMovementTypes?.Received,
            StockMovementTypes?.Returned,
            StockMovementTypes?.Adjustment,
            StockMovementTypes?.Discarded,
            StockMovementTypes?.Found,
            StockMovementTypes?.Lost,
          ].map((m: string) => ({
            value: m,
            label: m?.toUpperCase(),
          }))}
          onChange={(item: any) => setMovement(item?.value)}
        />
        <div className="help-text">
          {movement === StockMovementTypes?.Received
            ? 'Enter the number of items received from the vendor. Use this option for receiving new copies of items from vendor.'
            : movement === StockMovementTypes?.Returned
            ? 'Enter the number of items returned to the vendor. Use this option when vendor takes stock out of the shop.'
            : movement === StockMovementTypes?.Adjustment
            ? 'Enter the quantity of items currently in stock. Use this option for stock taking.'
            : movement === StockMovementTypes?.Discarded
            ? 'Enter the number of items discarded. Use this option for items that are not in a condition to sell.'
            : movement === StockMovementTypes?.Found
            ? 'Enter the number of items found. Use this option when uncounted stock has been discovered.'
            : 'Enter the number of items lost. Use this option when items are missing from stock.'}
        </div>
        <TextField
          inputLabel="Quantity"
          divClass="text-4xl"
          value={quantity}
          onChange={(e: any) => setQuantity(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          value={note}
          onChange={(e: any) => setNote(e.target.value)}
          multiline
          rows={3}
        />
      </>
    </Modal>
  )
}
