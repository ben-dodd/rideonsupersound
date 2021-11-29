// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useCustomers } from "@/lib/swr-hooks";
import {
  viewAtom,
  clerkAtom,
  newSaleObjectAtom,
  loadedCustomerObjectAtom,
} from "@/lib/atoms";
import { CustomerObject, ModalButton } from "@/lib/types";

// Functions
import {
  saveCustomerToDatabase,
  updateCustomerInDatabase,
} from "@/lib/db-functions";

// Components
import TextField from "@/components/_components/inputs/text-field";
import SidebarContainer from "@/components/_components/container/side-bar";

export default function CreateCustomerSidebar() {
  // SWR
  const { customers, mutateCustomers } = useCustomers();

  // Atoms
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);
  const [customer, setCustomer] = useAtom(loadedCustomerObjectAtom);

  // State
  const [nameConflict, setNameConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load
  useEffect(() => {
    customers &&
      !customer?.id &&
      setNameConflict(
        customers?.map((c: CustomerObject) => c?.name).includes(customer?.name)
      );
  }, [customers, customer?.name]);

  // Functions
  function closeSidebar() {
    setCustomer(null);
    setView({ ...view, createCustomer: false });
  }

  async function onClickCreateCustomer() {
    setSubmitting(true);
    const id = await saveCustomerToDatabase(
      customer,
      clerk,
      customers,
      mutateCustomers
    );
    setCart({ ...cart, customer_id: id });
    closeSidebar();
    setSubmitting(false);
  }

  async function onClickUpdateCustomer() {
    setSubmitting(true);
    updateCustomerInDatabase(customer, customers, mutateCustomers);
    closeSidebar();
  }

  // Constants
  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: closeSidebar,
      text: "CANCEL",
    },
    {
      type: "ok",
      onClick: customer?.id ? onClickUpdateCustomer : onClickCreateCustomer,
      disabled: !customer?.name || nameConflict,
      text: customer?.id ? "UPDATE" : submitting ? "CREATING..." : "CREATE",
    },
  ];

  return (
    <SidebarContainer
      show={view?.createCustomer}
      title={customer?.id ? "Edit Customer" : "Create New Customer"}
      buttons={buttons}
    >
      <TextField
        inputLabel="Name"
        fieldRequired
        error={nameConflict}
        errorText="Name already exists."
        displayOnly={Boolean(customer?.id)}
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
