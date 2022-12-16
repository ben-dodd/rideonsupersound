import { useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegister, useCurrentRegisterId } from 'lib/api/register'
import { dollarsToCents } from 'lib/utils'
import dayjs from 'dayjs'

export default function ReturnCashDialog() {
  const { currentRegister } = useCurrentRegister()
  // const { pettyCash, mutatePettyCash } = usePettyCash(currentRegister?.id)
  // const { logs, mutateLogs } = useLogs()
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()
  const { registerId } = useCurrentRegisterId()

  // State
  const [amount, setAmount] = useState('0')
  const [note, setNote] = useState('')
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
        const pettyCash = {
          registerId,
          clerk_id: clerk?.id,
          amount: dollarsToCents(amount),
          isTake: false,
          note,
          date: dayjs.utc().format(),
        }
        const id = await savePettyCash(pettyCash)
        setSubmitting(false)
        closeView(ViewProps.returnCashDialog)
        setAmount('0')
        setNote('')
        setAlert({
          open: true,
          type: 'success',
          message: `$${
            amount ? parseFloat(amount).toFixed(2) : 0.0
          } put in the till.`,
        })
      },
      text: 'ADD THE CASH',
    },
  ]

  return (
    <Modal
      open={view?.returnCashDialog}
      closeFunction={() => closeView(ViewProps.returnCashDialog)}
      title={'ADD CASH'}
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
          value={note}
          onChange={(e: any) => setNote(e.target.value)}
          multiline
        />
      </>
    </Modal>
  )
}
