import dayjs from 'dayjs'
import { RoleTypes } from 'lib/types'
import { SaleObject } from 'lib/types/sale'
import { axiosAuth, useData } from './'

export function useJobsToDo() {
  return useData(`job/todo`, 'jobsToDo')
}

export function useJobs() {
  return useData(`job`, 'jobs')
}

export async function createMailOrderTask(sale: SaleObject, customer: string) {
  return axiosAuth
    .post(`/api/job`, {
      description: `Post Sale ${sale?.id} (${sale?.itemList}) to ${`${customer}\n` || ''}${sale?.postalAddress}`,
      createdByClerkId: sale?.saleOpenedBy,
      assignedTo: RoleTypes?.MC,
      dateCreated: dayjs.utc().format(),
      isPostMailOrder: true,
    })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}

export function updateJob(update: any, id) {
  return axiosAuth
    .patch(`/api/job/${id}`, update)
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
