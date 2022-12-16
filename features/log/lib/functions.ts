import {
  getItemById,
  getItemDisplayName,
  getItemSkuDisplayName,
} from 'features/inventory/features/display-inventory/lib/functions'
import {
  CustomerObject,
  SaleItemObject,
  StockMovementTypes,
  VendorPaymentTypes,
} from 'lib/types'
import { priceCentsString, priceDollarsString } from 'lib/utils'
import dayjs from 'dayjs'
import { writeItemList } from 'features/pay/lib/functions'

export async function saveSystemLog(log: string, clerk_id: number) {
  saveLog(log, clerk_id, 'system')
}

export function saveLog(
  log: string,
  clerkId: number,
  tableId?: string,
  rowId?: number
) {
  let logObj = {
    log,
    clerkId,
    tableId,
    rowId,
    date_created: dayjs.utc().format(),
  }
  createLog(logObj)
}

export function logOpenRegister(clerk, openAmount, registerID) {
  const log = `Register opened with $${
    openAmount ? parseFloat(openAmount) : 0
  } in the till.`
  saveLog(log, clerk?.id, 'register', registerID)
  return log
}

export function logCloseRegister(register) {
  saveLog(
    `Register #${register?.id} closed.`,
    register?.closed_by_id,
    'register',
    register?.id
  )
}

export function logCloseRegisterWithAmount(closeAmount, clerk, registerId) {
  saveLog(
    `Register closed with ${priceDollarsString(closeAmount)} in the till.`,
    clerk?.id,
    'register',
    registerId
  )
}

export function logPettyCash(clerk, amount, isTake, pettyCashId) {
  saveLog(
    `$${parseFloat(amount)?.toFixed(2)} ${
      isTake ? 'taken from till.' : 'put in till.'
    }`,
    clerk?.id,
    'register_petty_cash',
    pettyCashId
  )
}

export function logChangePrice(
  stockItem,
  totalSell,
  vendorCut,
  clerk,
  stockPriceId
) {
  saveLog(
    `Price for ${getItemDisplayName(stockItem)} changed from $${(
      stockItem?.total_sell / 100
    )?.toFixed(2)} [${priceCentsString(
      stockItem?.vendor_cut
    )}] to ${priceDollarsString(totalSell)}} [${priceDollarsString(
      vendorCut
    )}].`,
    clerk?.id,
    'stock_price',
    stockPriceId
  )
}

export function logChangeQuantity(
  movement,
  stockItem,
  quantity,
  originalQuantity,
  newQuantity,
  clerk,
  stockMovementId
) {
  saveLog(
    movement === StockMovementTypes?.Adjustment
      ? `Quantity adjusted for ${getItemDisplayName(
          stockItem
        )} (${originalQuantity} => ${newQuantity})`
      : `${
          parseInt(quantity) *
          (movement === StockMovementTypes?.Discarded ||
          movement === StockMovementTypes?.Lost ||
          movement === StockMovementTypes?.Returned
            ? -1
            : 1)
        } copies of ${getItemDisplayName(stockItem)} marked as ${movement}.`,
    clerk?.id,
    'stock_movement',
    stockMovementId
  )
}

export function logReturnStock(stockItem, returnItem, clerk) {
  saveLog(
    `${getItemDisplayName(stockItem)} (x${
      returnItem?.quantity
    }) returned to vendor.`,
    clerk?.id,
    'stock_movement'
  )
}

export function logCreateVendor(clerk, vendorName, vendorId) {
  saveLog(`Vendor ${vendorName} (${vendorId}) created.`, clerk?.id)
}

export function logDeleteVendor(clerk, item) {
  saveLog(
    `${getItemSkuDisplayName(item)} deleted.`,
    clerk?.id,
    'stock',
    item?.id
  )
}

export function logPrintLabels(clerk, where) {
  saveLog(`Labels printed from ${where}.`, clerk?.id)
}

