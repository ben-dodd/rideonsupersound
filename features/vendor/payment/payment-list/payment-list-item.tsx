import { AccountBalance, AddCard, EventBusy, Input, Money, Output } from '@mui/icons-material'
import dayjs from 'dayjs'
import { writeVendorPaymentDescription } from 'lib/functions/payment'
import { VendorPaymentTypes } from 'lib/types/vendor'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import React from 'react'

const PaymentListItem = ({ payment }) => {
  const router = useRouter()
  let categoryIcon = <AccountBalance />
  switch (payment?.type) {
    case VendorPaymentTypes.Batch:
      // categoryIcon = <InterpreterMode className="text-blue-300" />
      categoryIcon = <AccountBalance className="text-blue-300" />
      break
    case VendorPaymentTypes.Cash:
      categoryIcon = <Money className="text-yellow-400" />
      break
    case VendorPaymentTypes.DC:
      categoryIcon = <AddCard className="text-yellow-400" />
      break
    case VendorPaymentTypes.Sale:
      categoryIcon = <Money className="text-purple-300" />
      break
    case VendorPaymentTypes.SaleRefund:
      categoryIcon = <EventBusy className="text-orange-800" />
      break
    case VendorPaymentTypes.TransferFrom:
      categoryIcon = <Output className="text-red-500" />
      break
    case VendorPaymentTypes.TransferTo:
      categoryIcon = <Input className="text-green-600" />
      break
  }
  return (
    <div className={`list-item-compact`} onClick={() => router.push(`/payment/${payment?.id}`)}>
      <div className="flex w-full">
        <div className="w-1/12">{categoryIcon}</div>
        {/* <div className="w-3/12">{`[${`000000${payment?.id}`.slice(-6)}] ${payment?.type?.toUpperCase()}`}</div> */}
        <div className="w-3/12">{dayjs(payment?.date).format('YYYY-MM-DD h:mma')}</div>
        <div className="w-7/12">{writeVendorPaymentDescription(payment)}</div>
        <div className="w-1/12 text-right">{priceCentsString(payment?.amount)}</div>
      </div>
      <div />
    </div>
  )
}

export default PaymentListItem
