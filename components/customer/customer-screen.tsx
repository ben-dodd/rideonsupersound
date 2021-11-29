// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useCustomers } from "@/lib/swr-hooks";
import {
  viewAtom,
  saleObjectAtom,
  loadedCustomerObjectAtom,
} from "@/lib/atoms";
import { CustomerObject, ModalButton } from "@/lib/types";

// Components
import TextField from "@/components/_components/inputs/text-field";
import SidebarContainer from "@/components/_components/container/side-bar";

export default function CustomerScreen() {
  // SWR
  const { customers } = useCustomers();

  // Atoms
  const [cart, setCart] = useAtom(saleObjectAtom);
  const [view, setView] = useAtom(viewAtom);
  const [customer, setCustomer] = useAtom(loadedCustomerObjectAtom);

  // State
  const [nameConflict, setNameConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load
  useEffect(() => {
    customers &&
      setNameConflict(
        customers?.map((c: CustomerObject) => c?.name).includes(customer?.name)
      );
  }, [customers, customer?.name]);

  // Functions
  async function onClickCreateCustomer() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customer?.name || null,
          email: customer?.email || null,
          phone: customer?.phone || null,
          postal_address: customer?.postal_address || null,
          note: customer?.note || null,
        }),
      });
      setSubmitting(false);
      const json = await res.json();
      if (!res.ok) throw Error(json.message);
      setCustomer(null);
      setView({ ...view, createCustomer: false });
      setCart({ ...cart, customer_id: json?.insertId });
    } catch (e) {
      throw Error(e.message);
    }
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => {
        setCustomer(null);
        setView({ ...view, createCustomer: false });
      },
      text: "CANCEL",
    },
    {
      type: "ok",
      onClick: onClickCreateCustomer,
      disabled: !customer?.name || nameConflict,
      text: submitting ? "CREATING..." : "CREATE",
    },
  ];

  return (
    <SidebarContainer
      show={view?.createCustomer}
      title={"Create New Customer"}
      buttons={buttons}
    >
      <TextField
        inputLabel="Name"
        fieldRequired
        error={nameConflict}
        errorText="Name already exists."
        value={customer?.name || ""}
        onChange={(e: any) =>
          setCustomer({ ...customer, name: e.target.value })
        }
      />
      <TextField
        inputLabel="Email"
        value={customer?.email || ""}
        onChange={(e: any) =>
          setCustomer({ ...customer, email: e.target.value })
        }
      />
      <TextField
        inputLabel="Phone"
        value={customer?.phone || ""}
        onChange={(e: any) =>
          setCustomer({ ...customer, phone: e.target.value })
        }
      />
      <TextField
        inputLabel="Postal Address"
        multiline
        rows={4}
        value={customer?.postal_address || ""}
        onChange={(e: any) =>
          setCustomer({ ...customer, postal_address: e.target.value })
        }
      />
      <TextField
        inputLabel="Notes"
        multiline
        rows={4}
        value={customer?.note || ""}
        onChange={(e: any) =>
          setCustomer({ ...customer, note: e.target.value })
        }
      />
    </SidebarContainer>
  );
}
