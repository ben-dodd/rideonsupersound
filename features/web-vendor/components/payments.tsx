import { VendorPaymentTypes } from "@/lib/types";
import dayjs from "dayjs";

export default function Payments({ payments, storeCredits }) {
  console.log(payments);
  console.log(storeCredits);
  return (
    <div className="w-full">
      <div className="bg-orange-800 text-white font-bold italic px-2 py-1 mb-2">
        RIDE ON SUPER SOUND PAYMENTS
      </div>

      {payments?.length === 0 ? (
        <div>NO PAYMENTS</div>
      ) : (
        <div>
          <div className="flex bg-black py-2 text-white text-xs">
            <div className="w-2/12 md:w-1/12 px-1">DATE PAID</div>
            <div className="w-1/6 px-1 text-right">AMOUNT PAID</div>
            <div className="w-1/6 px-1">PAYMENT TYPE</div>
            <div className="w-4/12 md:w-5/12 px-1">REFERENCE</div>
          </div>
          {payments?.map((pay) => {
            return (
              <div
                key={`${pay?.id}`}
                className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-white"
              >
                <div className="w-2/12 md:w-1/12 px-1">
                  <div className="hidden md:inline">
                    {dayjs(pay?.date).format("DD/MM/YYYY")}
                  </div>
                  <div className="md:hidden">
                    {dayjs(pay?.date).format("DD/MM/YY")}
                  </div>
                </div>
                <div className="w-1/6 px-1 text-right">
                  ${(pay?.amount / 100)?.toFixed(2)}
                </div>
                <div className="w-1/6 px-1 uppercase">{pay?.type}</div>
                <div className="w-4/12 md:w-5/12 px-1">
                  {pay?.type === VendorPaymentTypes?.DC ||
                  pay?.type === VendorPaymentTypes.Batch
                    ? pay?.bank_reference
                    : pay?.type === VendorPaymentTypes.Sale
                    ? storeCredits?.filter(
                        (s) => s?.vendor_payment_id === pay?.id
                      )?.[0]?.item_list ||
                      pay?.note ||
                      ""
                    : pay?.note || ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
