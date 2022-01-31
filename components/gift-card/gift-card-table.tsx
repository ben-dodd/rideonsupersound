// Packages
import { useMemo } from "react";

// DB
import { useGiftCards } from "@/lib/swr-hooks";
import { StockObject } from "@/lib/types";

// Components
import Table from "@/components/_components/table";
import TableContainer from "@/components/_components/container/table";
import dayjs from "dayjs";

export default function GiftCardTable() {
  // SWR
  const { giftCards, isGiftCardsLoading } = useGiftCards();
  console.log(giftCards);

  // Constants
  const data = useMemo(
    () =>
      giftCards?.map((g: StockObject) => ({
        id: g?.id,
        code: g?.gift_card_code,
        date: g?.date_created,
        initial: g?.gift_card_amount,
        remaining: g?.gift_card_remaining,
        valid: g?.gift_card_is_valid,
        notes: g?.note,
      })),
    [giftCards]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Date Purchased",
        accessor: "date",
        width: 280,
        Cell: (item: any) =>
          item ? <div>{dayjs(item?.value).format("D MMMM YYYY")}</div> : "",
        sortType: (rowA: any, rowB: any, columnId: any) => {
          const a = rowA?.original[columnId];
          const b = rowB?.original[columnId];
          return a > b ? 1 : b > a ? -1 : 0;
        },
      },
      { Header: "Gift Card Code", accessor: "code" },
      {
        Header: "Initial Value",
        accessor: "initial",
        Cell: ({ value }) => (
          <span>${(value ? value / 100 : 0)?.toFixed(2)}</span>
        ),
      },
      {
        Header: "Remaining Value",
        accessor: "remaining",
        Cell: ({ value }) => (
          <span>${(value ? value / 100 : 0)?.toFixed(2)}</span>
        ),
      },
      {
        Header: "Valid",
        accessor: "valid",
        Cell: ({ value }) => (value ? "YES" : "NO"),
      },
      { Header: "Notes", accessor: "notes", width: 350 },
    ],
    []
  );

  return (
    <TableContainer loading={isGiftCardsLoading}>
      <Table
        color="bg-col8"
        colorLight="bg-col8-light"
        colorDark="bg-col8-dark"
        data={data}
        columns={columns}
        heading={"Gift Cards"}
        sortOptions={[{ id: "date", desc: true }]}
      />
    </TableContainer>
  );
}
