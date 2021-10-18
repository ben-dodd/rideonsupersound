import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { clerkAtom, showCloseRegisterScreenAtom } from "@/lib/atoms";
import {
  useClerks,
  useRegisterID,
  useRegister,
  usePettyCash,
  useManualPayments,
  useCashGiven,
  useCashReceived,
} from "@/lib/swr-hooks";
import { ClerkObject, ModalButton } from "@/lib/types";
import { fTimeDate, getAmountFromCashMap } from "@/lib/data-functions";
import { saveClosedRegisterToDatabase } from "@/lib/db-functions";

import TextField from "@/components/inputs/text-field";
import ScreenContainer from "@/components/container/screen";
import CashItem from "./cash-item";
import CashMap from "./cash-map";

export default function CloseRegisterScreen() {
  const [clerk] = useAtom(clerkAtom);
  const [showCloseRegisterScreen, setShowCloseRegisterScreen] = useAtom(
    showCloseRegisterScreenAtom
  );
  const { clerks, isClerksLoading } = useClerks();
  const { registerID, mutateRegisterID } = useRegisterID();
  const { register, isRegisterLoading } = useRegister(registerID);
  const [till, setTill] = useState({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [closeAmount, setCloseAmount] = useState(
    `${getAmountFromCashMap(till)}`
  );
  const openAmount = register?.open_amount / 100;
  const openedBy = (clerks || []).filter(
    (c: ClerkObject) => c?.id === register?.opened_by_id
  )[0]?.name;
  const openedOn = fTimeDate(register?.open_date);
  const { pettyCash, isPettyCashLoading } = usePettyCash(register?.id || 0);
  const { cashGiven, isCashGivenLoading } = useCashGiven(register?.id || 0);
  const { cashReceived, isCashReceivedLoading } = useCashReceived(
    register?.id || 0
  );
  const { manualPayments, isManualPaymentsLoading } = useManualPayments(
    register?.id || 0
  );
  const closePettyBalance =
    pettyCash?.reduce(
      (acc: number, transaction) => acc + transaction?.amount,
      0
    ) / 100;
  const closeCashGiven =
    cashGiven?.reduce(
      (acc: number, transaction) => acc + transaction.change_given,
      0
    ) / 100;
  const closeCashReceived =
    cashReceived?.reduce(
      (acc: number, transaction) => acc + transaction.cash_received,
      0
    ) / 100;
  const closeManualPayments =
    manualPayments?.reduce(
      (acc: number, transaction) => acc + transaction.amount,
      0
    ) / 100;
  const closeExpectedAmount =
    openAmount +
    closePettyBalance +
    closeCashReceived -
    closeCashGiven -
    closeManualPayments;
  const invalidCloseAmount = isNaN(parseFloat(closeAmount));
  const closeDiscrepancy = invalidCloseAmount
    ? 0
    : closeExpectedAmount - parseFloat(closeAmount);
  const closeRegister = async () => {
    saveClosedRegisterToDatabase(
      registerID,
      {
        close_amount: parseFloat(closeAmount) * 100,
        closed_by_id: clerk?.id,
        close_petty_balance: closePettyBalance * 100,
        close_cash_given: closeCashGiven * 100,
        close_manual_payments: closeManualPayments * 100,
        close_expected_amount: closeExpectedAmount * 100,
        close_discrepancy: closeDiscrepancy * 100,
        close_note: notes,
      },
      till
    );
    mutateRegisterID([{ value: 0 }], false);
    setShowCloseRegisterScreen(false);
  };
  useEffect(() => setCloseAmount(`${getAmountFromCashMap(till)}`), [till]);
  // const cashList =
  //   cashReceived.length > 0 ||
  //   cashGiven.length > 0 ||
  //   manualPayments.length > 0 ||
  //   pettyCash.length > 0;

  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setShowCloseRegisterScreen(false),
      disabled: invalidCloseAmount,
      text: "CANCEL",
    },
    {
      type: "ok",
      onClick: closeRegister,
      disabled: invalidCloseAmount || submitting,
      loading: submitting,
      text: "CLOSE REGISTER",
    },
  ];

  return (
    <ScreenContainer
      show={Boolean(showCloseRegisterScreen)}
      closeFunction={() => setShowCloseRegisterScreen(false)}
      title={"Close Register"}
      loading={
        isClerksLoading ||
        isCashGivenLoading ||
        isRegisterLoading ||
        isManualPaymentsLoading ||
        isCashReceivedLoading ||
        isPettyCashLoading
      }
      buttons={buttons}
    >
      <div className="flex">
        <div className="w-1/2 mr-12">
          <div className="flex mb-4">
            <div className="w-1/2">
              <div className="text-3xl">Start Float</div>
              <div className="text-3xl text-red-400 py-2">{`$${openAmount?.toFixed(
                2
              )}`}</div>
              <div className="text-xs">{`Opened by ${openedBy} (${openedOn})`}</div>
            </div>
            <div className="w-1/2">
              <div className="text-3xl">Close Float</div>
              <TextField
                className="text-3xl text-red-400"
                startAdornment="$"
                value={`${closeAmount}`}
                onChange={(e: any) => {
                  setCloseAmount(e.target.value);
                }}
              />
            </div>
          </div>
          <div
            className={`text-3xl text-center py-2 ${
              invalidCloseAmount || closeDiscrepancy > 0
                ? "text-tertiary"
                : closeDiscrepancy < 0
                ? "text-secondary"
                : "text-primary"
            }`}
          >{`$${closeExpectedAmount?.toFixed(2)} Expected`}</div>
          <div
            className={`text-xl text-center ${
              invalidCloseAmount || closeDiscrepancy > 0
                ? "text-tertiary"
                : closeDiscrepancy < 0
                ? "text-secondary"
                : "text-primary"
            }`}
          >
            {invalidCloseAmount
              ? "Close amount must be a number"
              : closeDiscrepancy > 0
              ? `Close amount short by $${closeDiscrepancy?.toFixed(2)}`
              : closeDiscrepancy < 0
              ? `Close amount over by $${Math.abs(closeDiscrepancy)?.toFixed(
                  2
                )}`
              : "All square!"}
          </div>
          <CashMap till={till} setTill={setTill} />
          <TextField
            inputLabel="Notes"
            value={notes}
            onChange={(e: any) => setNotes(e.target.value)}
            multiline
          />
        </div>
        <div className="w-1/2">
          {cashReceived?.length > 0 && (
            <>
              <div className="text-xl font-bold mt-4">Cash Received</div>
              {cashReceived?.map((transaction, i) => (
                <CashItem transaction={transaction} key={i} />
              ))}
              <div
                className={`border-t text-sm font-bold ${
                  closeCashReceived < 0 ? "text-tertiary" : "text-secondary"
                }`}
              >{`${closeCashReceived < 0 ? "-" : "+"} $${Math.abs(
                closeCashReceived
              ).toFixed(2)}`}</div>
            </>
          )}
          {cashGiven?.length > 0 && (
            <>
              <div className="text-xl font-bold mt-4">Cash Given</div>
              {cashGiven?.map((transaction, i) => (
                <CashItem transaction={transaction} negative key={i} />
              ))}
              <div
                className={`border-t text-sm font-bold text-tertiary`}
              >{`- $${Math.abs(closeCashGiven).toFixed(2)}`}</div>
            </>
          )}
          {manualPayments?.length > 0 && (
            <>
              <div className="text-xl font-bold mt-4">Vendor Cash Payments</div>
              {manualPayments.map((transaction, i) => (
                <CashItem transaction={transaction} negative key={i} />
              ))}
              <div
                className={`border-t text-sm font-bold text-tertiary`}
              >{`- $${Math.abs(closeManualPayments).toFixed(2)}`}</div>
            </>
          )}
          {pettyCash?.length > 0 && (
            <>
              <div className="text-xl font-bold mt-4">
                Petty Cash Transactions
              </div>
              {pettyCash.map((transaction, i) => (
                <CashItem transaction={transaction} key={i} />
              ))}
              <div
                className={`border-t text-sm font-bold ${
                  closePettyBalance < 0 ? "text-tertiary" : "text-secondary"
                }`}
              >{`${closePettyBalance < 0 ? "-" : "+"} $${Math.abs(
                closePettyBalance
              ).toFixed(2)}`}</div>
            </>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
