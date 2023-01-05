// Packages
import TextField from 'components/inputs/text-field'
import { logOpenRegister } from 'lib/functions/log'
import { RegisterObject, TillObject } from 'lib/types'
import OpenIcon from '@mui/icons-material/ShoppingCart'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import CashMap from './cash-map'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { useCurrentRegisterId } from 'lib/api/register'
import { getAmountFromCashMap } from 'lib/functions/register'

export default function OpenRegisterScreen() {
  const { clerk } = useClerk()
  const { registerId } = useCurrentRegisterId()
  const { setAlert } = useAppStore()

  // State
  const [till, setTill] = useState({})
  const [notes, setNotes] = useState('')
  const [openAmount, setOpenAmount]: [string, Function] = useState(`${getAmountFromCashMap(till)}`)
  const [loading, setLoading] = useState(false)

  // Load
  useEffect(() => {
    const amount = getAmountFromCashMap(till)
    setOpenAmount(!isNaN(amount) ? amount?.toFixed(2) : '0')
  }, [till])

  // Functions
  async function openRegister() {
    const register: RegisterObject = {
      openedById: clerk?.id,
      openAmount: openAmount ? parseFloat(openAmount) * 100 : 0,
      openNote: notes || null,
    }
    setLoading(true)
    // Save register to DB and mutate register with returned ID number
    await mutateRegisterID(saveAndOpenRegister(register, till, clerk, logs, mutateLogs), false)
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
    logOpenRegister(clerk, openAmount, registerId)
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
      if (till[denom] && (isNaN(parseInt(till[denom])) || parseInt(till[denom]) < 0)) error = true
    })
    return error
  }

  // Constants
  const invalidOpenAmount = isNaN(parseFloat(`${openAmount}`))

  return (
    <div className={`flex justify-center bg-white h-main${page !== 'sell' || registerId > 0 ? ' hidden' : ''}`}>
      <div className="flex flex-col justify-center h-full pt-4 max-w-md">
        <div className="flex justify-center text-5xl font-bold pb-4">REGISTER CLOSED</div>
        <div className="text-sm">
          Open register by entering the total float in the till. Either enter the notes and coins or enter the total
          directly.
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
        <TextField inputLabel="Notes" value={notes} onChange={(e: any) => setNotes(e.target.value)} multiline />
        <div className="flex">
          <button className="modal__button--cancel" onClick={() => setBypassRegister(true)}>
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
