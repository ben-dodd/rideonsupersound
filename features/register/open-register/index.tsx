// Packages
import TextField from 'components/inputs/text-field'
import { useEffect, useState } from 'react'
import CashMap from '../cash-map'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { getAmountFromCashMap } from 'lib/functions/register'
import { TillObject } from 'lib/types/register'
import { useRouter } from 'next/router'
import { openRegister } from 'lib/api/register'
import { Cancel, Check } from '@mui/icons-material'
import ActionButton from 'components/button/action-button'

export default function OpenRegisterScreen() {
  const { clerk } = useClerk()
  const { setAlert, setRegisterId } = useAppStore()
  const [till, setTill] = useState({})
  const [notes, setNotes] = useState('')
  const [openAmount, setOpenAmount]: [string, Function] = useState(`${getAmountFromCashMap(till)}`)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const amount = getAmountFromCashMap(till)
    setOpenAmount(!isNaN(amount) ? amount?.toFixed(2) : '0')
  }, [till])

  async function clickOpenRegister() {
    setLoading(true)
    const id = await openRegister(
      {
        openedById: clerk?.id,
        openAmount: openAmount ? parseFloat(openAmount) * 100 : 0,
        openNote: notes || null,
      },
      till,
    )
    setRegisterId(id)

    setLoading(false)
    router.push('/sell')
    setAlert({
      open: true,
      type: 'success',
      message: `REGISTER #${id} OPENED`,
    })
  }

  function isError(till: TillObject) {
    let error = false
    ;[
      'oneHundredDollar',
      'fiftyDollar',
      'twentyDollar',
      'tenDollar',
      'fiveDollar',
      'twoDollar',
      'oneDollar',
      'fiftyCent',
      'twentyCent',
      'tenCent',
    ].forEach((denom) => {
      if (till[denom] && (isNaN(parseInt(till[denom])) || parseInt(till[denom]) < 0)) error = true
    })
    return error
  }

  const invalidOpenAmount = isNaN(parseFloat(`${openAmount}`))

  const buttons = [
    {
      icon: <Cancel />,
      type: 'cancel',
      onClick: () => {
        setLoading(true)
        router.push('/sell')
      },
      disabled: loading,
      text: 'BYPASS REGISTER',
    },
    {
      type: 'ok',
      icon: <Check />,
      loading,
      onClick: clickOpenRegister,
      disabled: invalidOpenAmount,
      text: 'OPEN NEW REGISTER',
    },
  ]

  return (
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
      <div className="grid gap-4 grid-cols-2 mt-4">
        {buttons?.map((button, i) => (
          <ActionButton key={i} button={button} />
        ))}
      </div>
    </div>
  )
}
