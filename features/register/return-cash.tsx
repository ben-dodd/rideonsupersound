import { useState } from 'react'
import { ModalButton } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { savePettyCash, useCurrentRegisterId } from 'lib/api/register'
import { dollarsToCents, priceDollarsString } from 'lib/utils'
import dayjs from 'dayjs'

export default function ReturnCashDialog() {
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()

  // State
  const [amount, setAmount] = useState(0)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: submitting || amount === 0 || amount <= 0 || isNaN(amount),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        const pettyCash = {
          registerId,
          clerkId: clerk?.id,
          amount: dollarsToCents(amount),
          isTake: false,
          note,
          date: dayjs.utc().format(),
        }
        // const id = await savePettyCash(pettyCash)
        await savePettyCash(pettyCash)
        setAlert({
          open: true,
          type: 'success',
          message: `${priceDollarsString(amount)} put in the till.`,
        })
        setSubmitting(false)
        closeView(ViewProps.returnCashDialog)
        setAmount(0)
        setNote('')
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
          inputType="number"
          valueNum={amount}
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
