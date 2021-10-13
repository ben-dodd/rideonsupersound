import { useMemo } from "react";
import { useGiftCards } from "@/lib/swr-hooks";
import { InventoryObject } from "@/lib/types";
import { format, parseISO } from "date-fns";

// Material UI Components
import Table from "@/components/table";
import TableContainer from "@/components/container/table";

export default function GiftCardTable() {
  const { giftCards } = useGiftCards();
  console.log(giftCards);
  const data = useMemo(
    () =>
      (giftCards || []).map((g: InventoryObject) => ({
        id: g?.id,
        code: g?.gift_card_code,
        date: parseISO(g?.date_created),
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
          item ? <div>{format(item?.value, "d MMMM yyyy")}</div> : "",
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
          <span>${(value ? value / 100 : 0).toFixed(2)}</span>
        ),
      },
      {
        Header: "Remaining Value",
        accessor: "remaining",
        Cell: ({ value }) => <span>${value}</span>,
      },
      { Header: "Valid", accessor: "valid" },
      { Header: "Notes", accessor: "notes", width: 350 },
    ],
    []
  );

  return (
    <TableContainer>
      <Table
        color="bg-col5"
        colorLight="bg-col5-light"
        colorDark="bg-col5-dark"
        data={data}
        columns={columns}
        heading={"Gift Cards"}
        sortOptions={[{ id: "date", desc: true }]}
      />
    </TableContainer>
  );
}
