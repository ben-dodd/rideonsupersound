import { clerkAtom, receiveStockAtom } from "@/lib/atoms";
import { getCSVData } from "@/lib/data-functions";
import { saveLog } from "@/lib/db-functions";
import { useInventory, useLogs } from "@/lib/swr-hooks";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { CSVLink } from "react-csv";

export default function PrintLabel() {
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const { logs, mutateLogs } = useLogs();
  const [clerk] = useAtom(clerkAtom);
  const { inventory } = useInventory();
  const csvData = useMemo(
    () =>
      getCSVData(
        Object.entries(basket?.items || {}).map(([id, quantity]) => ({
          printQuantity: parseFloat(`${quantity}`),
          item: { value: id },
        })),
        inventory
      ),
    [inventory, basket?.items]
  );
  return (
    <div>
      <CSVLink
        className={`modal__button--alt`}
        data={csvData}
        headers={["SKU", "ARTIST", "TITLE", "NEW/USED", "SELL PRICE", "GENRE"]}
        filename={`label-print-${dayjs().format("YYYY-MM-DD")}.csv`}
        onClick={() =>
          saveLog(
            {
              log: "Labels printed from receive stock dialog.",
              clerk_id: clerk?.id,
            },
            logs,
            mutateLogs
          )
        }
      >
        PRINT LABELS
      </CSVLink>
    </div>
  );
}