export function logStocktakeKeep(item, inventory, clerk) {
  saveLog(
    `Stock take: ${getItemSkuDisplayName(
      getItemById(item?.stock_id, inventory)
    )}. ${item?.quantity_counted} counted, ${
      item?.quantity_recorded
    } in the system. System quantity kept.`,
    clerk?.id
  )
}

export function logStocktakeAdjustment(item, inventory, act, clerk) {
  saveLog(
    `Stock take: ${getItemSkuDisplayName(
      getItemById(item?.stock_id, inventory)
    )}. ${item?.quantity_counted} counted, ${
      item?.quantity_recorded
    } in the system. Difference marked as ${act}.`,
    clerk?.id
  )
}

export function logCreateJob(description, clerk, jobId) {
  saveLog(`New job (${description}) created.`, clerk?.id, 'stock', jobId)
}

export function logRestockItem(item, clerk) {
  saveLog(`${getItemDisplayName(item)} restocked.`, clerk?.id)
}

export function logCreateVendorPayment(
  paymentType,
  vendor,
  clerk,
  vendorPaymentId
) {
  saveLog(
    `${
      paymentType === VendorPaymentTypes.Cash ? 'Cash' : 'Direct deposit'
    } payment made to Vendor (${vendor?.id || ''}).`,
    clerk?.id,
    'vendor_payment',
    vendorPaymentId
  )
}

export function logTransferVendorPayment(
  payment,
  vendor_pay_id,
  vendorPay,
  vendor_receive_id,
  vendorReceive,
  clerk,
  vendorPaymentId
) {
  saveLog(
    `${priceDollarsString(payment)} store credit transferred from ${
      vendor_pay_id === 'store'
        ? 'R.O.S.S.'
        : `${vendorPay?.name} (${vendor_pay_id})`
    } to ${vendorReceive?.name} (${vendor_receive_id || ''}).`,
    clerk?.id,
    'vendor_payment',
    vendorPaymentId
  )
}

export function logBatchPayment(vendor, clerk, vendorPaymentId) {
  saveLog(
    `Batch payment made to Vendor ${vendor?.name} (${vendor?.id || ''}).`,
    clerk?.id,
    'vendor_payment',
    vendorPaymentId
  )
}

export function logCreateHold(
  cart,
  cartItem,
  inventory,
  customers,
  holdPeriod,
  clerk,
  holdId
) {
  saveLog(
    `${getItemSkuDisplayName(
      getItemById(cartItem?.item_id, inventory)
    )} put on hold for ${
      customers?.filter((c: CustomerObject) => c?.id === cart?.customer_id)[0]
        ?.name
    } for ${holdPeriod} day${holdPeriod === 1 ? '' : 's'}.`,
    clerk?.id,
    'hold',
    holdId
  )
}

export function logRemoveFromHold(hold, inventory, clerk) {
  saveLog(
    `${getItemDisplayName(
      getItemById(hold?.item_id, inventory)
    )} removed from hold and added back to stock.`,
    clerk?.id
  )
}

