import { Cancel, Check } from '@mui/icons-material'
import TextField from 'components/inputs/text-field'
import { useClerk } from 'lib/api/clerk'
import { closeRegister, useCurrentRegister } from 'lib/api/register'
import { getAmountFromCashMap, getRegisterValues } from 'lib/functions/register'
import { useAppStore } from 'lib/store'
import { TillObject } from 'lib/types/register'
import { dollarsToCents, priceDollarsString } from 'lib/utils'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import CashMap from '../cash-map'
import ActionButton from 'components/button/action-button'

const CloseRegisterScreen = () => {
  const { setAlert } = useAppStore()
  const router = useRouter()
  const { clerk } = useClerk()
  const [till, setTill]: [TillObject, Function] = useState({})
  const { currentRegister } = useCurrentRegister()
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
  } = getRegisterValues(currentRegister, closeAmount)

  async function clickCloseRegister() {
    setLoading(true)
    await closeRegister(
      currentRegister?.id,
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
    router.push('/register/open')
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
    <div className="h-main sm:w-boardMainSmall lg:w-boardMain flex justify-center items-center">
      <div className="max-w-md">
        <div className="flex justify-center text-4xl font-bold pb-4">{`CLOSE REGISTER #${currentRegister?.id}`}</div>
        <div className="flex mb-4">
          <div className="w-1/2">
            <div className="text-3xl">Start Float</div>
            <div className="text-3xl text-red-400 py-2">{`${priceDollarsString(openAmount)}`}</div>
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
        >{`${priceDollarsString(closeExpectedAmount)} Expected`}</div>
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
            ? `Close amount short by ${priceDollarsString(closeDiscrepancy)}`
            : closeDiscrepancy < 0
            ? `Close amount over by ${priceDollarsString(Math.abs(closeDiscrepancy))}`
            : 'All square!'}
        </div>
        <CashMap till={till} setTill={setTill} />
        <TextField inputLabel="Notes" value={notes} onChange={(e: any) => setNotes(e.target.value)} multiline />
        <div className="grid gap-4 grid-cols-2 mt-4">
          {buttons?.map((button, i) => (
            <ActionButton key={i} button={button} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CloseRegisterScreen
