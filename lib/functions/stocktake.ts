import { logStocktakeAdjustment, logStocktakeKeep } from 'lib/functions/log'
import {
  createStockMovementInDatabase,
  createTaskInDatabase,
} from 'lib/database/create'
import {
  updateStocktakeInDatabase,
  updateStocktakeTemplateInDatabase,
} from 'lib/database/update'
import {
  ClerkObject,
  StockMovementTypes,
  StockObject,
  StocktakeItemObject,
  StocktakeObject,
  StocktakeReviewDecisions,
  StocktakeStatuses,
  StocktakeTemplateObject,
  TaskObject,
} from 'lib/types'
import dayjs from 'dayjs'
import { getItemById, getItemSkuDisplayName } from './displayInventory'

export function writeStocktakeFilterDescription(
  stocktake: StocktakeTemplateObject
) {
  const maxNum = 20
  let filters = []
  if (stocktake?.media_enabled)
    filters?.push(
      `Media Filters: ${
        stocktake?.media_list?.length < maxNum
          ? stocktake?.media_list?.join?.(', ')
          : `${stocktake?.media_list?.length} Media Types`
      }`
    )
  if (stocktake?.format_enabled)
    filters?.push(
      `Format Filters: ${
        stocktake?.format_list?.length < maxNum
          ? stocktake?.format_list?.join?.(', ')
          : `${stocktake?.format_list?.length} Formats`
      }`
    )
  if (stocktake?.section_enabled)
    filters?.push(
      `Section Filters: ${
        stocktake?.section_list?.length < maxNum
          ? stocktake?.section_list?.join?.(', ')
          : `${stocktake?.section_list?.length} Sections`
      }`
    )
  if (stocktake?.vendor_enabled)
    filters?.push(
      `Vendor Filters: ${
        stocktake?.vendor_list?.length < maxNum
          ? stocktake?.vendor_list?.join?.(', ')
          : `${stocktake?.vendor_list?.length} Vendors`
      }`
    )
  if (filters?.length > 0) {
    return filters?.join?.(', ')
  } else return 'No Filters'
}

export function processStocktake(
  stocktake: StocktakeObject,
  stocktakeTemplate: StocktakeTemplateObject,
  stocktakeItems: StocktakeItemObject[],
  inventory: StockObject[],
  clerk: ClerkObject
) {
  let tasks = []
  stocktakeItems?.forEach(async (item: StocktakeItemObject) => {
    if (item?.quantity_counted === item?.quantity_recorded) {
      // Do nothing
    } else if (item?.review_decision === StocktakeReviewDecisions?.keep) {
      logStocktakeKeep(item, inventory, clerk)
    } else if (
      item?.review_decision === StocktakeReviewDecisions?.review ||
      !item?.review_decision
    ) {
      let newTask: TaskObject = {
        description: `Review stock take. ${getItemSkuDisplayName(
          getItemById(item?.stock_id, inventory)
        )}. ${item?.quantity_counted} counted, ${
          item?.quantity_recorded
        } in the system.`,
        created_by_clerk_id: clerk?.id,
        date_created: dayjs.utc().format(),
      }
      const id = await createTaskInDatabase(newTask)
      tasks?.push({ ...newTask, id })
    } else {
      let act = StockMovementTypes?.Adjustment
      if (item?.review_decision === StocktakeReviewDecisions?.discard)
        act = StockMovementTypes?.Discarded
      else if (item?.review_decision === StocktakeReviewDecisions?.found)
        act = StockMovementTypes?.Found
      else if (item?.review_decision === StocktakeReviewDecisions?.lost)
        act = StockMovementTypes?.Lost
      else if (item?.review_decision === StocktakeReviewDecisions?.return)
        act = StockMovementTypes?.Returned
      createStockMovementInDatabase({
        item: {
          item_id: item?.stock_id,
          quantity: `${item?.quantity_difference}`,
        },
        clerk,
        act,
        note: 'Stock take adjustment.',
        stocktake_id: stocktake?.id,
      })
      logStocktakeAdjustment(item, inventory, act, clerk)
    }
  })
  updateStocktakeInDatabase({
    ...stocktake,
    date_closed: dayjs.utc().format(),
    closed_by: clerk?.id,
  })
  updateStocktakeTemplateInDatabase({
    ...stocktakeTemplate,
    last_completed: dayjs.utc().format(),
    status: StocktakeStatuses?.completed,
  })
}