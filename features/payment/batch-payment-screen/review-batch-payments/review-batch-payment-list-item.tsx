import dynamic from 'next/dynamic'
import Warning from '@mui/icons-material/Warning'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
const Tooltip = dynamic(() => import('@mui/material/Tooltip'))
import { modulusCheck } from 'lib/functions/payment'
import { centsToDollars, dollarsToCents, priceCentsString, priceDollarsString } from 'lib/utils'

export default function ReviewBatchPaymentListItem({ payment }) {
  let invalidBankAccountNumber = !modulusCheck(payment?.bankAccountNumber)
  let negativePayAmount = Number(payment?.payAmount) <= 0
  let excessivePayAmount = Number(payment?.payAmount) > centsToDollars(payment?.totalOwing)
  const balance = payment?.totalOwing - dollarsToCents(payment?.payAmount)

  return (
    <div className={`py-2 px-2 text-sm border-b flex${parseFloat(payment?.payAmount) <= 0 ? ' opacity-50' : ''}`}>
      <div className="w-1/3">{`[${payment?.id}] ${payment?.name}`}</div>
      <div className="w-1/6">{priceCentsString(payment?.totalOwing)}</div>
      <div className="w-1/6 text-tertiary font-bold">{priceDollarsString(payment?.payAmount)}</div>
      <div className="w-3/12">{priceCentsString(balance)}</div>
      <div className="flex w-1/12 text-right">
        {payment?.storeCreditOnly ? (
          <div className="text-blue-500 pl-2">
            <Tooltip title="Vendor wants Store Credit Only">
              <StoreCreditOnlyIcon />
            </Tooltip>
          </div>
        ) : (
          <div />
        )}
        {invalidBankAccountNumber ? (
          <Tooltip title={`${payment?.bankAccountNumber ? 'Invalid' : 'Missing'} Bank Account Number`}>
            <div className={`${payment?.bankAccountNumber ? 'text-orange-500' : 'text-red-500'} pl-2 flex`}>
              <NoBankDetailsIcon />
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
        {payment?.hasNegativeQuantityItems ? (
          <Tooltip title="Vendor has negative quantity items. Please check!">
            <div className="text-purple-500 pl-2">
              <Warning />
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
        {negativePayAmount ? (
          <Tooltip title="Pay amount is less than or equal to zero. Please check!">
            <div className="text-orange-500 pl-2">
              <Warning />
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
        {excessivePayAmount ? (
          <Tooltip title="You are paying the vendor more than they are owed. Please check!">
            <div className="text-orange-500 pl-2">
              <Warning />
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
        {!invalidBankAccountNumber &&
        !payment?.hasNegativeQuantityItems &&
        !payment?.invalid &&
        !payment?.storeCreditOnly &&
        !negativePayAmount &&
        !excessivePayAmount ? (
          <Tooltip title="Everything looks good!">
            <div className="text-green-500 pl-2">
              <CheckIcon />
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
