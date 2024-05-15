import Modal from 'components/modal'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'

const ReturnHoldToCartDialog = () => {
  const {
    pages: { salesPage },
    setPage,
  } = useAppStore()
  const { returnToCartDialog: { open = false, hold = {}, onClick = null } = {} } = salesPage || {}
  const closeDialog = () => {
    setPage(Pages.salesPage, { returnToCartDialog: {} })
  }

  const addItemToCart = (replaceCurrentCart = false) => {
    onClick && onClick(replaceCurrentCart)
    closeDialog()
  }

  const buttons = [
    // {
    //   type: 'cancel',
    //   text: 'CANCEL',
    //   onClick: closeDialog,
    // },
    { type: 'alt1', text: 'REPLACE CURRENT CART', onClick: () => addItemToCart(true) },
    {
      type: 'ok',
      text: 'ADD TO CART',
      onClick: addItemToCart,
    },
  ]
  return (
    <Modal open={open} closeFunction={closeDialog} title={'LOAD HOLD TO CART'} buttons={buttons}>
      <div>
        {`There is already a cart in progress. Do you want to add the hold item (${getItemSkuDisplayName(
          hold,
        )}) to this cart or park the current cart?`}
      </div>
    </Modal>
  )
}

export default ReturnHoldToCartDialog
