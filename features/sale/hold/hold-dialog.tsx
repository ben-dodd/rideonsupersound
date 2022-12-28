import { useEffect, useState } from 'react'
import { ClerkObject, CustomerObject, HoldObject, ModalButton } from 'lib/types'

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import {
  logHoldAddedToSale,
  logRemoveFromHold,
  saveSystemLog,
} from 'lib/functions/log'
import { updateHoldInDatabase } from 'lib/database/update'
import dayjs from 'dayjs'
import { returnHoldToStock } from '../../../../../lib/functions/hold'
import HoldListItem from './list-item'
import { useWeather } from 'lib/api/external'
import { useAppStore } from 'lib/store'
import { useClerk, useClerks } from 'lib/api/clerk'
import { useCustomers } from 'lib/api/customer'
import { useCurrentRegisterId } from 'lib/api/register'
import { ViewProps } from 'lib/store/types'

export default function HoldDialog() {
  const { weather } = useWeather()
  // State
  const [geolocation, setGeolocation] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser')
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation(position?.coords)
        },
        () => console.log('Unable to retrieve location.')
      )
    }
  }, [])
  const { openView, setAlert, cart, setCart } = useAppStore()
  const { clerk } = useClerk()

  // SWR
  const { holds, isHoldsLoading, mutateHolds } = useHolds()
  const { inventory, mutateInventory } = useInventory()
  // const { logs, mutateLogs } = useLogs()
  const { customers } = useCustomers()
  const { clerks } = useClerks()
  const { registerId } = useCurrentRegisterId()

  // States
  const originalHold = holds?.find(
    (h: HoldObject) => h?.id === loadedHoldId[page]
  )
  const [hold, setHold] = useState(originalHold)
  const customerName = customers?.find(
    (c: CustomerObject) => c?.id === hold?.customer_id
  )?.name
  const clerkName = clerks?.find(
    (c: ClerkObject) => c?.id === hold?.started_by
  )?.name

  function closeDialog() {
    setLoadedHoldId({ ...loadedHoldId, [page]: 0 })
    setHold(null)
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      text: 'Return to Stock',
      onClick: () => {
        saveSystemLog('Hold dialog - Return hold to stock clicked.', clerk?.id)
        returnHoldToStock(
          hold,
          clerk,
          holds,
          mutateHolds,
          mutateInventory,
          registerId
        )
        closeDialog()
        logRemoveFromHold(hold, inventory, clerk)
        setAlert({
          open: true,
          type: 'success',
          message: `ITEM RETURNED TO STOCK FROM HOLD`,
        })
      },
    },
    {
      type: 'alt1',
      text: 'Add To Cart',
      onClick: addHoldToCart,
    },
    {
      type: 'ok',
      text: 'Update',
      disabled:
        (hold?.hold_period === originalHold?.hold_period &&
          hold?.note === originalHold?.note) ||
        isNaN(parseInt(hold?.hold_period)),
      onClick: () => {
        saveSystemLog('Hold dialog - Update hold clicked.', clerk?.id)
        if (hold?.hold_period !== null || hold?.note !== null) {
          const otherHolds = holds?.filter(
            (h: HoldObject) => h?.id !== loadedHoldId
          )
          mutateHolds([...otherHolds, hold], false)
          updateHoldInDatabase(hold)
        }
        closeDialog()
      },
    },
  ]

  return (
    <Modal
      open={Boolean(loadedHoldId[page])}
      closeFunction={closeDialog}
      title={'HOLD ITEM'}
      loading={isHoldsLoading}
      buttons={buttons}
    >
      <>
        <HoldListItem cartItem={hold} />
        <div>{`Item held for ${customerName} (hold set up by ${clerkName})`}</div>
        <div>{`Item held for ${dayjs().diff(hold?.date_from, 'day')} of ${
          hold?.hold_period || 30
        } days.`}</div>
        <TextField
          inputLabel="Hold Period"
          inputType="number"
          min={0}
          error={isNaN(parseInt(hold?.hold_period)) || hold?.hold_period < 0}
          valueNum={hold?.hold_period}
          onChange={(e: any) =>
            setHold({ ...hold, hold_period: e.target.value })
          }
        />
        <TextField
          inputLabel="Notes"
          className="mb-4"
          value={hold?.note}
          onChange={(e: any) => setHold({ ...hold, note: e.target.value })}
          multiline
        />
      </>
    </Modal>
  )

  function addHoldToCart() {
    // TODO do we need to check if it is another customer?
    saveSystemLog('Hold dialog - Add hold to cart.', clerk?.id)
    returnHoldToStock(
      hold,
      clerk,
      holds,
      mutateHolds,
      mutateInventory,
      registerID
    )
    closeDialog()

    let newItems = cart?.items || []
    let index = newItems.findIndex(
      (cartItem) => cartItem.itemId === hold?.item_id
    )
    if (index < 0)
      newItems.push({
        itemId: hold?.itemId,
        quantity: hold?.quantity,
      })
    else
      newItems[index].quantity = `${
        parseInt(newItems[index].quantity) + hold?.quantity
      }`
    setCart({
      sale: {
        id: cart?.id || null,
        dateSaleOpened: cart?.dateSaleOpened || dayjs.utc().format(),
        saleOpenedBy: cart?.saleOpenedBy || clerk?.id,
        state: cart?.state || null,
        customerId: cart?.customerId || null,
        laybyStartedBy: cart?.laybyStartedBy || null,
        dateLaybyStarted: cart?.dateLaybyStarted || null,
        weather: cart?.weather || weather,
        geoLatitude: cart?.geoLatitude || geolocation?.latitude,
        geoLongitude: cart?.geoLongitude || geolocation?.longitude,
      },
      items: newItems,
      transactions: cart?.transactions || [],
    })
    setPage('sell')
    openView(ViewProps.cart)
    logHoldAddedToSale(hold, inventory, cart, clerk)
    setAlert({
      open: true,
      type: 'success',
      message: `ITEM ADDED TO CART FROM HOLD`,
    })
  }
}
