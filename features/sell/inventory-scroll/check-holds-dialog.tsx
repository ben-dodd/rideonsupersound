import Modal from 'components/modal'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function CheckHoldsDialog() {
  const { view, closeView, addCartItem } = useAppStore()

  const clearDialog = () => {
    closeView(ViewProps.checkHoldsDialog)
  }

  // function handleAddItemToCart() {
  //   addCartItem({ itemId: item?.id, quantity: '1' }, clerk?.id)
  // }

  return (
    <Modal open={view?.checkHoldsDialog} closeFunction={clearDialog} title={'CHECK HOLDS'}>
      <>
        <div>Item is on hold for X people.</div>
        <div onClick={clearDialog}>Its OK</div>
      </>
    </Modal>
  )
}
