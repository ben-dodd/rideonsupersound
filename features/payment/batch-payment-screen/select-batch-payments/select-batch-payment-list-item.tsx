import TextField from 'components/inputs/text-field'
import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
import QuantityCheckIcon from '@mui/icons-material/Warning'
import { Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { modulusCheck } from 'lib/functions/payment'
import { priceCentsString } from 'lib/utils'
import { useRouter } from 'next/router'
import { dateSlash } from 'lib/types/date'
import { useAppStore } from 'lib/store'

export default function SelectBatchPaymentListItem({ payment }) {
  const { setBatchAccountPayment } = useAppStore()
  const router = useRouter()
  // const dateFormat = dateSimple
  const dateFormat = dateSlash

  return (
    <div
      className={`flex py-2 px-2 w-full items-center border-b border-t text-sm ${
        payment?.isChecked ? 'bg-yellow-100' : payment?.totalOwing <= 0 ? 'bg-gray-100' : ''
      }`}
    >
      <div className="w-2/12 flex">
        <input
          type="checkbox"
          // disabled={payment?.totalOwing <= 0}
          className="cursor-pointer"
          checked={payment?.isChecked}
          onChange={(e) => setBatchAccountPayment(payment?.vendorId, { isChecked: e.target.checked })}
        />
        <div
          className="pl-4 link-blue"
          onClick={() => router.push(`/vendors/${payment?.id}`)}
        >{`[${payment?.id}] ${payment?.name}`}</div>
      </div>
      <div className="w-1/12 text-right mr-2">{priceCentsString(payment?.totalVendorCut)}</div>
      <div className={`w-1/12 text-right mr-2 font-bold${payment?.totalOwing < 0 ? ' text-red-500' : ''}`}>{`${
        payment?.totalOwing < 0 ? '(' : ''
      }${priceCentsString(Math.abs(payment?.totalOwing || 0))}${payment?.totalOwing < 0 ? ')' : ''}`}</div>
      <div className="w-2/12">{payment?.lastSold ? dayjs(payment?.lastSold).format(dateFormat) : 'NO SALES'}</div>
      <div className="w-2/12">{payment?.lastPaid ? dayjs(payment?.lastPaid).format(dateFormat) : 'NEVER PAID'}</div>
      <div className="w-2/12">
        {payment?.lastContacted ? dayjs(payment?.lastContacted).format(dateFormat) : 'NEVER CONTACTED'}
      </div>
      <div className="w-1/12 flex">
        <TextField
          error={payment?.payAmount !== '' && isNaN(parseFloat(payment?.payAmount))}
          startAdornment={'$'}
          value={payment?.payAmount || ''}
          onChange={(e) => {
            console.log('Changing to ', e.target.value)
            setBatchAccountPayment(payment?.vendorId, { payAmount: e.target.value })
          }}
        />
      </div>
      <div className="w-1/12 flex">
        {payment?.storeCreditOnly ? (
          <div className="text-blue-500 pl-2">
            <Tooltip title="Store Credit Only">
              <StoreCreditOnlyIcon />
            </Tooltip>
          </div>
        ) : !modulusCheck(payment?.bankAccountNumber) ? (
          <Tooltip title={`${payment?.bankAccountNumber ? 'Invalid' : 'Missing'} Bank Account Number`}>
            <div className={`${payment?.bankAccountNumber ? 'text-orange-500' : 'text-red-500'} pl-2 flex`}>
              {/* {payment?.bank_account_number
                      ? payment?.bank_account_number
                      : "NO BANK ACCOUNT NUMBER"} */}
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
      </div>
    </div>
  )
}
