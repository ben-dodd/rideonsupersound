// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import { alertAtom, clerkAtom, viewAtom } from 'lib/atoms'
import { useLogs, usePettyCash, useRegisterID } from 'lib/database/read'
import { ModalButton } from 'lib/types'

// Functions
import { savePettyCashToRegister } from 'lib/db-functions'

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'

export default function TakeCashDialog() {
  // SWR
  const { registerID } = useRegisterID()
  const { mutatePettyCash } = usePettyCash(registerID)
  const { logs, mutateLogs } = useLogs()

  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [, setAlert] = useAtom(alertAtom)
  const [view, setView] = useAtom(viewAtom)

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
          registerID,
          clerk?.id,
          true,
          amount,
          notes,
          logs,
          mutateLogs
        )
        mutatePettyCash()
        setSubmitting(false)
        setView({ ...view, takeCashDialog: false })
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
      closeFunction={() => setView({ ...view, takeCashDialog: false })}
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
