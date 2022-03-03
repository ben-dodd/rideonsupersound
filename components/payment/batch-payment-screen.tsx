// Packages
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useInventory,
  useRegisterID,
  useSalesJoined,
  useVendorPayments,
  useVendors,
} from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, receiveStockAtom } from "@/lib/atoms";
import { ModalButton, VendorObject } from "@/lib/types";
import StoreCreditOnlyIcon from "@mui/icons-material/ShoppingBag";
import NoBankDetailsIcon from "@mui/icons-material/CreditCardOff";
import QuantityCheckIcon from "@mui/icons-material/Warning";

// Functions
import { receiveStock } from "@/lib/db-functions";

// Components
import ScreenContainer from "@/components/_components/container/screen";
import {
  getVendorDetails,
  isValidBankAccountNumber,
  writeKiwiBankBatchFile,
} from "@/lib/data-functions";
import dayjs from "dayjs";
import TextField from "../_components/inputs/text-field";
import { Tooltip } from "@mui/material";

// Icons

export default function BatchPaymentScreen() {
  // Atoms
  const [view, setView] = useAtom(viewAtom);

  // SWR
  const { registerID } = useRegisterID();
  const { inventory, isInventoryLoading } = useInventory();
  const { sales, isSalesLoading } = useSalesJoined();
  const { vendorPayments, isVendorPaymentsLoading } = useVendorPayments();
  const { vendors, isVendorsLoading } = useVendors();

  const [vendorList, setVendorList] = useState([]);
  const [stage, setStage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectOwed, setSelectOwed] = useState(true);
  const [selectDate, setSelectDate] = useState(true);

  useEffect(() => {
    let vList = [];
    vendors?.forEach((v) => {
      let vendorVars = getVendorDetails(
        inventory,
        sales,
        vendorPayments,
        v?.id
      );
      vList.push({
        ...v,
        ...vendorVars,
        is_checked:
          !v?.store_credit_only &&
          (vendorVars?.totalOwing >= 2000 ||
            (dayjs().diff(vendorVars?.lastPaid, "month") >= 3 &&
              vendorVars?.totalOwing > 0) ||
            (dayjs().diff(vendorVars?.lastSold, "month") >= 3 &&
              !vendorVars?.lastPaid))
            ? true
            : false,
        payAmount: (
          (vendorVars?.totalOwing > 0 ? vendorVars?.totalOwing : 0) / 100
        )?.toFixed(2),
      });
    });
    setVendorList(
      vList?.sort((a, b) => {
        if (!a?.is_checked && b?.is_checked) return 1;
        if (!b?.is_checked && a?.is_checked) return -1;
        return b?.totalOwing - a?.totalOwing;
      })
    );
  }, [
    isVendorsLoading,
    isInventoryLoading,
    isSalesLoading,
    isVendorPaymentsLoading,
  ]);

  console.log(vendorList);

  const buttons: ModalButton[] =
    stage === 0
      ? [
          {
            type: "ok",
            text: "NEXT",
            onClick: () => setStage(1),
            disabled:
              vendorList?.reduce(
                (prev, v) =>
                  isNaN(parseFloat(v?.payAmount)) ? prev + 1 : prev,
                0
              ) > 0,
          },
        ]
      : [
          {
            type: "cancel",
            onClick: () => setStage(0),
            text: "BACK",
          },
          {
            type: "ok",
            text: "OK",
            // disabled: !basket?.vendor_id,
            // onClick: () => {
            //   payVendors
            //     .filter(
            //       (vendor: VendorObject) =>
            //         vendor?.bank_account_number &&
            //         parseFloat(
            //           paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
            //         ) > 0
            //     )
            //     .forEach(async (vendor: VendorObject) => {
            //       let vendorPayment = {
            //         amount: Math.round(
            //           parseFloat(
            //             paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
            //           ) * 100
            //         ),
            //         bank_account_number: vendor?.bank_account_number,
            //         batch_number: "Test",
            //         sequence_number: "Test",
            //         clerk_id: clerk?.id,
            //         vendor_id: vendor?.id,
            //         register_id: registerID,
            //         type: "batch",
            //       };
            //       saveVendorPaymentToDatabase(vendorPayment).then((id) => {
            //         mutateVendorPayments([
            //           ...vendorPayments,
            //           { ...vendorPayment, id },
            //         ]);
            //         mutateCashGiven();
            //         saveLog(
            //           {
            //             log: `Batch payment made to Vendor (${vendor?.id || ""}).`,
            //             clerk_id: clerk?.id,
            //             table_id: "vendor_payment",
            //             row_id: id,
            //           },
            //           logs,
            //           mutateLogs
            //         );
            //       });
            //     });
            // },
            fileName: `batch-payment-${dayjs().format("YYYY-MM-DD")}.csv`,
            data: writeKiwiBankBatchFile({
              transactions: [],
              // transactions: payVendors
              //   .filter(
              //     (vendor: VendorObject) =>
              //       vendor?.bank_account_number &&
              //       parseFloat(
              //         paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
              //       ) > 0
              //   )
              //   .map((vendor: VendorObject) => ({
              //     name: vendor?.name || "",
              //     vendor_id: `${vendor?.id || ""}`,
              //     accountNumber: vendor?.bank_account_number || "",
              //     amount: parseFloat(
              //       paymentAmounts[vendor?.id] || vendor?.totalOwing || "0"
              //     ),
              //   })),
              batchNumber: `${registerID}`,
              sequenceNumber: "Test",
            }),
            onClick: () => {
              setView({ ...view, batchVendorPaymentScreen: false });
            },
          },
        ];

  const totalPay = vendorList?.reduce(
    (prev, v) => (v?.is_checked ? parseFloat(v?.payAmount) : 0) + prev,
    0
  );

  const vendorNum = vendorList?.reduce(
    (prev, v) => (v?.is_checked ? 1 : 0) + prev,
    0
  );

  return (
    <ScreenContainer
      show={view?.batchVendorPaymentScreen}
      closeFunction={() =>
        setView({ ...view, batchVendorPaymentScreen: false })
      }
      title={"BATCH PAYMENTS"}
      buttons={buttons}
      titleClass="bg-col4"
    >
      <>
        <div className="w-full" hidden={stage === 1}>
          <div className="flex justify-between">
            <div className="flex">
              <img
                width="80"
                src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/KiwiBank.png`}
                alt={"KiwiBank"}
              />
              {/* <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              /> */}
              {/* <button
                className={`py-1 px-2 border border-black rounded-xl mt-2${
                  selectOwed ? " bg-tertiary-light" : ""
                }`}
                onClick={() =>
                  setVendorList(
                    vendorList?.map((v) =>
                      v?.totalOwing > 2000 ? { ...v, is_checked: true } : v
                    )
                  )
                }
              >
                Select all owed more than $20
              </button> */}
            </div>
            <div className="text-red-400 text-2xl font-bold text-right">
              {vendorList?.filter((v) => isNaN(parseFloat(v?.payAmount)))
                ?.length > 0
                ? `CHECK PAY ENTRIES`
                : `PAY $${parseFloat(
                    totalPay
                  ).toLocaleString()}\nto ${vendorNum} VENDORS`}
            </div>
          </div>
          <div className="w-full">
            <div className="flex font-bold py-2 px-2 border-b border-black">
              <div className="w-3/12">NAME</div>
              <div className="w-1/12">TAKE</div>
              <div className="w-1/12">OWED</div>
              <div className="w-2/12">LAST SALE</div>
              <div className="w-2/12">LAST PAID</div>
              <div className="w-3/12">AMOUNT TO PAY</div>
            </div>
            <div className="h-dialog overflow-y-scroll">
              {vendorList?.map((v) => (
                <div
                  key={v?.id}
                  className={`flex py-4 px-2 w-full items-center border-b border-t ${
                    v?.is_checked
                      ? "bg-yellow-100"
                      : v?.totalOwing <= 0
                      ? "bg-gray-100"
                      : ""
                  }`}
                >
                  <div className="w-3/12 flex">
                    <input
                      type="checkbox"
                      disabled={v?.totalOwing <= 0}
                      className="cursor-pointer"
                      checked={v?.is_checked}
                      onChange={(e) =>
                        setVendorList(
                          vendorList?.map((vendor) =>
                            vendor?.id === v?.id
                              ? { ...vendor, is_checked: e.target.checked }
                              : vendor
                          )
                        )
                      }
                    />
                    <div className="pl-4">{`[${v?.id}] ${v?.name}`}</div>
                  </div>
                  <div className="w-1/12">{`$${(
                    (v?.totalSell || 0) / 100
                  )?.toFixed(2)}`}</div>
                  <div
                    className={`w-1/12${
                      v?.totalOwing < 0 ? " text-red-500" : ""
                    }`}
                  >{`${v?.totalOwing < 0 ? "(" : ""}$${(
                    Math.abs(v?.totalOwing || 0) / 100
                  )?.toFixed(2)}${v?.totalOwing < 0 ? ")" : ""}`}</div>
                  <div className="w-2/12">
                    {v?.lastSold
                      ? dayjs(v?.lastSold).format("D MMMM YYYY")
                      : "NO SALES"}
                  </div>
                  <div className="w-2/12">
                    {v?.lastPaid
                      ? dayjs(v?.lastPaid).format("D MMMM YYYY")
                      : "NEVER PAID"}
                  </div>
                  <div className="w-2/12 flex">
                    <TextField
                      disabled={v?.totalOwing <= 0 || !v?.is_checked}
                      error={isNaN(parseFloat(v?.payAmount))}
                      startAdornment={"$"}
                      value={v?.payAmount || ""}
                      onChange={(e) =>
                        setVendorList(
                          vendorList?.map((vendor) =>
                            vendor?.id === v?.id
                              ? { ...vendor, payAmount: e.target.value }
                              : vendor
                          )
                        )
                      }
                    />
                  </div>
                  <div className="w-1/12 flex">
                    {v?.store_credit_only ? (
                      <div className="text-green-500 pl-2">
                        <Tooltip title="Store Credit Only">
                          <StoreCreditOnlyIcon />
                        </Tooltip>
                      </div>
                    ) : !isValidBankAccountNumber(v?.bank_account_number) ? (
                      <Tooltip
                        title={`${
                          v?.bank_account_number ? "Invalid" : "Missing"
                        } Bank Account Number`}
                      >
                        <div
                          className={`${
                            v?.bank_account_number
                              ? "text-orange-500"
                              : "text-red-500"
                          } pl-2 flex`}
                        >
                          {/* {v?.bank_account_number
                            ? v?.bank_account_number
                            : "NO BANK ACCOUNT NUMBER"} */}
                          <NoBankDetailsIcon />
                        </div>
                      </Tooltip>
                    ) : (
                      <div />
                    )}
                    {v?.totalItems?.filter((i) => i?.quantity < 0)?.length >
                    0 ? (
                      <Tooltip title="Vendor has negative quantity items. Please check!">
                        <div className="text-purple-500 pl-2">
                          <QuantityCheckIcon />
                        </div>
                      </Tooltip>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full" hidden={stage === 0}>
          {vendorList
            ?.filter((v) => v?.is_checked)
            ?.map((v) => (
              <div key={v?.id} className="border-b flex">
                <div className="w-2/3">{`[${v?.id}] ${v?.name}`}</div>
                <div className="w-1/3">{`$${parseFloat(v?.payAmount)?.toFixed(
                  2
                )}`}</div>
              </div>
            ))}
        </div>
      </>
    </ScreenContainer>
  );
}
