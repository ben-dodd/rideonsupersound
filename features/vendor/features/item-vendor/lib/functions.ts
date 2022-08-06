import { sumPrices } from '@/features/sale/features/item-sale/lib/functions'
import {
  SaleObject,
  StockObject,
  VendorPaymentObject,
  VendorSaleItemObject,
} from 'lib/types'
import { latestDate } from 'lib/utils'

export function getVendorDetails(
  inventory: StockObject[],
  vendorSales: VendorSaleItemObject[],
  vendorPayments: VendorPaymentObject[],
  vendor_id: number,
  cart?: SaleObject
) {
  if (vendor_id < 0) return {} // -1 is used for new vendors, i.e. no sales or payments

  // Total Items - all stock items that belong to the vendor
  let totalItems = inventory?.filter?.(
    (i: StockObject) => i?.vendor_id === vendor_id
  )

  // Total Sales - all sale items of the Vendor's stock
  let totalSales = vendorSales?.filter?.(
    (v: VendorSaleItemObject) =>
      totalItems?.filter((i: StockObject) => i?.id === v?.item_id)[0]
  )

  // Total Payments - all payments made to the Vendor
  let totalPayments = vendorPayments?.filter?.(
    (v: VendorPaymentObject) => v?.vendor_id === vendor_id
  )

  // If a cart is in progress, add these payments - possibly delete this?
  if (cart) {
    let cartPayments: VendorPaymentObject[] =
      cart?.transactions
        ?.filter?.((t: SaleTransactionObject) => t?.vendor?.id === vendor_id)
        ?.map?.((t: SaleTransactionObject) => ({ amount: t?.amount })) || []
    totalPayments = [...totalPayments, ...cartPayments]
  }

  // Total Paid = sum all payments
  const totalPaid = totalPayments?.reduce(
    (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
    0
  )

  // Total Store Cut = sum all store cut
  const totalStoreCut = sumPrices(totalSales, null, 'storePrice')
  // const totalStoreCut2 = totalSales?.reduce(
  //   (acc: number, sale: VendorSaleItemObject) =>
  //     acc +
  //     sale?.quantity *
  //       (sale?.total_sell - sale?.vendor_cut) *
  //       (1 - (sale?.store_discount || 0) / 100),
  //   0
  // );

  // Total Vendor Take = sum all vendor take
  const totalSell: number = sumPrices(totalSales, null, 'vendorPrice')
  // const totalSell2: any = totalSales?.reduce(
  //   (acc: number, sale: VendorSaleItemObject) =>
  //     acc +
  //     sale?.quantity *
  //       sale?.vendor_cut *
  //       (1 - (sale?.vendor_discount || 0) / 100),
  //   0
  // );

  // console.group(`${vendor_id}`);
  // console.log(`totalStoreCut: ${totalStoreCut}`);
  // console.log(`totalStoreCut2: ${totalStoreCut2}`);
  // console.log(`totalSell: ${totalSell}`);
  // console.log(`totalSell2: ${totalSell2}`);
  // console.groupEnd();

  // Get the date of the last payment made to vendor
  let lastPaid = latestDate(
    totalPayments?.map((p: VendorPaymentObject) => p?.date)
  )

  // Get the date of the last sale of the vendor stock
  let lastSold = latestDate(
    totalSales?.map((s: VendorSaleItemObject) => s?.date_sale_closed)
  )

  // Total vendor take minus total paid to vendor
  let totalOwing = totalSell - totalPaid

  return {
    totalItems,
    totalSales,
    totalSell,
    totalPayments,
    totalPaid,
    lastPaid,
    totalOwing,
    lastSold,
    totalStoreCut,
  }
}

export function getVendorQuantityInStock(
  inventory: StockObject[],
  vendor_id: number
) {
  return getVendorItemsInStock(inventory, vendor_id)?.reduce(
    (sum, item) => (item?.quantity || 0) + sum,
    0
  )
}

export function getVendorItemsInStock(
  inventory: StockObject[],
  vendor_id: number
) {
  return inventory?.filter((i: StockObject) => i?.vendor_id === vendor_id)
}
