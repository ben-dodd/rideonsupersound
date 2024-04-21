import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { cancelHold, useHoldsForItem } from 'lib/api/sale'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import { ModalButton } from 'lib/types'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

export default function CheckHoldsDialog() {
  const { sellPage, view, closeView, addCartItem, setPage } = useAppStore()
  const { activeItemId = null } = sellPage || {}
  const [selectedHold, setSelectedHold] = useState(null)
  const { itemHolds, isItemHoldsLoading } = useHoldsForItem(activeItemId)
  const { clerk } = useClerk()
  const { mutate } = useSWRConfig()
  console.log(itemHolds)

  const clearDialog = () => {
    closeView(ViewProps.checkHoldsDialog)
    setPage(Pages.sellPage, { activeItemId: null })
  }

  function handleAddItemToCart() {
    if (selectedHold) {
      const hold = itemHolds?.find((hold) => hold?.id === selectedHold)
      // Remove item from hold
      cancelHold(hold, clerk, true).then(() => {
        mutate(`sale/hold/item/${activeItemId}`)
        mutate(`sale/hold`)
      })
      addCartItem(
        { itemId: activeItemId, quantity: `${hold?.quantity || 1}`, holdId: hold?.id },
        clerk?.id,
        false,
        `ITEM TAKEN OFF HOLD FOR ${hold?.customerName?.toUpperCase()} AND ADDED TO CART.${
          hold?.quantity > 1 ? ` (ALL ${hold?.quantity} COPIES ON HOLD HAVE BEEN ADDED)` : ''
        }`,
      )
    } else {
      addCartItem({ itemId: activeItemId, quantity: '1' }, clerk?.id)
    }
    clearDialog()
  }

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      onClick: handleAddItemToCart,
      text: 'ADD ITEM',
    },
  ]

  return (
    <Modal
      open={view?.checkHoldsDialog}
      closeFunction={clearDialog}
      title={'CHECK HOLDS'}
      loading={isItemHoldsLoading}
      buttons={buttons}
    >
      <>
        <div>{`Item is on hold for ${itemHolds?.length} ${
          itemHolds?.length === 1 ? 'person' : 'people'
        }. If you are selling to ${itemHolds?.length === 1 ? '' : 'one of '}them, select from the list.`}</div>
        {itemHolds
          ?.filter((hold) => !hold?.dateRemovedFromHold)
          ?.map((hold) => (
            <div
              key={hold?.id}
              className={`p-4 cursor-pointer hover:bg-gray-100${
                selectedHold === hold?.id ? ' bg-selected hover:bg-selected' : ''
              } hover:bg-gray-100`}
              onClick={() => setSelectedHold(hold?.id)}
            >
              {hold?.customerName?.toUpperCase()}
            </div>
          ))}
        <div
          className={`p-4 cursor-pointer hover:bg-gray-100${!selectedHold ? ' bg-selected hover:bg-selected' : ''}`}
          onClick={() => setSelectedHold(null)}
        >
          NONE OF THE ABOVE
        </div>
      </>
    </Modal>
  )
}
