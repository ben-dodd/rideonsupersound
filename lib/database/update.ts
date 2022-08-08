import axios from 'axios'
import {
  CustomerObject,
  GiftCardObject,
  HoldObject,
  RegisterObject,
  SaleItemObject,
  SaleObject,
  SaleTransactionObject,
  StockObject,
  StocktakeItemObject,
  StocktakeObject,
  StocktakeTemplateObject,
  VendorObject,
} from 'lib/types'

export async function updateItemInDatabase(
  properties: any,
  table: string,
  mutateFunction?: Function,
  mutateList?: any[]
) {
  const id = properties.id
  delete properties.id
  return axios
    .post(`/api/update`, {
      table,
      properties,
      id,
      k: process.env.NEXT_PUBLIC_SWR_API_KEY,
    })
    .then((response) => {
      if (mutateFunction) {
        if (mutateList)
          mutateFunction(
            mutateList?.map((listItem) =>
              listItem?.id === id ? properties : listItem
            ),
            false
          )
        else mutateFunction()
      }
      return response.data.insertId
    })
    .catch((error) => console.log(error))
}

export async function updateStockItemInDatabase(
  updates: StockObject | GiftCardObject
) {
  // use for gift card update
  // gift_card_remaining = ?,
  //         gift_card_is_valid = ?
  return await updateItemInDatabase(updates, 'stock')
}

export async function updateStocktakeItemInDatabase(
  updates: StocktakeItemObject
) {
  return await updateItemInDatabase(updates, 'stocktake_item')
}

export async function updateStocktakeInDatabase(updates: StocktakeObject) {
  return await updateItemInDatabase(updates, 'stocktake')
}

export async function updateStocktakeTemplateInDatabase(
  updates: StocktakeTemplateObject
) {
  return await updateItemInDatabase(updates, 'stocktake_template')
}

export async function updateSaleInDatabase(updates: SaleObject) {
  return await updateItemInDatabase(updates, 'sale')
}

export async function updateSaleTransactionInDatabase(
  updates: SaleTransactionObject
) {
  return await updateItemInDatabase(updates, 'sale_transaction')
}

export async function updateSaleItemInDatabase(updates: SaleItemObject) {
  // parseint quantity and discounts
  return await updateItemInDatabase(updates, 'sale_item')
}

export async function updateVendorInDatabase(updates: VendorObject) {
  // update vendor last contacted
  return await updateItemInDatabase(updates, 'vendor')
}

export async function updateRegisterInDatabase(updates: RegisterObject) {
  return await updateItemInDatabase(updates, 'register')
}

export async function updateHoldInDatabase(updates: HoldObject) {
  return await updateItemInDatabase(updates, 'hold')
}

export async function updateCustomerInDatabase(
  updates: CustomerObject,
  mutateCustomers: Function,
  customerList: CustomerObject[]
) {
  return await updateItemInDatabase(
    updates,
    'customer',
    mutateCustomers,
    customerList
  )
}
