import {
  SaleObject,
  SaleItemObject,
  ClerkObject,
  TransactionObject,
  VendorObject,
} from "@/lib/types";

export async function saveSaleToDatabase(
  sale: SaleObject,
  clerk: ClerkObject,
  status: string,
  setCart?: Function
) {
  let newSale = sale;
  if (!sale?.id) {
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
    newSale = { ...newSale, id: json?.insertId };

    let newItems = [];
    sale?.items.forEach(async (item) => {
      let newItem = item;
      try {
        const res2 = await fetch("/api/create-sale-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sale_id: json?.insertId,
            item_id: item?.item_id,
            quantity: item?.quantity,
            vendor_discount: item?.vendor_discount || null,
            store_discount: item?.store_discount || null,
            note: item?.note || null,
          }),
        });
        const json2 = await res2.json();
        if (!res2.ok) throw Error(json2.message);
        newItem = { ...newItem, id: json2?.insertId };
        newItems.push(newItem);
        setCart && setCart({ ...newSale, items: newItems });
      } catch (e) {
        throw Error(e.message);
      }
    });
  } else {
  }
}

export async function saveTransactionToDatabase(
  cart: SaleObject,
  clerk: ClerkObject,
  amount: string,
  remainingBalance: number,
  paymentMethod: string,
  vendor?: VendorObject
) {
  let transaction: TransactionObject = {
    sale_id: cart?.id,
    clerk_id: clerk?.id,
    payment_method: paymentMethod,
    total_amount:
      parseFloat(amount) >= remainingBalance
        ? remainingBalance * 100
        : parseFloat(amount) * 100,
  };
  if (paymentMethod === "cash")
    transaction = {
      ...transaction,
      cash_received: parseFloat(amount) * 100,
      change_given:
        parseFloat(amount) > remainingBalance
          ? (parseFloat(amount) - remainingBalance) * 100
          : null,
    };
  if (paymentMethod === "acct") {
    let vendorPaymentId = null;
    const vendorPayment = {
      amount: parseFloat(amount) * 100,
      clerk_id: clerk?.id,
      vendor_id: vendor?.id,
      type: "sale",
    };
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
      vendorPaymentId = json.insertId;
    } catch (e) {
      throw Error(e.message);
    }
    transaction = { ...transaction, vendor_payment_id: vendorPaymentId };
  }
  if (paymentMethod === "gift") {
  }
  try {
    const res = await fetch("/api/create-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
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

export async function deleteSaleItemFromDatabase(
  sale_id: number,
  item_id: number
) {
  try {
    const res = await fetch("/api/delete-sale-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sale_id,
        item_id,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw Error(json.message);
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
