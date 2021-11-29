// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useClerks,
  useCustomers,
  useSaleTransactionsForSale,
  useSaleItemsForSale,
  useInventory,
} from "@/lib/swr-hooks";
import { viewAtom, loadedCustomerObjectAtom } from "@/lib/atoms";
import { CustomerObject, OpenWeatherObject, SaleStateTypes } from "@/lib/types";

// Functions
import {
  convertMPStoKPH,
  convertDegToCardinal,
  getSaleVars,
  fDateTime,
} from "@/lib/data-functions";

// Components
import CreateableSelect from "@/components/_components/inputs/createable-select";
import TextField from "@/components/_components/inputs/text-field";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

import DeleteIcon from "@mui/icons-material/Delete";
import RefundIcon from "@mui/icons-material/Payment";
import ReturnIcon from "@mui/icons-material/KeyboardReturn";
import SplitIcon from "@mui/icons-material/CallSplit";

export default function Pay({ sale }) {
  // Atoms
  const [, setCustomer] = useAtom(loadedCustomerObjectAtom);
  const [view, setView] = useAtom(viewAtom);

  // SWR
  const { clerks } = useClerks();
  const { customers } = useCustomers();
  const { items } = useSaleItemsForSale(sale?.id);
  const { transactions } = useSaleTransactionsForSale(sale?.id);
  const { inventory } = useInventory();

  // State
  const [note, setNote] = useState("");
  const { totalRemaining, totalPaid } = getSaleVars(
    items,
    transactions,
    inventory
  );
  const [isRefund, setIsRefund] = useState(false);

  // Constants
  const weather: OpenWeatherObject = sale?.weather
    ? JSON.parse(sale?.weather)
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
        <div className="bg-white rounded border">
          {[
            // {
            //   label: "Number of Items",
            //   value: items?.reduce(
            //     (acc: number, i: SaleItemObject) => acc + parseInt(i?.quantity),
            //     0
            //   ),
            // },
            {
              label: "Customer",
              value:
                customers?.filter(
                  (c: CustomerObject) => c?.id === sale?.customer_id
                )[0]?.name || "N/A",
            },
            {
              label: "Sale Opened By",
              value: clerks
                ? clerks.filter(
                    (clerk: any) => clerk?.id === sale?.sale_opened_by
                  )[0]?.name
                : "N/A",
            },
            {
              label: "Date Opened",
              value: sale?.date_sale_opened
                ? fDateTime(sale?.date_sale_opened)
                : "N/A",
            },
            {
              label: "Sale Closed By",
              value: clerks
                ? clerks.filter(
                    (clerk: any) => clerk?.id === sale?.sale_closed_by
                  )[0]?.name
                : "N/A",
            },
            {
              label: "Date Closed",
              value: sale?.date_sale_closed
                ? fDateTime(sale?.date_sale_closed)
                : "N/A",
            },
            { label: "Notes", value: sale?.note || "N/A" },
          ].map((item) => (
            <div key={item?.label} className="flex border p-2 hover:bg-gray-50">
              <div className="font-bold w-2/5">{item?.label}</div>
              <div className="w-3/5">{item?.value}</div>
            </div>
          ))}
        </div>
        {weather && (
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
        )}
        {sale?.geo_latitude && sale?.geo_longitude && (
          <iframe
            className="p-2"
            width="380"
            height="180"
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        &location=${sale?.geo_latitude},${sale?.geo_longitude}&fov=70`}
          ></iframe>
        )}
      </div>
      <TextField
        inputLabel="Note"
        multiline
        value={note}
        onChange={(e: any) => setNote(e.target.value)}
      />
      <div className="grid grid-cols-2">
        <button
          className="icon-text-button"
          onClick={() => setView({ ...view, returnItemDialog: true })}
        >
          <ReturnIcon className="mr-1" /> Refund Items
        </button>
        <button
          className="icon-text-button"
          onClick={() => setView({ ...view, refundPaymentDialog: true })}
          disabled={totalPaid <= 0}
        >
          <RefundIcon className="mr-1" /> Refund Payment
        </button>
        <button
          className="icon-text-button"
          onClick={() => setView({ ...view, splitSaleDialog: true })}
        >
          <SplitIcon className="mr-1" /> Split Sale
        </button>
        <button className="icon-text-button">
          <DeleteIcon className="mr-1" /> Delete Sale
        </button>
      </div>
    </div>
  );
}

// TODO Add refund items/ refund transactions
// TODO Add split sale for when person wants to take one layby item etc.
