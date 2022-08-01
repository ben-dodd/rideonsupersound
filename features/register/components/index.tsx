// Packages
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

// DB
import { alertAtom, bypassRegisterAtom, clerkAtom, pageAtom } from 'lib/atoms'
import { useLogs, useRegisterID } from 'lib/database/read'
import { RegisterObject, TillObject } from 'lib/types'

// Functions
import { getAmountFromCashMap } from 'lib/data-functions'
import { saveAndOpenRegister, saveLog } from 'lib/db-functions'

// Components
import TextField from '@/components/inputs/text-field'
import OpenIcon from '@mui/icons-material/ShoppingCart'
import CircularProgress from '@mui/material/CircularProgress'
import CashMap from './cash-map'

export default function OpenRegisterScreen() {
  // SWR
  const { registerID, mutateRegisterID } = useRegisterID()
  const { logs, mutateLogs } = useLogs()

  // Atoms
  const [, setAlert] = useAtom(alertAtom)
  const [clerk] = useAtom(clerkAtom)
  const [page] = useAtom(pageAtom)
  const [, setBypassRegister] = useAtom(bypassRegisterAtom)

  // State
  const [till, setTill] = useState({})
  const [notes, setNotes] = useState('')
  const [openAmount, setOpenAmount]: [string, Function] = useState(
    `${getAmountFromCashMap(till)}`
  )
  const [loading, setLoading] = useState(false)

  // Load
  useEffect(() => {
    const amount = getAmountFromCashMap(till)
    setOpenAmount(!isNaN(amount) ? amount?.toFixed(2) : '0')
  }, [till])

  // Functions
  async function openRegister() {
    const register: RegisterObject = {
      opened_by_id: clerk?.id,
      open_amount: openAmount ? parseFloat(openAmount) * 100 : 0,
      open_note: notes || null,
    }
    setLoading(true)
    // Save register to DB and mutate register with returned ID number
    await mutateRegisterID(
      saveAndOpenRegister(register, till, clerk, logs, mutateLogs),
      false
    )
    setLoading(false)

    // Reset State
    setTill({})
    setNotes('')
    setOpenAmount('0')

    setAlert({
      open: true,
      type: 'success',
      message: 'REGISTER OPENED',
    })
    saveLog(
      {
        log: `Register opened with $${
          openAmount ? parseFloat(openAmount) : 0
        } in the till.`,
        clerk_id: clerk?.id,
        table_id: 'register',
        row_id: registerID,
      },
      logs,
      mutateLogs
    )
  }

  function isError(till: TillObject) {
    let error = false
    ;[
      'one_hundred_dollar',
      'fifty_dollar',
      'twenty_dollar',
      'ten_dollar',
      'five_dollar',
      'two_dollar',
      'one_dollar',
      'fifty_cent',
      'twenty_cent',
      'ten_cent',
    ].forEach((denom) => {
      if (
        till[denom] &&
        (isNaN(parseInt(till[denom])) || parseInt(till[denom]) < 0)
      )
        error = true
    })
    return error
  }

  // Constants
  const invalidOpenAmount = isNaN(parseFloat(`${openAmount}`))

  return (
    <div
      className={`flex justify-center bg-white h-menu${
        page !== 'sell' || registerID > 0 ? ' hidden' : ''
      }`}
    >
      <div className="flex flex-col justify-center h-full pt-4 max-w-md">
        <div className="flex justify-center text-5xl font-bold pb-4">
          REGISTER CLOSED
        </div>
        <div className="text-sm">
          Open register by entering the total float in the till. Either enter
          the notes and coins or enter the total directly.
        </div>
        <TextField
          startAdornment="$"
          inputLabel="Total Float"
          divClass="text-6xl"
          selectOnFocus
          error={isError(till)}
          value={`${openAmount}`}
          onChange={(e: any) => setOpenAmount(e.target.value)}
        />
        <CashMap till={till} setTill={setTill} />
        <TextField
          inputLabel="Notes"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
        />
        <div className="flex">
          <button
            className="modal__button--cancel"
            onClick={() => setBypassRegister(true)}
          >
            Bypass Register
          </button>
          <button
            disabled={isError(till) || invalidOpenAmount || loading}
            className="modal__button--ok"
            onClick={openRegister}
          >
            {loading ? (
              <span className="pr-4">
                <CircularProgress color="inherit" size={18} />
              </span>
            ) : (
              <OpenIcon className="mr-2" />
            )}
            Open Register
          </button>
        </div>
      </div>
    </div>
  )
}
