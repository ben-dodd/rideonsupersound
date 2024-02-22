import InfoBox from 'components/container/info-box'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { useCustomers } from 'lib/api/customer'
import { CustomerObject } from 'lib/types'
import { dateTime } from 'lib/types/date'
import { CartObject } from 'lib/types/sale'
import { OpenWeatherObject } from 'lib/types/weather'
import { camelCase, convertDegToCardinal, convertMPStoKPH, parseJSON, priceDollarsString } from 'lib/utils'
import { startCase } from 'lodash'

export default function SaleDetailsSidebar({ cart }: { cart: CartObject }) {
  const { clerks } = useClerks()
  const { customers } = useCustomers()
  // const { totalRemaining } = useSaleProperties(cart)
  const totalRemaining = 0
  const { sale = {} } = cart || {}
  const weather: OpenWeatherObject = parseJSON(sale?.weather)

  const saleInfo = [
    { label: 'Status', value: startCase(camelCase(sale?.state)) },
    { label: 'Total Remaining to Pay', value: totalRemaining ? priceDollarsString(totalRemaining) : null },
    { label: 'Customer', value: customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.name },
    {
      label: 'Opened',
      value: sale?.dateSaleOpened ? `${dayjs(sale?.dateSaleOpened).format(dateTime)}` : 'N/A',
    },
    {
      label: 'Closed',
      value: sale?.dateSaleClosed ? `${dayjs(sale?.dateSaleClosed).format(dateTime)}` : 'Sale not closed',
    },
    { label: 'Opened By', value: clerks?.find((clerk: any) => clerk?.id === sale?.saleOpenedBy)?.name },
    { label: 'Closed By', value: clerks?.find((clerk: any) => clerk?.id === sale?.saleClosedBy)?.name },
    { label: 'Postage', value: sale?.postage ? priceDollarsString(sale?.postage) : null },
    { label: 'Postal Address', value: sale?.postalAddress },
    { label: 'Notes', value: sale?.note },
  ]

  return (
    <div className="h-full border p-2">
      <InfoBox data={saleInfo} />
      {weather?.weather?.[0] && (
        <div className="p-2 my-2 rounded">
          <div className="font-bold">Weather</div>
          <div className="flex">
            <div className="mr-4">
              <img alt="Weather Icon" src={`http://openweathermap.org/img/w/${weather?.weather?.[0]?.icon}.png`} />
            </div>
            <div>
              <div>{`${weather?.weather?.[0]?.main} (${weather?.weather?.[0]?.description})`}</div>
              <div>{`${weather?.main?.temp.toFixed(1)}°C (felt like ${weather?.main?.feels_like.toFixed(1)}°C)`}</div>
              {weather?.wind && (
                <div>
                  Wind was {convertMPStoKPH(weather?.wind?.speed).toFixed(1)}
                  km/hr, {convertDegToCardinal(weather?.wind?.deg)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// function jsonDecode(weather: any) {
//   let ret: any = weather || null
//   while (typeof ret === 'string') {
//     ret = JSON.parse(ret)
//   }
//   return ret
// }
