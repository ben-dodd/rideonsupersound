import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
import QuantityCheckIcon from '@mui/icons-material/Warning'
import { Tooltip } from '@mui/material'
import { dollarsToCents, priceCentsString, priceDollarsString } from 'lib/utils'

export default function ViewBatchPaymentListItem({ payment }) {
  const balance = payment?.totalOwing - dollarsToCents(payment?.payAmount)
  return (
    <div className={`py-2 px-2 text-sm border-b flex${parseFloat(payment?.payAmount) <= 0 ? ' opacity-50' : ''}`}>
      <div className="w-1/3">{`[${payment?.id}] ${payment?.name}`}</div>
      <div className="w-1/6">{priceCentsString(payment?.totalOwing)}</div>
      <div className="w-1/6">{priceDollarsString(payment?.payAmount)}</div>
      <div className="w-1/6">{priceCentsString(balance)}</div>
      <div className="flex w-1/6">
        {payment?.storeCreditOnly ? (
          <div className="text-blue-500 pl-2">
            <Tooltip title="Vendor wants Store Credit Only">
              <StoreCreditOnlyIcon />
            </Tooltip>
          </div>
        ) : (
          <div />
        )}
        {payment?.invalidBankAccountNumber ? (
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
              <QuantityCheckIcon />
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
        {!payment?.hasNegativeQuantityItems && !payment?.invalidBankAccountNumber && !payment?.storeCreditOnly ? (
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
