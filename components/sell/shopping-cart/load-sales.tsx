// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSales,
  useSaleItems,
  useLogs,
  useRegisterID,
  useContacts,
  useInventory,
} from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { SaleObject, SaleItemObject, ContactObject } from "@/lib/types";

// Functions
import { fDateTime, nzDate, writeItemList } from "@/lib/data-functions";

// Components
import Modal from "@/components/container/modal";

export default function LoadSales() {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { registerID } = useRegisterID();
  const { mutateLogs } = useLogs();
  const { sales, isSalesLoading } = useSales();
  const { saleItems, isSaleItemsLoading } = useSaleItems();
  const { contacts, isContactsLoading } = useContacts();
  const { inventory, isInventoryLoading } = useInventory();

  // State
  const [submitting, setSubmitting] = useState(false);

  // Constants
  const parkedSales = sales?.filter(
    (s: SaleObject) => s?.state === "parked" || s?.state === "layby"
  );

  return (
    <Modal
      open={view?.loadSalesDialog}
      closeFunction={() => setView({ ...view, loadSalesDialog: false })}
      title={"PARKED SALES AND LAYBYS"}
      loading={isSalesLoading || isSaleItemsLoading || isContactsLoading}
    >
      {parkedSales?.length > 0 ? (
        <div>
          {parkedSales?.map((s: SaleObject, i: number) => {
            const items = saleItems?.filter(
              (i: SaleItemObject) => i?.sale_id === s?.id
            );
            return (
              <div key={i} className="flex">
                <div className="font-bold">#{s?.id}</div>
                <div>{fDateTime(nzDate(s?.date_sale_opened))}</div>
                <div>
                  {(contacts || []).filter(
                    (c: ContactObject) => c?.id === s?.contact_id
                  )[0]?.name || ""}
                </div>
                <div>{writeItemList(inventory, items)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No parked sales or laybys.</div>
      )}
    </Modal>
  );
}
