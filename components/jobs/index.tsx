// Packages
import { useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { useDropzone } from 'react-dropzone'

// DB
import { useJobs, useInventory } from '@/lib/swr-hooks'
import { pageAtom } from '@/lib/atoms'
import { TaskObject, StockObject } from '@/lib/types'

import { uploadFiles } from '@/lib/db-functions'

// Components
import ListTask from './list-job'
import TaskDialog from './job-dialog'
import RestockTask from './restock-job'
import Tabs from '@/components/_components/navigation/tabs'
import dayjs from 'dayjs'

export default function TaskScreen() {
  // SWR
  const { jobs, isJobsLoading } = useJobs()
  const { inventory, isInventoryLoading } = useInventory()

  // Atoms
  const [page] = useAtom(pageAtom)
  const [tab, setTab] = useState(0)

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles.length > 1) {
      // setAlert({
      //   message: `IMAGE UPLOAD FAILED. ONLY ONE IMAGE PERMITTED FOR PRODUCT.`,
      //   type: "error",
      // })
    } else {
      let file = acceptedFiles[0]
      if (!file.type.includes('image')) {
        // setAlert({
        //   message: "IMAGE UPLOAD FAILED. FILE NOT AN IMAGE.",
        //   type: "error",
        // })
      } else {
        // uploadFiles({
        //   file,
        //   storagePath: "inventory/",
        //   callback: ({ path, url }) => {
        //     setItem({ ...item, imageRef: path, image: url });
        //   },
      }
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <div
        className={`flex flex-col overflow-x-hidden ${
          page !== 'jobs' ? 'hidden' : ''
        }`}
      >
        <div className="bg-col10 text-4xl font-bold uppercase text-white p-2 mb-1">
          Jobs
        </div>
        <div className="h-menu w-full overflow-y-scroll px-2 bg-white">
          <Tabs
            tabs={['Restocking', 'Mail Orders', 'Other Jobs']}
            value={tab}
            onChange={setTab}
          />
          <div hidden={tab !== 0}>
            {isInventoryLoading ? (
              <div className="w-full flex h-full">
                <div className="loading-icon" />
              </div>
            ) : (
              inventory
                ?.filter((item: StockObject) => item?.needs_restock)
                ?.sort((a, b) => a?.title?.localeCompare?.(b?.title))
                ?.sort((a, b) => a?.format?.localeCompare?.(b?.format))
                ?.map((item: StockObject) => (
                  <RestockTask item={item} key={item?.id} />
                ))
            )}
          </div>
          <div hidden={tab !== 1}>
            {isJobsLoading ? (
              <div className="w-full flex h-full">
                <div className="loading-icon" />
              </div>
            ) : (
              jobs
                ?.filter((job) => job?.is_post_mail_order)
                ?.sort((jobA: TaskObject, jobB: TaskObject) => {
                  if (jobA?.is_completed && !jobB?.is_completed) return 1
                  else if (jobB?.is_completed && !jobA?.is_completed) return -1
                  else if (jobA?.is_completed) {
                    return dayjs(jobA?.date_completed).isAfter(
                      jobB.date_completed
                    )
                      ? -1
                      : 1
                  } else if (jobA?.is_priority && !jobB?.is_priority) return -1
                  else if (jobB?.is_priority && !jobA?.is_priority) return 1
                  else
                    return dayjs(jobA?.date_created).isAfter(jobB?.date_created)
                      ? -1
                      : 1
                })
                ?.map((task: TaskObject) => (
                  <ListTask task={task} key={task?.id} />
                ))
            )}
          </div>
          <div hidden={tab !== 2}>
            {isJobsLoading ? (
              <div className="w-full flex h-full">
                <div className="loading-icon" />
              </div>
            ) : (
              jobs
                ?.filter((job) => !job?.is_post_mail_order)
                ?.sort((jobA: TaskObject, jobB: TaskObject) => {
                  if (jobA?.is_completed && !jobB?.is_completed) return 1
                  else if (jobB?.is_completed && !jobA?.is_completed) return -1
                  else if (jobA?.is_completed) {
                    return dayjs(jobA?.date_completed).isAfter(
                      jobB.date_completed
                    )
                      ? -1
                      : 1
                  } else if (jobA?.is_priority && !jobB?.is_priority) return -1
                  else if (jobB?.is_priority && !jobA?.is_priority) return 1
                  else
                    return dayjs(jobA?.date_created).isAfter(jobB?.date_created)
                      ? -1
                      : 1
                })
                ?.map((task: TaskObject) => (
                  <ListTask task={task} key={task?.id} />
                ))
            )}
          </div>
          {/*<div hidden={tab !== 2}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
          </div>*/}
        </div>
      </div>
      <TaskDialog />
    </>
  )
}