export function logHoldAddedToSale(hold, inventory, cart, clerk) {
  saveLog(
    `${getItemDisplayName(
      getItemById(hold?.item_id, inventory)
    )} added to cart${cart?.id ? ` (sale #${cart?.id}) from hold` : ''}.`,
    clerk?.id
  )
}

export function logLaybyStarted(
  cart,
  customers,
  numberOfItems,
  totalPrice,
  totalRemaining,
  clerk
) {
  saveLog(
    `Layby started${
      cart?.customer_id
        ? ` for ${
            customers?.filter(
              (c: CustomerObject) => c?.id === cart?.customer_id
            )[0]?.name
          }`
        : ''
    } (${numberOfItems} item${
      numberOfItems === 1 ? '' : 's'
    } / ${priceDollarsString(totalPrice)} with ${priceDollarsString(
      totalRemaining
    )} left to pay).`,
    clerk?.id
  )
}

export function logSaleCompleted(cart, saleId, clerk) {
  saveLog(
    `Sale #${cart?.id || saleId} completed.`,
    clerk?.id,
    'sale',
    cart?.id || saleId
  )
}

export function logSaleRefunded(inventory, items, refundItems, sale, clerk) {
  saveLog(
    `${writeItemList(
      inventory,
      items?.filter((i: SaleItemObject) => refundItems?.includes(i?.id))
    )} refunded (sale #${sale?.id}).`,
    clerk?.id
  )
}

export function logSalePaymentAcct(
  payment,
  vendorWrapper,
  isRefund,
  cart,
  clerk
) {
  saveLog(
    `${priceDollarsString(payment)} ${
      isRefund
        ? `refunded on ${vendorWrapper?.value?.name} account`
        : `account payment from vendor ${vendorWrapper?.value?.name}${
            cart?.id ? ` (sale #${cart?.id}).` : ''
          }`
    }.`,
    clerk?.id
  )
}

export function logSalePaymentCard(payment, isRefund, cart, customers, clerk) {
  saveLog(
    `${priceDollarsString(payment)} ${
      isRefund ? 'refunded on card to' : 'card payment from'
    } ${
      cart?.customer_id
        ? customers?.find((c: CustomerObject) => c?.id === cart?.customer_id)
            ?.name
        : 'customer'
    }${cart?.id ? ` (sale #${cart?.id}).` : ''}.`,
    clerk?.id
  )
}

export function logSalePaymentCash(
  payment,
  isRefund,
  cart,
  customers,
  changeToGive,
  clerk
) {
  saveLog(
    `${priceDollarsString(payment)} ${
      isRefund ? `cash refunded to` : `cash taken from`
    } ${
      cart?.customer_id
        ? customers?.find((c: CustomerObject) => c?.id === cart?.customer_id)
            ?.name
        : 'customer'
    }${cart?.id ? ` (sale #${cart?.id}).` : ''}.${
      parseFloat(changeToGive) > 0 ? ` $${changeToGive} change given.` : ''
    }`,
    clerk?.id
  )
}

export function logSalePaymentGift(
  payment,
  isRefund,
  newGiftCardCode,
  giftCardCode,
  leftOver,
  remainingOnGiftCard,
  cart,
  customers,
  clerk
) {
  saveLog(
    `${priceDollarsString(payment)} ${
      isRefund
        ? `refunded with new gift card #${newGiftCardCode} to`
        : `gift card payment from`
    } ${
      cart?.customer_id
        ? customers?.find((c: CustomerObject) => c?.id === cart?.customer_id)
            ?.name
        : 'customer'
    }${cart?.id ? ` (sale #${cart?.id})` : ''}.${
      isRefund
        ? ''
        : ` Gift card #${giftCardCode?.toUpperCase()}. ${
            leftOver < 10
              ? `Card taken.${
                  leftOver > 0
                    ? ` $${leftOver?.toFixed(
                        2
                      )} change given for remainder on card.`
                    : ''
                }`
              : `$${remainingOnGiftCard?.toFixed(2)} remaining on card.`
          }`
    }`,
    clerk?.id
  )
}

export function logSaleNuked(sale, clerk) {
  saveLog(`Sale #${sale?.id} nuked.`, clerk?.id, 'sale', sale?.id)
}

export function logSaleParked(saleId, cart, customers, clerk) {
  saveLog(
    `Sale #${saleId} parked (${cart?.items?.length} item${
      cart?.items?.length === 1 ? '' : 's'
    }${
      cart?.customer_id
        ? ` for ${
            customers?.filter(
              (c: CustomerObject) => c?.id === cart?.customer_id
            )[0]?.name
          }.`
        : ''
    }).`,
    clerk?.id,
    'sale'
  )
}

export function logNewGiftCardCreated(newGiftCard, clerk, id) {
  saveLog(
    `New gift card (#${newGiftCard?.gift_card_code?.toUpperCase()}) created and added to cart.`,
    clerk?.id,
    'stock',
    id
  )
}

export function logNewMiscItemCreated(description, clerk, id) {
  saveLog(
    `New misc item (${description}) created and added to cart.`,
    clerk?.id,
    'stock',
    id
  )
}
