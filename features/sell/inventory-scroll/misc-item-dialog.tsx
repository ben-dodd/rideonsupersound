import { useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { createStockItem } from 'lib/api/stock'

export default function MiscItemDialog() {
  const { clerk } = useClerk()
  const { view, addCartItem, setAlert, closeView } = useAppStore()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const clearDialog = () => {
    setDescription('')
    setAmount('')
    setNote('')
    closeView(ViewProps.miscItemDialog)
  }

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: amount === '' || isNaN(parseFloat(amount)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        const newMiscItem = await createStockItem(
          {
            isMiscItem: true,
            miscItemDescription: description,
            miscItemAmount: parseFloat(amount) * 100,
            note,
          },
          clerk,
        )
        setSubmitting(false)
        addCartItem(
          {
            itemId: newMiscItem?.id,
            quantity: '1',
            isMiscItem: true,
            note,
          },
          clerk?.id,
        )
        clearDialog()
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
        <TextField inputLabel="Description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
        <TextField inputLabel="Notes" value={note} onChange={(e: any) => setNote(e.target.value)} multiline rows={3} />
      </>
    </Modal>
  )
}
