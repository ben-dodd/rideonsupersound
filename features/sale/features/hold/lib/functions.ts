export async function returnHoldToStock(
  hold: HoldObject,
  clerk: ClerkObject,
  holds: HoldObject[],
  mutateHolds: Function,
  mutateInventory: Function,
  registerID: number
) {
  updateHoldInDatabase({
    ...hold,
    date_removed_from_hold: dayjs.utc().format(),
    removed_from_hold_by: clerk?.id,
  })
  mutateHolds(
    holds?.filter((h) => h?.id !== hold?.id),
    false
  )
  createStockMovementInDatabase(
    { item_id: hold?.item_id, quantity: hold?.quantity?.toString() },
    clerk,
    registerID,
    StockMovementTypes.Unhold,
    hold?.note
  )
  mutateInventory()
}

export async function addRestockTask(id: number) {
  try {
    const res = await fetch(
      `/api/restock-task?k=${process.env.NEXT_PUBLIC_SWR_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, needs_restock: true }),
      }
    )
    const json = await res.json()
    if (!res.ok) throw Error(json.message)
  } catch (e) {
    throw Error(e.message)
  }
}
