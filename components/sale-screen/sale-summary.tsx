import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { format, parseISO } from "date-fns";
import nz from "date-fns/locale/en-NZ";
import { cartAtom, saleAtom } from "@/lib/atoms";
import { useContact, useClerks, useInventory } from "@/lib/swr-hooks";
import {
  convertMPStoKPH,
  convertDegToCardinal,
  getSaleVars,
} from "@/lib/data-functions";
import { SaleTransactionObject } from "@/lib/types";
import ItemListItem from "./item-list-item";
import TransactionListItem from "./transaction-list-item";

export default function SaleSummary({ isCart }) {
  const [cart] = useAtom(isCart ? cartAtom : saleAtom);
  const { clerks } = useClerks();
  const saleComplete = Boolean(cart?.state === "complete");
  const { contact } = useContact(cart?.contact_id);
  const { inventory } = useInventory();

  const [totalPrice, setTotalPrice] = useState(0);
  const [storeCut, setStoreCut] = useState(0);
  const [vendorCut, setVendorCut] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  useEffect(() => {
    const {
      totalPrice,
      totalStoreCut,
      totalVendorCut,
      totalRemaining,
    } = getSaleVars(cart, inventory);
    setRemainingBalance(totalRemaining);
    setTotalPrice(totalPrice);
    setStoreCut(totalStoreCut);
    setVendorCut(totalVendorCut);
  }, [cart]);

  // console.log(cart);

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
      {saleComplete ? <SaleWeatherAndLocation cart={cart} /> : <div />}
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
            value: cart?.items?.length || 0,
          },
          {
            label: "Sale Opened By",
            value: clerks
              ? clerks.filter(
                  (clerk: any) => clerk?.id === cart?.sale_opened_by
                )[0]?.name
              : "N/A",
          },
          {
            label: "Date Opened",
            value: cart?.date_sale_opened
              ? format(parseISO(cart?.date_sale_opened), "d MMMM yyyy, p", {
                  locale: nz,
                })
              : "N/A",
          },
          {
            label: "Sale Closed By",
            value: clerks
              ? clerks.filter(
                  (clerk: any) => clerk?.id === cart?.sale_closed_by
                )[0]?.name
              : "N/A",
          },
          {
            label: "Date Closed",
            value: cart?.date_sale_closed
              ? format(parseISO(cart?.date_sale_closed), "d MMMM yyyy, p", {
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
        {cart?.note && (
          <div>
            <div className="font-bold">Notes</div>
            <div className="italic">{cart?.note}</div>
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
        {(cart?.items || []).length > 0 ? (
          cart?.items?.map((cartItem) => (
            <ItemListItem key={cartItem?.item_id} cartItem={cartItem} />
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
              vendorCut < 0 && "text-red-400"
            }`}
          >
            {`$${vendorCut.toFixed(2)}`}
          </div>
        </div>
        <div className="flex justify-end border-gray-500">
          <div>STORE CUT</div>
          <div
            className={`text-right w-2/12 text-gray-600 ${
              storeCut < 0 && "text-tertiary-dark"
            }`}
          >
            {`$${storeCut.toFixed(2)}`}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL</div>
          <div className="text-right w-2/12 font-bold">
            ${totalPrice !== null ? totalPrice.toFixed(2) : "0.00"}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL PAID</div>
          <div className="text-right w-2/12 font-bold text-secondary-dark">
            ${(totalPrice - remainingBalance).toFixed(2)}
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <div>TOTAL OWING</div>
          <div className="text-right w-2/12 font-bold text-tertiary-dark">
            ${remainingBalance.toFixed(2)}
          </div>
        </div>
      </>
    );
  }

  function TransactionItems() {
    return (
      <div className="mt-1 pt-1 border-t border-gray-500 max-h-1/3 overflow-y-scroll">
        {cart?.transactions?.map((transaction: SaleTransactionObject) => (
          <TransactionListItem
            key={transaction?.id}
            sale={cart}
            transaction={transaction}
            // let transactions = {
            //   ...get(saleDialog, "transactions", {}),
            //   [id]: { ...payment, deleted: doDelete },
            // };
            // dispatch(
            //   updateLocal("cart", {
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

  function SaleWeatherAndLocation({ cart }) {
    const weather = cart?.weather;
    const latitude = cart?.geo_latitude;
    const longitude = cart?.geo_longitude;
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
              <div>{`${weather?.main?.temp.toFixed(
                1
              )}°C (felt like ${weather?.main?.feels_like.toFixed(1)}°C)`}</div>
              {weather?.wind && (
                <div>
                  Wind was {convertMPStoKPH(weather?.wind?.speed).toFixed(1)}
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
