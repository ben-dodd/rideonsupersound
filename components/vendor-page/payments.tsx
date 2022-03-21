import { VendorPaymentTypes } from "@/lib/types";
import dayjs from "dayjs";

export default function Payments({ id, payments }) {
  return (
    <div className="w-full">
      <div className="bg-orange-800 text-white font-bold italic px-2 py-1 mb-2 mt-8">
        RIDE ON SUPER SOUND PAYMENTS
      </div>

      {payments?.length === 0 ? (
        <div>NO PAYMENTS</div>
      ) : (
        <div>
          <div className="flex bg-black py-2 text-white text-xs">
            <div className="w-1/12 px-1">DATE PAID</div>
            <div className="w-1/6 px-1 text-right">AMOUNT PAID</div>
            <div className="w-1/6 px-1">PAYMENT TYPE</div>
            <div className="w-5/12 px-1">REFERENCE</div>
          </div>
          {payments?.map((pay) => {
            return (
              <div
                key={`${pay?.id}`}
                className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-transparent"
              >
                <div className="w-1/12 px-1">
                  {dayjs(pay?.date).format("DD/MM/YYYY")}
                </div>
                <div className="w-1/6 px-1 text-right">
                  ${(pay?.amount / 100)?.toFixed(2)}
                </div>
                <div className="w-1/6 px-1 uppercase">{pay?.type}</div>
                <div className="w-5/12 px-1">
                  {pay?.type === VendorPaymentTypes?.DC
                    ? pay?.bank_reference
                    : `SALE`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
