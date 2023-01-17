import { Cancel, Check } from '@mui/icons-material'
import ActionButton from 'components/button/action-button'
import TextField from 'components/inputs/text-field'
import { useClerk } from 'lib/api/clerk'
import { closeRegister } from 'lib/api/register'
import { getAmountFromCashMap, getRegisterValues } from 'lib/functions/register'
import { useAppStore } from 'lib/store'
import { TillObject } from 'lib/types/register'
import { dollarsToCents } from 'lib/utils'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import CashMap from '../cash-map'

const CloseRegisterSidebar = ({ register }) => {
  const { setAlert } = useAppStore()
  const router = useRouter()
  const { clerk } = useClerk()
  const [till, setTill]: [TillObject, Function] = useState({})
  const [notes, setNotes] = useState('')
  const [closeAmount, setCloseAmount] = useState(`${getAmountFromCashMap(till)}`)
  const [loading, setLoading] = useState(false)
  useEffect(() => setCloseAmount(`${getAmountFromCashMap(till)}`), [till])
  const {
    openAmount,
    closePettyBalance,
    closeCashGiven,
    closeManualPayments,
    closeExpectedAmount,
    invalidCloseAmount,
    closeDiscrepancy,
  } = getRegisterValues(register, closeAmount)

  async function clickCloseRegister() {
    setLoading(true)
    await closeRegister(
      register?.id,
      {
        closeAmount: dollarsToCents(closeAmount),
        closedById: clerk?.id,
        closePettyBalance: dollarsToCents(closePettyBalance),
        closeCashGiven: dollarsToCents(closeCashGiven),
        closeManualPayments: dollarsToCents(closeManualPayments),
        closeExpectedAmount: dollarsToCents(closeExpectedAmount),
        closeDiscrepancy: dollarsToCents(closeDiscrepancy),
        closeNote: notes,
      },
      till,
    )
    setLoading(false)
    router.push('/sell')
    setAlert({
      open: true,
      type: 'success',
      message: 'REGISTER CLOSED',
    })
  }

  const buttons = [
    {
      icon: <Cancel />,
      type: 'cancel',
      onClick: () => router.push('/sell'),
      disabled: loading,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      icon: <Check />,
      loading,
      onClick: clickCloseRegister,
      disabled: invalidCloseAmount,
      text: 'CLOSE REGISTER',
    },
  ]

  return (
    <div>
      <div className="flex mb-4">
        <div className="w-1/2">
          <div className="text-3xl">Start Float</div>
          <div className="text-3xl text-red-400 py-2">{`$${openAmount?.toFixed(2)}`}</div>
        </div>
        <div className="w-1/2">
          <div className="text-3xl">Close Float</div>
          <TextField
            className="text-3xl text-red-400"
            startAdornment="$"
            value={`${closeAmount}`}
            onChange={(e: any) => {
              setCloseAmount(e.target.value)
            }}
          />
        </div>
      </div>
      <div
        className={`text-3xl text-center py-2 ${
          invalidCloseAmount || closeDiscrepancy > 0
            ? 'text-tertiary'
            : closeDiscrepancy < 0
            ? 'text-secondary'
            : 'text-primary'
        }`}
      >{`$${closeExpectedAmount?.toFixed(2)} Expected`}</div>
      <div
        className={`text-xl text-center ${
          invalidCloseAmount || closeDiscrepancy > 0
            ? 'text-tertiary'
            : closeDiscrepancy < 0
            ? 'text-secondary'
            : 'text-primary'
        }`}
      >
        {invalidCloseAmount
          ? 'Close amount must be a number'
          : closeDiscrepancy > 0
          ? `Close amount short by $${closeDiscrepancy?.toFixed(2)}`
          : closeDiscrepancy < 0
          ? `Close amount over by $${Math.abs(closeDiscrepancy)?.toFixed(2)}`
          : 'All square!'}
      </div>
      <CashMap till={till} setTill={setTill} />
      <TextField inputLabel="Notes" value={notes} onChange={(e: any) => setNotes(e.target.value)} multiline />
      <div className={`grid gap-4 grid-cols-2`}>
        {buttons?.map((button, i) => (
          <ActionButton key={i} button={button} />
        ))}
      </div>
    </div>
  )
}

export default CloseRegisterSidebar
