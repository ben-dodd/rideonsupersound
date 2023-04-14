import TextField from 'components/inputs/text-field'
import NoBankDetailsIcon from '@mui/icons-material/CreditCardOff'
import StoreCreditOnlyIcon from '@mui/icons-material/ShoppingBag'
import QuantityCheckIcon from '@mui/icons-material/Warning'
import { Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import { checkDefaultChecked, modulusCheck } from 'lib/functions/payment'
import { priceCentsString, priceDollarsString } from 'lib/utils'
import { useRouter } from 'next/router'
import SearchInput from 'components/inputs/search-input'

export default function SelectBatchPayments({ vendorList, setVendorList }) {
  const [checked, setChecked] = useState(true)
  const totalPay = vendorList?.reduce((prev, v) => (v?.isChecked ? parseFloat(v?.payAmount) : 0) + prev, 0)
  const vendorNum = vendorList?.filter((v) => v?.isChecked)?.length
  const router = useRouter()
  const [search, setSearch] = useState('')

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex">
          <img width="60" src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/KiwiBank.png`} alt={'KiwiBank'} />
          <div className="mx-2 my-auto h-12 w-full">
            <SearchInput searchValue={search} handleSearch={(e) => setSearch(e?.target?.value)} />
          </div>
        </div>
        <div className="my-auto text-red-400 text-2xl font-bold text-right">
          {vendorList?.filter((v) => isNaN(parseFloat(v?.payAmount)))?.length > 0
            ? `CHECK PAY ENTRIES`
            : `PAY ${priceDollarsString(totalPay)}\nto ${vendorNum} VENDORS`}
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
                      isChecked: false,
                    })),
                  )
                  setChecked(false)
                } else {
                  setVendorList(
                    vendorList?.map((vendor) =>
                      checkDefaultChecked(vendor) ? { ...vendor, isChecked: true } : vendor,
                    ),
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
          {vendorList
            ?.filter((v) => search === '' || v?.name?.toLowerCase()?.includes(search?.toLowerCase()))
            ?.map((v) => (
              <div
                key={v?.id}
                className={`flex py-4 px-2 w-full items-center border-b border-t ${
                  v?.isChecked ? 'bg-yellow-100' : v?.totalOwing <= 0 ? 'bg-gray-100' : ''
                }`}
              >
                <div className="w-2/12 flex">
                  <input
                    type="checkbox"
                    // disabled={v?.totalOwing <= 0}
                    className="cursor-pointer"
                    checked={v?.isChecked}
                    onChange={(e) =>
                      setVendorList(
                        vendorList?.map((vendor) =>
                          vendor?.id === v?.id ? { ...vendor, isChecked: e.target.checked } : vendor,
                        ),
                      )
                    }
                  />
                  <div
                    className="pl-4 link-blue"
                    onClick={() => router.push(`/vendors/${v?.id}`)}
                  >{`[${v?.id}] ${v?.name}`}</div>
                </div>
                <div className="w-1/12">{priceCentsString(v?.totalSell)}</div>
                <div className={`w-1/12${v?.totalOwing < 0 ? ' text-red-500' : ''}`}>{`${
                  v?.totalOwing < 0 ? '(' : ''
                }${priceCentsString(Math.abs(v?.totalOwing || 0))}${v?.totalOwing < 0 ? ')' : ''}`}</div>
                <div className="w-2/12">{v?.lastSold ? dayjs(v?.lastSold).format('D MMMM YYYY') : 'NO SALES'}</div>
                <div className="w-2/12">{v?.lastPaid ? dayjs(v?.lastPaid).format('D MMMM YYYY') : 'NEVER PAID'}</div>
                <div className="w-2/12">
                  {v?.lastContacted ? dayjs(v?.lastContacted).format('D MMMM YYYY') : 'NEVER CONTACTED'}
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
                          vendor?.id === v?.id ? { ...vendor, payAmount: e.target.value } : vendor,
                        ),
                      )
                    }
                  />
                </div>
                <div className="w-1/12 flex">
                  {v?.storeCreditOnly ? (
                    <div className="text-blue-500 pl-2">
                      <Tooltip title="Store Credit Only">
                        <StoreCreditOnlyIcon />
                      </Tooltip>
                    </div>
                  ) : !modulusCheck(v?.bankAccountNumber) ? (
                    <Tooltip title={`${v?.bankAccountNumber ? 'Invalid' : 'Missing'} Bank Account Number`}>
                      <div className={`${v?.bankAccountNumber ? 'text-orange-500' : 'text-red-500'} pl-2 flex`}>
                        {/* {v?.bank_account_number
                      ? v?.bank_account_number
                      : "NO BANK ACCOUNT NUMBER"} */}
                        <NoBankDetailsIcon />
                      </div>
                    </Tooltip>
                  ) : (
                    <div />
                  )}
                  {v?.hasNegativeQuantityItems ? (
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
