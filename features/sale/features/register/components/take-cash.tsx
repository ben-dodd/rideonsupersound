import { useState } from 'react'
import { useLogs, usePettyCash, useRegisterID } from 'lib/database/read'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { savePettyCashToRegister } from '../lib/functions'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegister } from 'lib/api/register'

export default function TakeCashDialog() {
  const { currentRegister } = useCurrentRegister()
  const { mutatePettyCash } = usePettyCash(currentRegister?.id)
  const { logs, mutateLogs } = useLogs()
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()

  // State
  const [amount, setAmount] = useState('0')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled:
        submitting ||
        parseFloat(amount) === 0 ||
        amount <= '' ||
        isNaN(parseFloat(amount)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        await savePettyCashToRegister(
          currentRegister?.id,
          clerk?.id,
          true,
          amount,
          notes
        )
        mutatePettyCash()
        setSubmitting(false)
        closeView(ViewProps.takeCashDialog)
        setAmount('0')
        setNotes('')
        setAlert({
          open: true,
          type: 'success',
          message: `$${
            amount ? parseFloat(amount).toFixed(2) : 0.0
          } taken from the till.`,
        })
      },
      text: 'TAKE IT!',
    },
  ]

  return (
    <Modal
      open={view?.takeCashDialog}
      closeFunction={() => closeView(ViewProps.takeCashDialog)}
      title={'TAKE CASH'}
      buttons={buttons}
    >
      <>
        <TextField
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={amount}
          error={amount && isNaN(parseFloat(amount))}
          autoFocus={true}
          selectOnFocus
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          className="mt-1"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
        />
      </>
    </Modal>
  )
}
