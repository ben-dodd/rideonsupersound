import { useAtom } from "jotai";
import { format, parseISO } from "date-fns";
import nz from "date-fns/locale/en-NZ";
import { newSaleObjectAtom, loadedSaleObjectAtom } from "@/lib/atoms";
import { useContact, useClerks } from "@/lib/swr-hooks";
import { convertMPStoKPH, convertDegToCardinal } from "@/lib/data-functions";
import { SaleTransactionObject } from "@/lib/types";
import ItemListItem from "./item-list-item";
import TransactionListItem from "./transaction-list-item";

export default function SaleSummary({ isNew }) {
  const [sale] = useAtom(isNew ? newSaleObjectAtom : loadedSaleObjectAtom);
  const { clerks } = useClerks();
  const saleComplete = Boolean(sale?.state === "complete");
  const { contact } = useContact(sale?.contact_id);

  // console.log(sale);

  return (
    <div className="flex flex-col justify-between p-2 bg-blue-200 text-black">
      {saleComplete ? (
        <>
          <SaleHeader />
          <SaleInformation />
        </>
      ) : (
        <SaleInformation />
      )}
      {saleComplete ? <SaleWeatherAndLocation sale={sale} /> : <div />}
    </div>
  );

  function SaleHeader() {
    return (
      <div className="p-4 mb-2 bg-blue-100 text-gray-800">
        {contact && (
          <div className="flex">
            <div className="w-1/3 font-bold">Contact</div>
            <div>{contact?.name}</div>
          </div>
        )}
        {[
          {
            label: "# of Items",
            value: sale?.items?.length || 0,
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
              ? format(parseISO(sale?.date_sale_opened), "d MMMM yyyy, p", {
                  locale: nz,
                })
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
              ? format(parseISO(sale?.date_sale_closed), "d MMMM yyyy, p", {
                  locale: nz,
                })
              : "N/A",
          },
        ].map((item) => (
          <div className="flex" key={item?.label}>
            <div className="w-1/3 font-bold">{item?.label}</div>
            <div>{item?.value}</div>
          </div>
        ))}
        {sale?.note && (
          <div>
            <div className="font-bold">Notes</div>
            <div className="italic">{sale?.note}</div>
          </div>
        )}
      </div>
    );
  }

  function SaleInformation() {
    return (
      <div
        className={`flex flex-col justify-start h-menusm bg-gray-100 p-4 rounded-md`}
      >
        {!saleComplete && <div className="text-xl mb-2">Sale Summary</div>}
        <SaleItems />
        <SaleDetails />
        <TransactionItems />
      </div>
    );
  }

  function SaleItems() {
    return (
      <div className="max-h-2/5 overflow-y-scroll">
        {(sale?.items || []).length > 0 ? (
          sale?.items?.map((saleItem) => (
            <ItemListItem key={saleItem?.item_id} saleItem={saleItem} />
          ))
        ) : (
          <div>No items in cart...</div>
        )}
      </div>
    );
  }

  function SaleDetails() {
    return (
      <>
        <div className="flex justify-end mt-2 pt-2 border-t border-gray-500">
          <div>VENDOR CUT</div>
          <div
            className={`text-right w-2/12 text-gray-600 ${
              sale?.totalVendorCut < 0 && "text-red-400"
            }`}
          >
            {`$${sale?.totalVendorCut?.toFixed(2)}`}
          </div>
        </div>
        <div className="flex justify-end border-gray-500">
          <div>STORE CUT</div>
          <div
            className={`text-right w-2/12 text-gray-600 ${
              sale?.totalStoreCut < 0 && "text-tertiary-dark"
            }`}
          >
            {`$${sale?.totalStoreCut?.toFixed(2)}`}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL</div>
          <div className="text-right w-2/12 font-bold">
            ${sale?.totalPrice !== null ? sale?.totalPrice?.toFixed(2) : "0.00"}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL PAID</div>
          <div className="text-right w-2/12 font-bold text-secondary-dark">
            ${(sale?.totalPrice - sale?.totalRemaining)?.toFixed(2)}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL OWING</div>
          <div className="text-right w-2/12 font-bold text-tertiary-dark">
            ${sale?.totalRemaining?.toFixed(2)}
          </div>
        </div>
      </>
    );
  }

  function TransactionItems() {
    return (
      <div className="mt-1 pt-1 border-t border-gray-500 max-h-1/3 overflow-y-scroll">
        {sale?.transactions?.map((transaction: SaleTransactionObject) => (
          <TransactionListItem
            key={transaction?.id}
            sale={sale}
            transaction={transaction}
            // let transactions = {
            //   ...get(saleDialog, "transactions", {}),
            //   [id]: { ...payment, deleted: doDelete },
            // };
            // dispatch(
            //   updateLocal("sale", {
            //     transactions,
            //   })
            // );
            // dispatch(
            //   updateDialog("sale", {
            //     transactions,
            //   })
            // );
            // if (payment.type === "GIFT")
            //   returnMoneyToGiftCard({ payment, giftCards, dispatch });
            // else if (payment.type === "ACCT")
            //   returnMoneyToAccount({ payment, contactVendor, dispatch });
            // }}
          />
        ))}
      </div>
    );
  }

  function SaleWeatherAndLocation({ sale }) {
    const weather = sale?.weather;
    const latitude = sale?.geo_latitude;
    const longitude = sale?.geo_longitude;
    return (
      <div className="px-2 w-1/2">
        {weather && (
          <div className="flex bg-blue-200 p-2 mb-2 rounded-md">
            <div>
              <img
                src={`http://openweathermap.org/img/w/${weather?.weather[0]?.icon}.png`}
              />
            </div>
            <div>
              <div className="font-bold">{`${weather?.weather[0]?.main} (${weather?.weather[0]?.description})`}</div>
              <div>{`${weather?.main?.temp?.toFixed(
                1
              )}°C (felt like ${weather?.main?.feels_like?.toFixed(
                1
              )}°C)`}</div>
              {weather?.wind && (
                <div>
                  Wind was {convertMPStoKPH(weather?.wind?.speed)?.toFixed(1)}
                  km/hr, {convertDegToCardinal(weather?.wind?.deg)}
                </div>
              )}
            </div>
          </div>
        )}
        {latitude && longitude && (
          <iframe
            width="400"
            height="400"
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_API_KEY}
      &q=${latitude},${longitude}`}
          ></iframe>
        )}
      </div>
    );
  }
}
