import { updateJob } from 'lib/api/jobs'
import { updateStockItem } from 'lib/api/stock'
import { TaskObject } from 'lib/types'

export async function completeTask(task: TaskObject) {
  const { dateCompleted, completedByClerkId, id } = task
  updateJob({ dateCompleted, completedByClerkId, isCompleted: true }, id)
}

export async function addRestockTask(id: number) {
  updateStockItem({ needsRestock: true }, id)
}

export async function completeRestockTask(id: number) {
  updateStockItem({ needsRestock: false }, id)
}
