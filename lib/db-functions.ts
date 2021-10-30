import {
  SaleObject,
  SaleItemObject,
  SaleTransactionObject,
  ClerkObject,
  VendorObject,
  VendorPaymentObject,
  InventoryObject,
  RegisterObject,
  LogObject,
  TillObject,
  HoldObject,
} from "@/lib/types";

export async function saveSaleAndItemsToDatabase(
  sale: SaleObject,
  clerk: ClerkObject,
  setCart?: Function
) {
  let newSale = { ...sale };
  console.log(newSale);
  let newSaleId = newSale?.id;
  console.log(newSaleId);
  if (!newSaleId) {
    newSale.state = "in progress";
    newSaleId = await saveSaleToDatabase(newSale, clerk);
    newSale = { ...newSale, id: newSaleId };
    console.log(newSaleId);
  } else {
    updateSaleInDatabase(sale);
  }
  let newItems = [];
  for await (const item of sale?.items) {
    if (!item?.id) {
      let newItem = { ...item };
      const newSaleItemId = await saveSaleItemToDatabase(item, newSale?.id);
      newItem = { ...newItem, id: newSaleItemId };
      newItems.push(newItem);
    } else {
      await updateSaleItemInDatabase(item, sale);
      newItems.push(item);
    }
  }
  setCart && setCart({ ...newSale, items: newItems });
  return newSaleId;
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
    amount:
      parseFloat(amount) >= sale?.totalRemaining
        ? sale?.totalRemaining * 100
        : parseFloat(amount) * 100,
  };
  if (paymentMethod === "cash") {
    // Add cash variables
    transaction = {
      ...transaction,
      cash_received: parseFloat(amount) * 100,
      change_given:
        parseFloat(amount) > sale?.totalRemaining
          ? (parseFloat(amount) - sale?.totalRemaining) * 100
          : null,
    };
  }
  if (paymentMethod === "acct") {
    // Add account payment as a store payment to the vendor
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
  if (paymentMethod === "gift") {
    // Update remaining balance etc. on gift card
  }
  const transactionId = await saveSaleTransactionToDatabase(transaction);
  let date = new Date();
  transaction = {
    ...transaction,
    id: transactionId,
    date: date.toISOString(),
  };
  const newTransactions = newSale?.transactions
    ? [...newSale?.transactions, transaction]
    : [transaction];
  newSale.transactions = newTransactions;
  setCart && setCart(newSale);
  mutate();
  return transactionId;
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

export async function saveClosedRegisterToDatabase(
  register_id: number,
  register: RegisterObject,
  till: TillObject
) {
  try {
    const tillID = await saveTillToDatabase(till);
    const res = await fetch(`/api/update-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...register,
        id: register_id,
        close_till_id: tillID,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    saveLog({
      log: `Register closed.`,
      table_id: "register",
      row_id: json?.insertId,
      clerk_id: register?.closed_by_id,
    });
    setRegister(json?.insertId);
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveAndOpenRegister(
  register: RegisterObject,
  till: TillObject,
  clerk: ClerkObject
) {
  try {
    const tillID = await saveTillToDatabase(till);
    const res = await fetch("/api/create-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...register, open_till_id: tillID }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    saveLog({
      log: `Register opened.`,
      table_id: "register",
      row_id: json?.insertId,
      clerk_id: clerk?.id,
    });
    setRegister(json?.insertId);
    return [{ num: json?.insertId }];
  } catch (e) {
    throw Error(e.message);
  }
}

export async function savePettyCashToRegister(
  registerID: number,
  clerkID: number,
  isTake: boolean,
  amount: string,
  note: string
) {
  try {
    let numberAmount = parseFloat(amount) * 100;
    if (isTake) numberAmount = numberAmount * -1;
    const res = await fetch("/api/create-petty-cash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        register_id: registerID,
        clerk_id: clerkID,
        amount: numberAmount,
        is_take: isTake,
        note,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    saveLog({
      log: `$${parseFloat(amount)?.toFixed(2)} ${
        isTake ? "taken from till." : "put in till."
      }`,
      table_id: "register_petty_cash",
      row_id: json?.insertId,
      clerk_id: clerkID,
    });
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveTillToDatabase(till: TillObject) {
  try {
    const res = await fetch("/api/create-till", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(till),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json?.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function saveVendorPaymentToDatabase(
  vendorPayment: VendorPaymentObject
) {
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
    saveStockMovementToDatabase(item, clerk, "hold", null);
    return json?.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function returnHoldToStock(hold: HoldObject, clerk: ClerkObject) {
  // setLog(
  //   `Hold returned to stock.`,
  //   "holds",
  //   get(hold, "id", ""),
  //   currentStaff
  // );
  // updateData({
  //   dispatch,
  //   collection: "holds",
  //   doc: get(hold, "id", null),
  //   update: {
  //     deleted: true,
  //     dateRemovedFromHold: new Date(),
  //     removedFromHoldBy: get(currentStaff, "id", null),
  //     sold: false,
  //   },
  // });
  // setHold(null);
  // dispatch(closeDialog("holdItem"));
  // updateData({
  //   dispatch,
  //   collection: "inventory",
  //   doc: get(hold, "item.id", null),
  //   update: {
  //     quantity: get(stockItem, "quantity", 0) + holdItemQty,
  //     quantityOnHold:
  //       get(stockItem, "quantityOnHold", 0) - holdItemQty,
  //   },
  // });
}

export async function updateHoldInDatabase(item) {
  try {
    const res = await fetch("/api/update-hold", {
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

export async function saveLog(log: LogObject, mutate?: Function) {
  try {
    const res = await fetch("/api/create-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        log: log?.log,
        table_id: log?.table_id || null,
        row_id: log?.row_id || null,
        clerk_id: log?.clerk_id || null,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    mutate && mutate();
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
        quantity:
          act === "receive" ||
          act === "unhold" ||
          act === "unlayby" ||
          act === "found" ||
          act === "unsold"
            ? parseInt(item?.quantity)
            : -parseInt(item?.quantity),
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
        contact_id: sale?.contact_id || null,
        state: sale?.state || null,
        note: sale?.note ? sale?.note : null,
        date_layby_started: sale?.date_layby_started || null,
        layby_started_by: sale?.layby_started_by || null,
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

export async function setRegister(register_id: number) {
  console.log("Set Register");
  try {
    const res = await fetch("/api/set-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        register_id: register_id,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
  } catch (e) {
    throw Error(e.message);
  }
}

// export async function updateSaleTransactionInDatabase(
//   transaction: SaleTransactionObject
// ) {
//   try {
//     const res = await fetch("/api/update-sale-transaction", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         // sale_item_id: cartItem?.id,
//         // sale_id: cart?.id,
//         // item_id: cartItem?.item_id,
//         // quantity: parseInt(cartItem?.quantity),
//         // vendor_discount: parseInt(cartItem?.vendor_discount),
//         // store_discount: parseInt(cartItem?.store_discount),
//         // note: cartItem?.note,
//         // is_deleted: cartItem?.is_deleted,
//       }),
//     });
//     const json = await res.json();
//     if (!res.ok) throw Error(json.message);
//   } catch (e) {
//     throw Error(e.message);
//   }
// }

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

export async function saveStockToDatabase(item: any, clerk: ClerkObject) {
  try {
    const res = await fetch("/api/create-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor_id: item?.vendor_id || null,
        created_by_id: clerk?.id || null,
        artist: item?.artist || null,
        title: item?.title || null,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
    return json?.insertId;
  } catch (e) {
    throw Error(e.message);
  }
}

export async function receiveStock(
  newStockData: any,
  obj: any,
  clerk: ClerkObject
) {
  let items = obj?.items || {};
  let vendorId = obj?.vendor_id;
  // Save new stock items
  newStockData.forEach(async (row: any) => {
    const newStockID = await saveStockToDatabase(row, clerk);
    saveStockMovementToDatabase(
      {
        item_id: newStockID,
        quantity: row?.quantityReceived,
      },
      clerk,
      "receive",
      "New stock received."
    );
  });
  // Save added items
  if (vendorId && Object.keys(items).length > 0) {
    Object.entries(items)
      .filter(([id, receiveQuantity]) => parseInt(`${receiveQuantity}`) > 0)
      .forEach(([id, receiveQuantity]) => {
        saveStockMovementToDatabase(
          {
            item_id: parseInt(id),
            quantity: `${receiveQuantity}`,
          },
          clerk,
          "receive",
          "Existing stock received."
        );
      });
  }
}

export function returnStock(obj: any, clerk: ClerkObject) {
  let items = obj?.items || {};
  let vendorId = obj?.vendor_id;
  if (vendorId && Object.keys(items).length > 0) {
    Object.entries(items)
      .filter(([id, returnQuantity]) => parseInt(`${returnQuantity}`) > 0)
      .forEach(([id, returnQuantity]) => {
        saveStockMovementToDatabase(
          {
            item_id: parseInt(id),
            quantity: `${returnQuantity}`,
          },
          clerk,
          "return",
          "Stock returned."
        );
      });
  }
}
