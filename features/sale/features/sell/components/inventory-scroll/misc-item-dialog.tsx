import { useState } from 'react'
import { useInventory, useLogs } from 'lib/database/read'
import { ModalButton, StockObject } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logNewMiscItemCreated } from 'features/log/lib/functions'
import { getGeolocation, useWeather } from 'lib/api'
import { createStockItemInDatabase } from 'lib/database/create'
import dayjs from 'dayjs'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function MiscItemDialog() {
  const { clerk } = useClerk()
  const {
    cart,
    view,
    setCart,
    setAlert,
    openView,
    closeView,
    resetSellSearchBar,
  } = useAppStore()
  const { logs, mutateLogs } = useLogs()
  const { inventory, mutateInventory } = useInventory()
  const geolocation = getGeolocation()
  const { weather } = useWeather()
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
        resetSellSearchBar()
        let newMiscItem: StockObject = {
          isMiscItem: true,
          miscItemDescription: description,
          miscItemAmount: parseFloat(amount) * 100,
          note: notes,
        }
        const id = await createStockItemInDatabase(newMiscItem, clerk)
        mutateInventory([...inventory, { ...newMiscItem, id }], false)
        setSubmitting(false)
        clearDialog()

        // Add to cart
        let newItems = cart?.items || []
        newItems.push({
          itemId: id,
          quantity: '1',
          isMiscItem: true,
        })
        setCart({
          id: cart?.id || null,
          // REVIEW check the date to string thing works ok
          date_sale_opened: cart?.dateSaleOpened || dayjs.utc().format(),
          sale_opened_by: cart?.saleOpenedBy || clerk?.id,
          items: newItems,
          weather: cart?.weather || weather,
          geo_latitude: cart?.geoLatitude || geolocation?.latitude,
          geo_longitude: cart?.geoLongitude || geolocation?.longitude,
        })
        closeView(ViewProps.miscItemDialog)
        openView(ViewProps.cart)
        logNewMiscItemCreated(description, clerk, id)
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
        closeView(ViewProps.miscItemDialog)
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
