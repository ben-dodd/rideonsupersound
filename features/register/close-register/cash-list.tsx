import { SaleTransactionObject } from 'lib/types/sale'
import React from 'react'
import CashItem from '../cash-item'

const CashList = ({ register }) => {
  const tallyCash = (list, field) => list?.reduce?.((acc, trans) => acc + trans?.[field] || 0, 0) / 100
  const closeCashGiven = tallyCash(register?.cashGiven, 'changeGiven')
  const closeCashReceived = tallyCash(register?.cashReceived, 'cashReceived')
  const closePettyBalance = tallyCash(register?.pettyCash, 'amount')
  const closeManualPayments = tallyCash(register?.manualPayments, 'amount')
  console.log(register)
  return (
    <div>
      {register?.cashReceived?.length > 0 && (
        <>
          <div className="text-xl font-bold mt-4">Cash Received</div>
          {register?.cashReceived?.map((transaction: SaleTransactionObject, i: number) => (
            <CashItem transaction={transaction} field={'cashReceived'} key={i} />
          ))}
          <div
            className={`w-24 text-right border-t text-sm font-bold ${
              closeCashReceived < 0 ? 'text-tertiary' : 'text-secondary'
            }`}
          >{`${closeCashReceived < 0 ? '-' : '+'} $${Math.abs(closeCashReceived)?.toFixed(2)}`}</div>
        </>
      )}
      {register?.cashGiven?.length > 0 && (
        <>
          <div className="text-xl font-bold mt-4">Cash Given</div>
          {register?.cashGiven?.map((transaction: SaleTransactionObject, i: number) => (
            <CashItem transaction={transaction} field={'changeGiven'} negative key={i} />
          ))}
          <div className={`w-24 text-right border-t text-sm font-bold text-tertiary`}>{`- $${Math.abs(
            closeCashGiven,
          )?.toFixed(2)}`}</div>
        </>
      )}
      {register?.manualPayments?.length > 0 && (
        <>
          <div className="text-xl font-bold mt-4">Vendor Cash Payments</div>
          {register?.manualPayments.map((transaction: SaleTransactionObject, i: number) => (
            <CashItem transaction={transaction} negative key={i} />
          ))}
          <div className={`w-24 text-right border-t text-sm font-bold text-tertiary`}>{`- $${Math.abs(
            closeManualPayments,
          )?.toFixed(2)}`}</div>
        </>
      )}
      {register?.pettyCash?.length > 0 && (
        <>
          <div className="text-xl font-bold mt-4">Petty Cash Transactions</div>
          {register?.pettyCash.map((transaction: SaleTransactionObject, i: number) => (
            <CashItem transaction={transaction} key={i} />
          ))}
          <div
            className={`w-24 text-right border-t text-sm font-bold ${
              closePettyBalance < 0 ? 'text-tertiary' : 'text-secondary'
            }`}
          >{`${closePettyBalance < 0 ? '-' : '+'} $${Math.abs(closePettyBalance)?.toFixed(2)}`}</div>
        </>
      )}
    </div>
  )
}

export default CashList
