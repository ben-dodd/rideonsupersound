import InfoBox from 'components/infoBox'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { centsToDollars, priceDollarsString } from 'lib/utils'

export default function GeneralDetails({ vendor }) {
  const { clerks } = useClerks()

  const bankAccountMask = [
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
  ]

  const vendorData = [
    { label: 'Name', value: vendor?.name },
    { label: 'Vendor Category', value: vendor?.vendorCategory },
    { label: 'Staff Contact', value: clerks?.find((clerk) => clerk?.id === vendor?.clerkId)?.name },
    { label: 'Bank Account Number', value: vendor?.bankAccountNumber },
    { label: 'Store Credit Only', value: Boolean(vendor?.storeCreditOnly) },
    { label: 'Email Vendor', value: Boolean(vendor?.emailVendor) },
    { label: 'Contact Name', value: vendor?.contactName },
    { label: 'Email', value: vendor?.email, link: `mailto:${vendor?.email}` },
    { label: 'Phone', value: vendor?.phone, link: `tel:${vendor?.phone}` },
    { label: 'Postal Address', value: vendor?.postalAddress },
    { label: 'Notes', value: vendor?.note },
  ]
  const vendorStats = [
    { label: 'Total Sales', value: vendor?.sales?.length || 0 },
    { label: 'Last Sale', value: vendor?.lastSold ? dayjs(vendor?.lastSold).format('D MMMM YYYY') : 'N/A' },
    { label: 'Last Paid', value: vendor?.lastPaid ? dayjs(vendor?.lastPaid).format('D MMMM YYYY') : 'N/A' },
    { label: 'Total Take', value: priceDollarsString(centsToDollars(vendor?.totalSell)) },
    { label: 'Total Paid', value: priceDollarsString(centsToDollars(vendor?.totalPaid)) },
    { label: 'Total Owed', value: priceDollarsString(centsToDollars(vendor?.totalOwing)) },
  ]
  return (
    <>
      <InfoBox title="General Details" data={vendorData} />
      <InfoBox title="Stats" data={vendorStats} />
    </>
  )
}
