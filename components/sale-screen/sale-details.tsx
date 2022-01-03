// DB
import { useClerks, useCustomers, useInventory } from "@/lib/swr-hooks";
import {
  CustomerObject,
  OpenWeatherObject,
  SaleItemObject,
  SaleStateTypes,
} from "@/lib/types";

// Functions
import {
  convertMPStoKPH,
  convertDegToCardinal,
  getSaleVars,
  fDateTime,
} from "@/lib/data-functions";
import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";
import ReturnIcon from "@mui/icons-material/KeyboardReturn";

export default function SaleDetails({ sale }) {
  const [view, setView] = useAtom(viewAtom);
  // SWR
  const { clerks } = useClerks();
  const { customers } = useCustomers();
  const { inventory } = useInventory();

  // State
  const { totalRemaining } = getSaleVars(sale, inventory);

  // Constants
  const weather: OpenWeatherObject = sale?.weather
    ? sale?.weather instanceof String
      ? JSON.parse(sale?.weather)
      : sale?.weather
    : null;

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between my-2">
        <div
          className={`text-2xl font-bold ${
            totalRemaining === 0
              ? "text-primary"
              : totalRemaining < 0
              ? "text-secondary"
              : "text-tertiary"
          }`}
        >
          {sale?.state === SaleStateTypes.Completed
            ? "SALE COMPLETED"
            : totalRemaining === 0
            ? "ALL PAID"
            : totalRemaining < 0
            ? "CUSTOMER OWED"
            : "LEFT TO PAY"}
        </div>
        <div className="text-2xl text-red-500 font-bold text-xl">
          {totalRemaining === 0
            ? ""
            : totalRemaining < 0
            ? `$${Math.abs(totalRemaining || 0)?.toFixed(2)}`
            : `$${(totalRemaining || 0)?.toFixed(2)}`}
        </div>
      </div>
      <div className="px-2">
        <div className="font-bold">Customer</div>
        <div className="mb-4">
          {customers?.filter(
            (c: CustomerObject) => c?.id === sale?.customer_id
          )[0]?.name || "Customer not set"}
        </div>
        <div className="font-bold">Sale Open</div>
        <div className="mb-4">
          {sale?.date_sale_opened
            ? `${fDateTime(sale?.date_sale_opened)} (opened by ${
                clerks
                  ? clerks.filter(
                      (clerk: any) => clerk?.id === sale?.sale_opened_by
                    )[0]?.name
                  : "unknown clerk"
              })`
            : "Sale not opened"}
        </div>
        <div className="font-bold">Sale Close</div>
        <div className="mb-4">
          {sale?.date_sale_closed
            ? `${fDateTime(sale?.date_sale_closed)} (opened by ${
                clerks
                  ? clerks.filter(
                      (clerk: any) => clerk?.id === sale?.sale_closed_by
                    )[0]?.name
                  : "unknown clerk"
              })`
            : "Sale not closed"}
        </div>
        <div className="font-bold">Notes</div>
        <div className="mb-4">{sale?.note || "N/A"}</div>
        {sale?.items?.filter(
          (item: SaleItemObject) => !item?.is_deleted && !item?.is_refunded
        )?.length > 0 && (
          <div>
            <button
              className="icon-text-button ml-0"
              onClick={() => setView({ ...view, returnItemDialog: true })}
            >
              <ReturnIcon className="mr-1" /> Return Items
            </button>
          </div>
        )}
        {/*weather && (
          <div className="bg-blue-200 p-2 my-2 rounded-md">
            <div className="font-bold">Weather</div>
            <div className="flex">
              <div>
                <img
                  src={`http://openweathermap.org/img/w/${weather?.weather[0]?.icon}.png`}
                />
              </div>
              <div>
                <div className="font-bold">{`${weather?.weather[0]?.main} (${weather?.weather[0]?.description})`}</div>
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
                )*/}
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
  );
}
// TODO Add refund items/ refund transactions
// TODO Add split sale for when person wants to take one layby item etc.
