import { useEffect, useState } from 'react'
import { ClerkObject, ModalButton, SaleTransactionObject } from 'lib/types'
import TextField from 'components/inputs/text-field'
import { logCloseRegisterWithAmount } from 'lib/functions/log'
import dayjs from 'dayjs'
import { useClerk, useClerks } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useLogs } from 'lib/api/log'
import { useCashUp, useCurrentRegister } from 'lib/api/register'
import {
  getAmountFromCashMap,
  saveClosedRegisterToDatabase,
} from 'features/sale/features/register/lib/register'
import CashMap from 'features/sale/features/register/components/cash-map'
import CashItem from 'features/sale/features/register/cash-item'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function CloseRegisterScreen() {
  // SWR
  const { clerks, isClerksLoading } = useClerks()
  const { logs, mutateLogs } = useLogs()
  const { currentRegister, isCurrentRegisterLoading } = useCurrentRegister()
  const { cashUp, isCashUpLoading } = useCashUp()

  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()

  // State
  const [till, setTill] = useState({})
  const [notes, setNotes] = useState('')
  const [closeAmount, setCloseAmount] = useState(
    `${getAmountFromCashMap(till)}`
  )

  useEffect(() => setCloseAmount(`${getAmountFromCashMap(till)}`), [till])

  // Constants
  const openAmount = cashUp?.openAmount / 100
  const openedBy = clerks?.find(
    (c: ClerkObject) => c?.id === cashUp?.openedById
  )?.name
  const openedOn = dayjs(cashUp?.open_date).format('H:mm A, D MMMM YYYY')

  // Cash Balances
  const closePettyBalance =
    cashUp?.pettyCash?.reduce(
      (acc: number, transaction: SaleTransactionObject) =>
        acc + transaction?.amount,
      0
    ) / 100
  const closeCashGiven =
    cashUp?.cashGiven?.reduce(
      (acc: number, transaction: SaleTransactionObject) =>
        acc + transaction?.changeGiven,
      0
    ) / 100
  const closeCashReceived =
    cashUp?.cashReceived?.reduce(
      (acc: number, transaction: SaleTransactionObject) =>
        acc + transaction?.cashReceived,
      0
    ) / 100
  const closeManualPayments =
    cashUp?.manualPayments?.reduce(
      (acc: number, transaction: SaleTransactionObject) =>
        acc + transaction?.amount,
      0
    ) / 100
  const closeExpectedAmount =
    openAmount +
    closePettyBalance +
    closeCashReceived -
    closeCashGiven -
    closeManualPayments
  const invalidCloseAmount = isNaN(parseFloat(closeAmount))
  const closeDiscrepancy = invalidCloseAmount
    ? 0
    : closeExpectedAmount - parseFloat(closeAmount)

  // Functions
  async function closeRegister() {
    saveClosedRegisterToDatabase(
      currentRegister?.id,
      {
        closeAmount: parseFloat(closeAmount) * 100,
        closedById: clerk?.id,
        closePettyBalance: closePettyBalance * 100,
        closeCashGiven: closeCashGiven * 100,
        closeManualPayments: closeManualPayments * 100,
        closeExpectedAmount: closeExpectedAmount * 100,
        closeDiscrepancy: closeDiscrepancy * 100,
        closeNote: notes,
      },
      till
    )
    logCloseRegisterWithAmount(closeAmount, clerk, currentRegister?.id)
    closeView(ViewProps.closeRegisterScreen)
    setAlert({
      open: true,
      type: 'success',
      message: 'REGISTER CLOSED',
    })
  }

  const cashList =
    cashUp?.cashReceived?.length > 0 ||
    cashUp?.cashGiven?.length > 0 ||
    cashUp?.manualPayments?.length > 0 ||
    cashUp?.pettyCash?.length > 0

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => closeView(ViewProps.closeRegisterScreen),
      disabled: invalidCloseAmount,
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: closeRegister,
      disabled: invalidCloseAmount,
      text: 'CLOSE REGISTER',
    },
  ]

  return (
    // <ScreenContainer
    //   show={view?.closeRegisterScreen}
    //   closeFunction={() => closeView(ViewProps.closeRegisterScreen)}
    //   title={`Close Register #${currentRegister?.id} [opened by ${openedBy} at ${openedOn}]`}
    //   loading={isClerksLoading || isCashUpLoading}
    //   buttons={buttons}
    //   titleClass="bg-col1"
    // >
    <div>
      <div className="flex">
        <div className="w-1/2 mr-12">
          <div className="flex mb-4">
            <div className="w-1/2">
              <div className="text-3xl">Start Float</div>
              <div className="text-3xl text-red-400 py-2">{`$${openAmount?.toFixed(
                2
              )}`}</div>
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
              ? `Close amount over by $${Math.abs(closeDiscrepancy)?.toFixed(
                  2
                )}`
              : 'All square!'}
          </div>
          <CashMap till={till} setTill={setTill} />
          <TextField
            inputLabel="Notes"
            value={notes}
            onChange={(e: any) => setNotes(e.target.value)}
            multiline
          />
        </div>
        <div className="w-1/2">
          {cashList ? (
            <div>
              {cashUp?.cashReceived?.length > 0 && (
                <>
                  <div className="text-xl font-bold mt-4">Cash Received</div>
                  {cashUp?.cashReceived?.map(
                    (transaction: SaleTransactionObject, i: number) => (
                      <CashItem
                        transaction={transaction}
                        field={'cash_received'}
                        key={i}
                      />
                    )
                  )}
                  <div
                    className={`border-t text-sm font-bold ${
                      closeCashReceived < 0 ? 'text-tertiary' : 'text-secondary'
                    }`}
                  >{`${closeCashReceived < 0 ? '-' : '+'} $${Math.abs(
                    closeCashReceived
                  )?.toFixed(2)}`}</div>
                </>
              )}
              {cashUp?.cashGiven?.length > 0 && (
                <>
                  <div className="text-xl font-bold mt-4">Cash Given</div>
                  {cashUp?.cashGiven?.map(
                    (transaction: SaleTransactionObject, i: number) => (
                      <CashItem
                        transaction={transaction}
                        field={'change_given'}
                        negative
                        key={i}
                      />
                    )
                  )}
                  <div
                    className={`border-t text-sm font-bold text-tertiary`}
                  >{`- $${Math.abs(closeCashGiven)?.toFixed(2)}`}</div>
                </>
              )}
              {cashUp?.manualPayments?.length > 0 && (
                <>
                  <div className="text-xl font-bold mt-4">
                    Vendor Cash Payments
                  </div>
                  {cashUp?.manualPayments.map(
                    (transaction: SaleTransactionObject, i: number) => (
                      <CashItem transaction={transaction} negative key={i} />
                    )
                  )}
                  <div
                    className={`border-t text-sm font-bold text-tertiary`}
                  >{`- $${Math.abs(closeManualPayments)?.toFixed(2)}`}</div>
                </>
              )}
              {cashUp?.pettyCash?.length > 0 && (
                <>
                  <div className="text-xl font-bold mt-4">
                    Petty Cash Transactions
                  </div>
                  {cashUp?.pettyCash.map(
                    (transaction: SaleTransactionObject, i: number) => (
                      <CashItem transaction={transaction} key={i} />
                    )
                  )}
                  <div
                    className={`border-t text-sm font-bold ${
                      closePettyBalance < 0 ? 'text-tertiary' : 'text-secondary'
                    }`}
                  >{`${closePettyBalance < 0 ? '-' : '+'} $${Math.abs(
                    closePettyBalance
                  )?.toFixed(2)}`}</div>
                </>
              )}
            </div>
          ) : (
            <div>No cash changed.</div>
          )}
        </div>
      </div>
    </div>
  )
}

CloseRegisterScreen.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
