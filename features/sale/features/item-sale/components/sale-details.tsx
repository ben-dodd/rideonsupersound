import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
// DB
import { useClerks, useCustomers, useInventory } from '@lib/database/read'
import { CustomerObject, OpenWeatherObject, SaleStateTypes } from '@lib/types'
import { convertDegToCardinal, convertMPStoKPH } from '@lib/utils'
import { getSaleVars } from '../lib/functions'

export default function SaleDetails({ sale }) {
  dayjs.extend(utc)
  // SWR
  const { clerks } = useClerks()
  const { customers } = useCustomers()
  const { inventory } = useInventory()

  // State
  const { totalRemaining } = getSaleVars(sale, inventory)
  console.log(totalRemaining)

  // Constants
  const weather: OpenWeatherObject = jsonDecode(sale?.weather)

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between my-2">
        <div
          className={`text-2xl font-bold ${
            totalRemaining === 0
              ? 'text-primary'
              : totalRemaining < 0
              ? 'text-secondary'
              : 'text-tertiary'
          }`}
        >
          {sale?.state === SaleStateTypes.Completed
            ? 'SALE COMPLETED'
            : totalRemaining === 0
            ? 'ALL PAID'
            : totalRemaining < 0
            ? 'CUSTOMER OWED'
            : 'LEFT TO PAY'}
        </div>
        <div className="text-2xl text-red-500 font-bold text-xl">
          {totalRemaining === 0
            ? ''
            : `$${Math.abs(totalRemaining || 0)?.toFixed(2)}`}
        </div>
      </div>
      <div className="px-2">
        <div className="font-bold">Customer</div>
        <div className="mb-4">
          {customers?.filter(
            (c: CustomerObject) => c?.id === sale?.customer_id
          )[0]?.name || 'Customer not set'}
        </div>
        <div className="font-bold">Sale Open</div>
        <div className="mb-4">
          {sale?.date_sale_opened
            ? `${dayjs(sale?.date_sale_opened).format('D MMMM YYYY, h:mm A')}${
                sale?.sale_opened_by
                  ? ` (opened by ${
                      clerks
                        ? clerks.filter(
                            (clerk: any) => clerk?.id === sale?.sale_opened_by
                          )[0]?.name
                        : 'unknown clerk'
                    })`
                  : ''
              }`
            : 'Sale not opened'}
        </div>
        <div className="font-bold">Sale Close</div>
        <div className="mb-4">
          {sale?.date_sale_closed
            ? `${dayjs(sale?.date_sale_closed).format('D MMMM YYYY, h:mm A')}${
                sale?.sale_closed_by
                  ? ` (closed by ${
                      clerks
                        ? clerks.filter(
                            (clerk: any) => clerk?.id === sale?.sale_closed_by
                          )[0]?.name
                        : 'unknown clerk'
                    })`
                  : ''
              }`
            : 'Sale not closed'}
        </div>
        {sale?.is_mail_order ? (
          <div>
            <div className="font-bold">Postage</div>
            <div className="mb-4">
              {sale?.postage ? `$${sale?.postage}` : 'N/A'}
            </div>
            <div className="font-bold">Postal Address</div>
            <div className="mb-4">{sale?.postal_address || 'N/A'}</div>
          </div>
        ) : (
          <div />
        )}
        {sale?.note ? (
          <>
            <div className="font-bold">Notes</div>
            <div className="mb-4">{sale?.note || 'N/A'}</div>
          </>
        ) : (
          <div />
        )}
        {weather?.weather?.[0] && (
          <div className="bg-blue-200 p-2 my-2 rounded-md">
            <div className="font-bold">Weather</div>
            <div className="flex">
              <div>
                <img
                  src={`http://openweathermap.org/img/w/${weather?.weather?.[0]?.icon}.png`}
                />
              </div>
              <div>
                <div className="font-bold">{`${weather?.weather?.[0]?.main} (${weather?.weather?.[0]?.description})`}</div>
                <div>{`${weather?.main?.temp.toFixed(
                  1
                )}°C (felt like ${weather?.main?.feels_like.toFixed(
                  1
                )}°C)`}</div>
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
        {/*sale?.geo_latitude && sale?.geo_longitude && (
          <iframe
            className="p-2"
            width="380"
            height="180"
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        &location=${sale?.geo_latitude},${sale?.geo_longitude}&fov=70`}
          ></iframe>
        )*/}
      </div>
    </div>
  )
}

function jsonDecode(weather: any) {
  let ret: any = weather || null
  while (typeof ret === 'string') {
    ret = JSON.parse(ret)
  }
  return ret
}
