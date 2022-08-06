import { updateItemInDatabase } from 'lib/database/update'
import { TaskObject } from 'lib/types'

export async function completeTask(task: TaskObject) {
  const { date_completed, completed_by_clerk_id, id } = task
  updateItemInDatabase(
    { date_completed, completed_by_clerk_id, is_completed: 1, id },
    'task'
  )
}

export async function addRestockTask(id: number) {
  updateItemInDatabase({ needs_restock: 0, id }, 'stock')
}

export async function completeRestockTask(id: number) {
  updateItemInDatabase({ needs_restock: 1, id }, 'stock')
}
