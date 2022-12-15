import axios from 'axios'
import dayjs from 'dayjs'
import { RoleTypes, SaleObject } from 'lib/types'
import useData from './'

export function useJobsToDo() {
  return useData(`job/todo`, 'jobsToDo')
}

export function useJobs() {
  return useData(`job`, 'jobs')
}

export async function createMailOrderTask(sale: SaleObject, customer: string) {
  return axios
    .post(`/api/job`, {
      description: `Post Sale ${sale?.id} (${sale?.itemList}) to ${
        `${customer}\n` || ''
      }${sale?.postalAddress}`,
      createdByClerkId: sale?.saleOpenedBy,
      assignedTo: RoleTypes?.MC,
      dateCreated: dayjs.utc().format(),
      isPostMailOrder: true,
    })
    .then((res) => res.data)
    .catch((e) => Error(e.message))
}
