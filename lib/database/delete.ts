import axios from 'axios'

async function deleteItemFromDatabase(table, id, id_key?, isHardDelete?) {
  return axios
    .post(`/api/delete`, {
      table,
      id,
      id_key,
      isHardDelete,
      k: process.env.NEXT_PUBLIC_SWR_API_KEY,
    })
    .then((response) => response.data.insertId)
    .catch((error) => console.log(error))
}

export async function deleteInventoryItemFromDatabase(id: number) {
  return await deleteItemFromDatabase('stock', id)
}

export async function deleteVendorFromDatabase(id: number) {
  return await deleteItemFromDatabase('vendor', id)
}

export async function deleteVendorPaymentFromDatabase(id: number) {
  return await deleteItemFromDatabase('vendor_payment', id)
}

export async function deleteSaleItemFromDatabase(id: number) {
  return await deleteItemFromDatabase('sale_item', id)
}

export async function deleteSaleTransactionFromDatabase(id: number) {
  return await deleteItemFromDatabase('sale_transaction', id)
}

export async function deleteSaleFromDatabase(id: number) {
  return await deleteItemFromDatabase('sale', id)
}

export async function deleteStocktakeItemFromDatabase(id: number) {
  return await deleteItemFromDatabase('stocktake_item', id, 'id', true)
}

export async function deleteStockMovementsFromDatabase(sale_id: number) {
  return await deleteItemFromDatabase(
    'stock_movement',
    sale_id,
    'sale_id',
    true
  )
}
