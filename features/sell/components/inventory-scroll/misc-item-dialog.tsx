// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import {
  alertAtom,
  cartAtom,
  clerkAtom,
  sellSearchBarAtom,
  viewAtom,
} from '@/lib/atoms'
import { useInventory, useLogs, useWeather } from '@/lib/swr-hooks'
import { ModalButton, StockObject } from '@/lib/types'

// Functions
import { getGeolocation } from '@/lib/data-functions'
import { saveLog, saveStockToDatabase } from '@/lib/db-functions'

// Components
import TextField from '@/components/inputs/text-field'
import Modal from '@/components/modal'
import dayjs from 'dayjs'

export default function MiscItemDialog() {
  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)
  const [, setAlert] = useAtom(alertAtom)
  const [cart, setCart] = useAtom(cartAtom)
  const [, setSearch] = useAtom(sellSearchBarAtom)

  // SWR
  const { logs, mutateLogs } = useLogs()
  const { inventory, mutateInventory } = useInventory()
  const geolocation = getGeolocation()
  const { weather } = useWeather()

  // State
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function clearDialog() {
    setDescription('')
    setAmount('')
    setNotes('')
  }

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: amount === '' || isNaN(parseFloat(amount)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        setSearch('')
        let newMiscItem: StockObject = {
          is_misc_item: true,
          misc_item_description: description,
          misc_item_amount: parseFloat(amount) * 100,
          note: notes,
        }
        const id = await saveStockToDatabase(newMiscItem, clerk)
        mutateInventory([...inventory, { ...newMiscItem, id }], false)
        setSubmitting(false)
        clearDialog()

        // Add to cart
        let newItems = cart?.items || []
        newItems.push({
          item_id: id,
          quantity: '1',
          is_misc_item: true,
        })
        setCart({
          id: cart?.id || null,
          // REVIEW check the date to string thing works ok
          date_sale_opened: cart?.date_sale_opened || dayjs.utc().format(),
          sale_opened_by: cart?.sale_opened_by || clerk?.id,
          items: newItems,
          weather: cart?.weather || weather,
          geo_latitude: cart?.geo_latitude || geolocation?.latitude,
          geo_longitude: cart?.geo_longitude || geolocation?.longitude,
        })
        setView({ ...view, miscItemDialog: false, cart: true })
        saveLog(
          {
            log: `New misc item (${description}) created and added to cart.`,
            clerk_id: clerk?.id,
            table_id: 'stock',
            row_id: id,
          },
          logs,
          mutateLogs
        )
        setAlert({
          open: true,
          type: 'success',
          message: `NEW MISC ITEM CREATED`,
        })
      },
      text: 'CREATE MISC ITEM',
    },
  ]

  return (
    <Modal
      open={view?.miscItemDialog}
      closeFunction={() => {
        clearDialog()
        setView({ ...view, miscItemDialog: false })
      }}
      title={'CREATE MISC ITEM'}
      buttons={buttons}
    >
      <>
        <TextField
          autoFocus
          className="mt-8"
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          inputLabel="Total Cost"
          value={amount}
          error={isNaN(parseFloat(amount))}
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <TextField
          inputLabel="Description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
          rows={3}
        />
      </>
    </Modal>
  )
}
