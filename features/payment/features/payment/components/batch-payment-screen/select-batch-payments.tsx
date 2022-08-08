import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
import QuantityCheckIcon from '@mui/icons-material/Warning'
import { Tooltip } from '@mui/material'
import TextField from 'components/inputs/text-field'
import dayjs from 'dayjs'
import { useState } from 'react'
import { modulusCheck } from '../../lib/functions'

export default function SelectBatchPayments({ vendorList, setVendorList }) {
  const [checked, setChecked] = useState(true)
  const totalPay = vendorList?.reduce(
    (prev, v) => (v?.is_checked ? parseFloat(v?.payAmount) : 0) + prev,
    0
  )

  const vendorNum = vendorList?.reduce(
    (prev, v) => (v?.is_checked ? 1 : 0) + prev,
    0
  )

  const checkValid = (vendor) =>
    modulusCheck(vendor?.bank_account_number) &&
    !vendor?.store_credit_only &&
    (vendor?.totalOwing >= 2000 ||
      (dayjs().diff(vendor?.lastPaid, 'month') >= 3 &&
        vendor?.totalOwing > 0) ||
      (dayjs().diff(vendor?.lastSold, 'month') >= 3 && !vendor?.lastPaid))
      ? true
      : false
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex">
          <img
            width="80"
            src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/KiwiBank.png`}
            alt={'KiwiBank'}
          />
          {/* <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}
          {/* <button
          className={`py-1 px-2 border border-black rounded-xl mt-2${
            selectOwed ? " bg-tertiary-light" : ""
          }`}
          onClick={() =>
            setVendorList(
              vendorList?.map((v) =>
                v?.totalOwing > 2000 ? { ...v, is_checked: true } : v
              )
            )
          }
        >
          Select all owed more than $20
        </button> */}
        </div>
        <div className="text-red-400 text-2xl font-bold text-right">
          {vendorList?.filter((v) => isNaN(parseFloat(v?.payAmount)))?.length >
          0
            ? `CHECK PAY ENTRIES`
            : `PAY $${parseFloat(totalPay).toFixed(
                2
              )}\nto ${vendorNum} VENDORS`}
        </div>
      </div>
      <div className="w-full">
        <div className="flex font-bold py-2 px-2 border-b border-black">
          <div className="w-2/12 flex">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={checked}
              onChange={(e) => {
                if (checked) {
                  setVendorList(
                    vendorList?.map((vendor) => ({
                      ...vendor,
                      is_checked: false,
                    }))
                  )
                  setChecked(false)
                } else {
                  setVendorList(
                    vendorList?.map((vendor) =>
                      checkValid(vendor)
                        ? { ...vendor, is_checked: true }
                        : vendor
                    )
                  )
                  setChecked(true)
                }
              }}
            />
            <div className="pl-4">NAME</div>
          </div>
          <div className="w-1/12">TAKE</div>
          <div className="w-1/12">OWED</div>
          <div className="w-2/12">LAST SALE</div>
          <div className="w-2/12">LAST PAID</div>
          <div className="w-2/12">LAST CONTACTED</div>
          <div className="w-2/12">AMOUNT TO PAY</div>
        </div>
        <div className="h-dialog overflow-y-scroll">
          {vendorList?.map((v) => (
            <div
              key={v?.id}
              className={`flex py-4 px-2 w-full items-center border-b border-t ${
                v?.is_checked
                  ? 'bg-yellow-100'
                  : v?.totalOwing <= 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              <div className="w-2/12 flex">
                <input
                  type="checkbox"
                  // disabled={v?.totalOwing <= 0}
                  className="cursor-pointer"
                  checked={v?.is_checked}
                  onChange={(e) =>
                    setVendorList(
                      vendorList?.map((vendor) =>
                        vendor?.id === v?.id
                          ? { ...vendor, is_checked: e.target.checked }
                          : vendor
                      )
                    )
                  }
                />
                <div className="pl-4">{`[${v?.id}] ${v?.name}`}</div>
              </div>
              <div className="w-1/12">{`$${((v?.totalSell || 0) / 100)?.toFixed(
                2
              )}`}</div>
              <div
                className={`w-1/12${v?.totalOwing < 0 ? ' text-red-500' : ''}`}
              >{`${v?.totalOwing < 0 ? '(' : ''}$${(
                Math.abs(v?.totalOwing || 0) / 100
              )?.toFixed(2)}${v?.totalOwing < 0 ? ')' : ''}`}</div>
              <div className="w-2/12">
                {v?.lastSold
                  ? dayjs(v?.lastSold).format('D MMMM YYYY')
                  : 'NO SALES'}
              </div>
              <div className="w-2/12">
                {v?.lastPaid
                  ? dayjs(v?.lastPaid).format('D MMMM YYYY')
                  : 'NEVER PAID'}
              </div>
              <div className="w-2/12">
                {v?.last_contacted
                  ? dayjs(v?.last_contacted).format('D MMMM YYYY')
                  : 'NEVER CONTACTED'}
              </div>
              <div className="w-1/12 flex">
                <TextField
                  // disabled={v?.totalOwing <= 0 || !v?.is_checked}
                  // disabled={!v?.is_checked}
                  error={isNaN(parseFloat(v?.payAmount))}
                  startAdornment={'$'}
                  value={v?.payAmount || ''}
                  onChange={(e) =>
                    setVendorList(
                      vendorList?.map((vendor) =>
                        vendor?.id === v?.id
                          ? { ...vendor, payAmount: e.target.value }
                          : vendor
                      )
                    )
                  }
                />
              </div>
              <div className="w-1/12 flex">
                {v?.store_credit_only ? (
                  <div className="text-blue-500 pl-2">
                    <Tooltip title="Store Credit Only">
                      <StoreCreditOnlyIcon />
                    </Tooltip>
                  </div>
                ) : !modulusCheck(v?.bank_account_number) ? (
                  <Tooltip
                    title={`${
                      v?.bank_account_number ? 'Invalid' : 'Missing'
                    } Bank Account Number`}
                  >
                    <div
                      className={`${
                        v?.bank_account_number
                          ? 'text-orange-500'
                          : 'text-red-500'
                      } pl-2 flex`}
                    >
                      {/* {v?.bank_account_number
                      ? v?.bank_account_number
                      : "NO BANK ACCOUNT NUMBER"} */}
                      <NoBankDetailsIcon />
                    </div>
                  </Tooltip>
                ) : (
                  <div />
                )}
                {v?.totalItems?.filter((i) => i?.quantity < 0)?.length > 0 ? (
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
          ))}
        </div>
      </div>
    </div>
  )
}
