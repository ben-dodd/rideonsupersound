import {
  SaleObject,
  SaleItemObject,
  SaleTransactionObject,
  ClerkObject,
  VendorObject,
  InventoryObject,
} from "@/lib/types";

export async function saveSaleAndItemsToDatabase(
  sale: SaleObject,
  clerk: ClerkObject,
  setCart?: Function
) {
  let newSale = { ...sale };
  if (!newSale?.id) {
    const newSaleId = await saveSaleToDatabase(
      { ...sale, state: "in_progress" },
      clerk
    );
    newSale = { ...newSale, id: newSaleId };
  } else {
    await updateSaleInDatabase(sale);
  }
  let newItems = [];
  sale?.items.forEach(async (item) => {
    if (!item?.id) {
      let newItem = { ...item };
      const newSaleItemId = await saveSaleItemToDatabase(item, newSale?.id);
      newItem = { ...newItem, id: newSaleItemId };
      newItems.push(newItem);
    } else {
      await updateSaleItemInDatabase(item, sale);
      newItems.push(item);
    }
  });
  setCart && setCart({ ...newSale, items: newItems });
}

export async function saveSaleToDatabase(sale: SaleObject, clerk: ClerkObject) {
  try {
    const res = await fetch("/api/create-sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact_id: sale?.contact_id || null,
        state: status || null,
        sale_opened_by: clerk?.id,
        weather: JSON.stringify(sale?.weather) || "",
        geo_latitude: sale?.geo_latitude || null,
        geo_longitude: sale?.geo_longitude || null,
        note: sale?.note || null,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json?.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveSaleItemToDatabase(
  item: SaleItemObject,
  sale_id: number
) {
  try {
    const res = await fetch("/api/create-sale-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sale_id: sale_id,
        item_id: item?.item_id,
        quantity: item?.quantity,
        vendor_discount: item?.vendor_discount || null,
        store_discount: item?.store_discount || null,
        note: item?.note || null,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json?.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveSaleTransaction(
  sale: SaleObject,
  clerk: ClerkObject,
  amount: string,
  remainingBalance: number,
  paymentMethod: string,
  mutate?: Function,
  setCart?: Function,
  vendor?: VendorObject
) {
  let newSale = { ...sale };
  let transaction: SaleTransactionObject = {
    sale_id: sale?.id,
    clerk_id: clerk?.id,
    payment_method: paymentMethod,
    total_amount:
      parseFloat(amount) >= remainingBalance
        ? remainingBalance * 100
        : parseFloat(amount) * 100,
  };
  if (paymentMethod === "cash") {
    transaction = {
      ...transaction,
      cash_received: parseFloat(amount) * 100,
      change_given:
        parseFloat(amount) > remainingBalance
          ? (parseFloat(amount) - remainingBalance) * 100
          : null,
    };
  }
  if (paymentMethod === "acct") {
    let vendorPaymentId = null;
    const vendorPayment = {
      amount: parseFloat(amount) * 100,
      clerk_id: clerk?.id,
      vendor_id: vendor?.id,
      type: "sale",
    };
    vendorPaymentId = await saveVendorPaymentToDatabase(vendorPayment);
    transaction = { ...transaction, vendor_payment_id: vendorPaymentId };
  }
  // newSale?.transactions.forEach(async (transaction) => {
  // if (!transaction?.id) {
  // const newTransactionId = await saveSaleTransactionToDatabase(transaction);
  let date = new Date();
  transaction = {
    ...transaction,
    // id: newTransactionId,
    date: date.toISOString(),
  };
  // } else {
  //   await updateSaleTransactionInDatabase(transaction);
  //   newTransactions.push(transaction);
  // }
  // });
  let newTransactions = newSale?.transactions
    ? [...newSale?.transactions, transaction]
    : [transaction];
  setCart && setCart({ ...newSale, transactions: newTransactions });
  mutate();
  if (paymentMethod === "gift") {
  }
}

export async function saveSaleTransactionToDatabase(
  transaction: SaleTransactionObject
) {
  try {
    const res = await fetch("/api/create-sale-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json?.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveVendorPaymentToDatabase(vendorPayment) {
  try {
    const res = await fetch("/api/create-vendor-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendorPayment),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveSelectToDatabase(
  label: string,
  setting_select: string,
  mutate: Function
) {
  try {
    const res = await fetch("/api/create-setting-select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label, setting_select }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    mutate();
    return json.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveHoldToDatabase(
  sale: SaleObject,
  item: SaleItemObject,
  holdPeriod: number,
  note: string,
  clerk: ClerkObject
) {
  try {
    const res = await fetch("/api/create-hold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact_id: sale?.contact_id,
        item_id: item?.item_id,
        quantity: item?.quantity,
        vendor_discount: item?.vendor_discount,
        store_discount: item?.store_discount,
        hold_period: holdPeriod,
        started_by: clerk?.id,
        note: note,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
  saveStockMovementToDatabase(item, clerk, "hold", null);
}

export async function saveGiftCardToDatabase() {
  try {
    const res = await fetch("/api/create-hold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveStockMovementToDatabase(
  item: SaleItemObject,
  clerk: ClerkObject,
  act: string,
  note: string
) {
  try {
    const res = await fetch("/api/create-stock-movement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock_id: item?.item_id,
        clerk_id: clerk?.id,
        quantity: item?.quantity,
        act,
        note,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function updateStockItemInDatabase(item: InventoryObject) {
  try {
    const res = await fetch("/api/update-stock-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function updateSaleInDatabase(sale: SaleObject) {
  try {
    const res = await fetch("/api/update-sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sale_id: sale?.id,
        contact_id: sale?.contact_id,
        state: sale?.state,
        note: sale?.note,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function updateSaleItemInDatabase(
  cartItem: SaleItemObject,
  cart: SaleObject
) {
  try {
    const res = await fetch("/api/update-sale-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sale_item_id: cartItem?.id,
        sale_id: cart?.id,
        item_id: cartItem?.item_id,
        quantity: parseInt(cartItem?.quantity),
        vendor_discount: parseInt(cartItem?.vendor_discount),
        store_discount: parseInt(cartItem?.store_discount),
        note: cartItem?.note,
        is_deleted: cartItem?.is_deleted,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function updateSaleTransactionInDatabase(
  transaction: SaleTransactionObject
) {
  try {
    const res = await fetch("/api/update-sale-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // sale_item_id: cartItem?.id,
        // sale_id: cart?.id,
        // item_id: cartItem?.item_id,
        // quantity: parseInt(cartItem?.quantity),
        // vendor_discount: parseInt(cartItem?.vendor_discount),
        // store_discount: parseInt(cartItem?.store_discount),
        // note: cartItem?.note,
        // is_deleted: cartItem?.is_deleted,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function deleteSaleItemFromDatabase(sale_item_id: number) {
  try {
    const res = await fetch("/api/delete-sale-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sale_item_id,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function deleteSaleTransactionFromDatabase(
  transaction_id: number,
  mutate: Function
) {
  try {
    const res = await fetch("/api/delete-sale-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_id,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    mutate();
  } catch (e) {
    throw Error(e.message);
  }
}

export async function deleteSaleFromDatabase(sale_id: number) {
  try {
    const res = await fetch("/api/delete-sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sale_id,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}
