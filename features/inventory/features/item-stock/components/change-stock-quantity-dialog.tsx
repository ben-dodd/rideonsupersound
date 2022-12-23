import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { useCurrentRegisterId } from 'lib/api/register'
import { changeStockQuantity, useStockItem, useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { ModalButton, StockMovementTypes } from 'lib/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Select from 'react-select'
import { useSWRConfig } from 'swr'

export default function ChangeStockQuantityDialog() {
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()
  const router = useRouter()
  const id = router.query.id
  const { mutate } = useSWRConfig()

  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const { registerId } = useCurrentRegisterId()
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
        await changeStockQuantity(
          {
            stockItem,
            quantity,
            movement,
            clerkId: clerk?.id,
            registerId,
            note,
          },
          id
        )
        mutate(`stock/${id}`)
        setAlert({
          open: true,
          type: 'success',
          message: `${
            movement === StockMovementTypes?.Adjustment
              ? 'STOCK QUANTITY ADJUSTED'
              : `STOCK MARKED AS ${movement?.toUpperCase()}`
          }`,
        })
        closeView(ViewProps.changeStockQuantityDialog)
        setSubmitting(false)
        setQuantity('')
        setNote('')
        setMovement(StockMovementTypes?.Received)
      },
      text: 'CHANGE QUANTITY',
    },
  ]

  return (
    <Modal
      open={view?.changeStockQuantityDialog}
      closeFunction={() => closeView(ViewProps.changeStockQuantityDialog)}
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
