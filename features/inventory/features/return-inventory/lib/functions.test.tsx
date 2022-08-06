export function returnStock(
  vendorId: number,
  returnItems: any,
  notes: string,
  clerk: ClerkObject,
  registerID: number,
  inventory: StockObject[],
  mutateInventory: Function,
  logs: LogObject[],
  mutateLogs: Function
) {
  if (vendorId && returnItems?.length > 0) {
    const itemIds = returnItems?.map((returnItem) => parseInt(returnItem?.id))
    const otherInventoryItems = inventory?.filter(
      (i: StockObject) => !itemIds?.includes(i?.id)
    )
    let updatedInventoryItems = []
    returnItems
      .filter((returnItem: any) => parseInt(`${returnItem?.quantity}`) > 0)
      .forEach((returnItem: any) => {
        const stockItem = inventory?.filter(
          (i: StockObject) => i?.id === parseInt(returnItem?.id)
        )[0]
        updatedInventoryItems.push({
          ...stockItem,
          quantity_returned:
            (stockItem?.quantity_returned || 0) +
            parseInt(returnItem?.quantity),
          quantity: (stockItem?.quantity || 0) - parseInt(returnItem?.quantity),
        })
        createStockMovementInDatabase(
          {
            item_id: parseInt(returnItem?.id),
            quantity: `${returnItem?.quantity}`,
          },
          clerk,
          registerID,
          StockMovementTypes?.Returned,
          notes || 'Stock returned to vendor.'
        )
        saveLog(
          {
            log: `${getItemDisplayName(stockItem)} (x${
              returnItem?.quantity
            }) returned to vendor.`,
            clerk_id: clerk?.id,
            table_id: 'stock_movement',
            row_id: null,
          },
          logs,
          mutateLogs
        )
      })
    mutateInventory([...otherInventoryItems, ...updatedInventoryItems], false)
  }
}
