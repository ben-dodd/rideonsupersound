import Tabs from "@/components/_components/navigation/tabs";
import { filterInventory, getImageSrc, getItemSku } from "@/lib/data-functions";
import {
  useVendorByUid,
  useVendorPaymentsByUid,
  useVendorSalesByUid,
  useVendorStockByUid,
  useVendorStockMovementByUid,
  useVendorStockPriceByUid,
} from "@/lib/swr-hooks";
import { StockObject } from "@/lib/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VendorScreen() {
  const router = useRouter();
  const { id } = router.query;
  // const [uid, setUid] = useState(null);
  // useEffect(() => {
  //   if (!router.isReady) {
  //     const { id } = router.query;
  //     console.log(id);
  //     setUid(id);
  //   }
  // }, [router.isReady]);
  const { vendor, isVendorLoading, isVendorError } = useVendorByUid(id);
  const { vendorStock, isVendorStockLoading, isVendorStockError } =
    useVendorStockByUid(id);
  const {
    vendorStockMovement,
    isVendorStockMovementLoading,
    isVendorStockMovementError,
  } = useVendorStockMovementByUid(id);
  const {
    vendorStockPrice,
    isVendorStockPriceLoading,
    isVendorStockPriceError,
  } = useVendorStockPriceByUid(id);
  const { vendorSales, isVendorSalesLoading, isVendorSalesError } =
    useVendorSalesByUid(id);
  const { vendorPayments, isVendorPaymentsLoading, isVendorPaymentsError } =
    useVendorPaymentsByUid(id);
  const loading =
    isVendorLoading ||
    isVendorStockLoading ||
    isVendorStockMovementLoading ||
    isVendorStockPriceLoading ||
    isVendorSalesLoading ||
    isVendorPaymentsLoading;
  const error =
    isVendorError ||
    isVendorStockError ||
    isVendorStockMovementError ||
    isVendorStockPriceError ||
    isVendorSalesError ||
    isVendorPaymentsError;

  const [tab, setTab] = useState(0);
  const [stockSearch, setStockSearch] = useState("");

  // Functions
  function StockItem({ item }) {
    return (
      <div
        className={`flex w-full mb-2 pr-2 text-black ${
          item?.quantity < 1 ? "bg-pink-100" : "bg-gray-200"
        }`}
      >
        <div className="w-32">
          <div
            className={`w-32 h-32 relative${
              item?.quantity < 1 ? " opacity-50" : ""
            }`}
          >
            <img
              className="object-cover absolute"
              src={getImageSrc(item)}
              alt={item?.title || "Inventory image"}
            />
          </div>
          <div className="text-lg font-bold text-center bg-black text-white">
            {getItemSku(item)}
          </div>
        </div>
        <div className="flex flex-col justify-between pl-2 w-full">
          <div>
            <div className="flex justify-between border-b items-center border-gray-400">
              <div>
                <div className="font-bold text-md">{`${
                  item?.title || "Untitled"
                }`}</div>
                <div className="text-md">{`${item?.artist || "Untitled"}`}</div>
              </div>
              <div className="text-red-400 font-bold text-3xl">
                {item?.quantity < 1 ? "OUT OF STOCK!" : ""}
              </div>
            </div>
            <div className="text-sm text-green-800">{`${
              item?.genre ? `${item.genre} / ` : ""
            }${item?.format} [${
              item?.is_new ? "NEW" : item?.cond?.toUpperCase() || "USED"
            }]`}</div>
          </div>

          <div className="flex justify-between items-end">
            <div
              className={`text-md ${item?.quantity < 1 && "text-red-500"}`}
            >{`${item?.quantity} in stock${
              item?.quantity_hold ? `, ${-item?.quantity_hold} on hold` : ""
            }${
              item?.quantity_layby ? `, ${-item?.quantity_layby} on layby` : ""
            }`}</div>
            <div className="text-xl pr-2">{`$${(
              (item?.total_sell || 0) / 100
            )?.toFixed(2)}`}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>RIDE ON SUPER SOUND VENDOR SHEET</title>
      </Head>
      {loading ? (
        <div className="flex h-screen w-screen p-8">
          <div className="loading-icon" />
        </div>
      ) : error ? (
        <div className="flex h-screen w-screen p-8">
          AN UNKNOWN ERROR HAS OCCURRED!
        </div>
      ) : (
        <div className="flex h-screen w-screen p-8 content-center">
          <div className="w-1/2">
            <div className="pb-4">
              <img
                src="http://hmn.exu.mybluehost.me/img/POS-RIDEONSUPERSOUNDLOGOBLACK.png"
                width="500px"
              />
            </div>
            <Tabs
              tabs={["Summary", "Stock List", "Sales", "Payments"]}
              value={tab}
              onChange={setTab}
            />
            <div hidden={tab !== 0}>Summary</div>
            <div hidden={tab !== 1}>
              <div className="w-full">
                <input
                  type="text"
                  className="w-full p-1 border border-gray-200 mb-8"
                  onChange={(e) => setStockSearch(e.target.value)}
                  placeholder="Search.."
                />
                {filterInventory({
                  inventory: vendorStock?.sort(
                    (a: StockObject, b: StockObject) => {
                      if (a?.quantity === b?.quantity) return 0;
                      if (a?.quantity < 1) return 1;
                      if (b?.quantity < 1) return -1;
                      return 0;
                    }
                  ),
                  search: stockSearch,
                  slice: 1000,
                  emptyReturn: true,
                })?.map((item: StockObject) => (
                  <StockItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div hidden={tab !== 2}>Sales</div>
            <div hidden={tab !== 3}>Payments</div>
          </div>
        </div>
      )}
    </>
  );
}
