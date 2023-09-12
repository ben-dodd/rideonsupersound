import { CheckCircleOutline, CreditCardOff } from '@mui/icons-material'
import Tooltip from '@mui/material/Tooltip'
import InfoBox from 'components/container/info-box'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { modulusCheck } from 'lib/functions/payment'
import { dateSimple } from 'lib/types/date'
import { priceCentsString } from 'lib/utils'

export default function GeneralDetails({ vendor }) {
  const { clerks } = useClerks()
  const invalidBankAccountNumber = !modulusCheck(vendor?.bankAccountNumber)
  const vendorData = [
    { label: 'Vendor ID', value: vendor?.id, alwaysDisplay: true },
    { label: 'Name', value: vendor?.name, alwaysDisplay: true },
    { label: 'Vendor Category', value: vendor?.vendorCategory },
    { label: 'Staff Contact', value: clerks?.find((clerk) => clerk?.id === vendor?.clerkId)?.name },
    {
      label: 'Bank Account Number',
      value: vendor?.bankAccountNumber,
      alwaysDisplay: true,
      icon: invalidBankAccountNumber ? (
        <Tooltip title={`${vendor?.bankAccountNumber ? 'Invalid' : 'Missing'} Bank Account Number`}>
          <div className={`${vendor?.bankAccountNumber ? 'text-red-500' : 'text-orange-500'} pl-2 flex`}>
            <CreditCardOff />
          </div>
        </Tooltip>
      ) : (
        <Tooltip title="Bank account is valid!">
          <div className="text-green-500 pl-2">
            <CheckCircleOutline />
          </div>
        </Tooltip>
      ),
    },
    { label: 'Contact Name', value: vendor?.contactName },
    { label: 'Email', value: vendor?.email, link: `mailto:${vendor?.email}` },
    { label: 'Phone', value: vendor?.phone, link: `tel:${vendor?.phone}` },
    { label: 'Postal Address', value: vendor?.postalAddress },
    { label: 'Notes', value: vendor?.note },
    { label: 'Pay by store credit only', value: Boolean(vendor?.storeCreditOnly) },
    { label: 'Email this vendor?', value: Boolean(vendor?.emailVendor) },
  ]

  const yearSales = vendor?.sales?.filter((sale) => dayjs(sale?.dateSaleClosed).isAfter(dayjs().subtract(12, 'month')))

  const monthSales = vendor?.sales?.filter((sale) => dayjs(sale?.dateSaleClosed).isAfter(dayjs().subtract(1, 'month')))

  const totalItemsSold = vendor?.sales?.reduce?.((total, sale) => total + sale?.quantity, 0) || 0
  const yearItemsSold = yearSales?.reduce?.((total, sale) => total + sale?.quantity, 0) || 0
  const monthItemsSold = monthSales?.reduce?.((total, sale) => total + sale?.quantity, 0) || 0

  const accountSummary = [
    { label: 'TOTAL TAKE TO DATE', value: priceCentsString(vendor?.totalSell) },
    { label: 'TOTAL PAID TO DATE', value: priceCentsString(vendor?.totalPaid) },
    { label: 'PAYMENT OWING', value: priceCentsString(vendor?.totalOwing) },
  ]

  const itemsSoldSummary = [
    { label: 'TOTAL ITEMS SOLD', value: totalItemsSold },
    { label: 'ITEMS SOLD IN THE LAST YEAR', value: yearItemsSold },
    { label: 'ITEMS SOLD IN THE LAST MONTH', value: monthItemsSold },
  ]

  const lastSummary = [
    { label: 'LAST PAID', value: vendor?.lastPaid ? dayjs(vendor?.lastPaid).format(dateSimple) : 'N/A' },
    { label: 'LAST SALE', value: vendor?.lastSold ? dayjs(vendor?.lastSold).format(dateSimple) : 'N/A' },
  ]

  return (
    <>
      <InfoBox data={vendorData} />
      <div className="max-w-md grid grid-cols-2 border-b mb-2 items-center">
        {accountSummary.map((row) => (
          <>
            <div className="text-xs">{row.label}</div>
            <div className="font-bold text-right">{row.value}</div>
          </>
        ))}
      </div>
      <div className="max-w-md grid grid-cols-2 border-b mb-2 items-center">
        {itemsSoldSummary.map((row) => (
          <>
            <div className="text-xs">{row.label}</div>
            <div className="font-bold text-right">{row.value}</div>
          </>
        ))}
      </div>
      <div className="max-w-md grid grid-cols-2 border-b  mb-2 items-center">
        {lastSummary.map((row) => (
          <>
            <div className="text-xs">{row.label}</div>
            <div className="text-right">{row.value}</div>
          </>
        ))}
      </div>
      <a
        target="_blank"
        className="link-blue"
        href={`https://rideonsupersound.vercel.app/vendor/${vendor?.uid}`}
        rel="noreferrer"
      >
        View Vendor Sheet
      </a>
    </>
  )
}
