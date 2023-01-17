import dayjs, { extend } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useClerks } from 'lib/api/clerk'
import { useCustomers } from 'lib/api/customer'
import { useSaleProperties } from 'lib/hooks/sale'
import { CustomerObject } from 'lib/types'
import { SaleObject, SaleStateTypes } from 'lib/types/sale'
import { OpenWeatherObject } from 'lib/types/weather'
import { convertDegToCardinal, convertMPStoKPH } from 'lib/utils'

export default async function SaleDetails({ sale }: { sale: SaleObject }) {
  extend(utc)
  const { clerks } = useClerks()
  const { customers } = useCustomers()
  const { totalRemaining } = useSaleProperties(sale)
  const weather: OpenWeatherObject = jsonDecode(sale?.weather)

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between my-2">
        <div
          className={`text-2xl font-bold ${
            totalRemaining === 0 ? 'text-primary' : totalRemaining < 0 ? 'text-secondary' : 'text-tertiary'
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
          {totalRemaining === 0 ? '' : `$${Math.abs(totalRemaining || 0)?.toFixed(2)}`}
        </div>
      </div>
      <div className="px-2">
        <div className="font-bold">Customer</div>
        <div className="mb-4">
          {customers?.find((c: CustomerObject) => c?.id === sale?.customerId)?.name || 'Customer not set'}
        </div>
        <div className="font-bold">Sale Open</div>
        <div className="mb-4">
          {sale?.dateSaleOpened
            ? `${dayjs(sale?.dateSaleOpened).format('D MMMM YYYY, h:mm A')}${
                sale?.saleOpenedBy
                  ? ` (opened by ${
                      clerks ? clerks.find((clerk: any) => clerk?.id === sale?.saleOpenedBy)?.name : 'unknown clerk'
                    })`
                  : ''
              }`
            : 'Sale not opened'}
        </div>
        <div className="font-bold">Sale Close</div>
        <div className="mb-4">
          {sale?.dateSaleClosed
            ? `${dayjs(sale?.dateSaleClosed).format('D MMMM YYYY, h:mm A')}${
                sale?.saleClosedBy
                  ? ` (closed by ${
                      clerks ? clerks.find((clerk: any) => clerk?.id === sale?.saleClosedBy)?.name : 'unknown clerk'
                    })`
                  : ''
              }`
            : 'Sale not closed'}
        </div>
        {sale?.isMailOrder ? (
          <div>
            <div className="font-bold">Postage</div>
            <div className="mb-4">{sale?.postage ? `$${sale?.postage}` : 'N/A'}</div>
            <div className="font-bold">Postal Address</div>
            <div className="mb-4">{sale?.postalAddress || 'N/A'}</div>
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
                <img alt="Weather Icon" src={`http://openweathermap.org/img/w/${weather?.weather?.[0]?.icon}.png`} />
              </div>
              <div>
                <div className="font-bold">{`${weather?.weather?.[0]?.main} (${weather?.weather?.[0]?.description})`}</div>
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
