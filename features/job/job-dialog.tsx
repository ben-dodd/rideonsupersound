import { useState } from 'react'
import { ModalButton, RoleTypes, TaskObject } from 'lib/types'
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logCreateJob } from 'lib/functions/log'
import dayjs from 'dayjs'
import Select from 'react-select'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { createTask } from 'lib/api/jobs'
import { useSWRConfig } from 'swr'

export default function JobDialog() {
  const { clerk } = useClerk()
  const { view, closeView, setAlert } = useAppStore()
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState(null)
  const [isPriority, setIsPriority] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { mutate } = useSWRConfig()

  function clearDialog() {
    setDescription('')
    setAssignedTo(null)
    setIsPriority(false)
    closeView(ViewProps.taskDialog)
  }

  const roles = [
    RoleTypes.CL,
    RoleTypes.CO,
    RoleTypes.DW,
    RoleTypes.MC,
    RoleTypes.PM,
    RoleTypes.PMC,
    RoleTypes.RC,
    RoleTypes.RS,
    RoleTypes.VLG,
  ]

  const buttons: ModalButton[] = [
    {
      type: 'ok',
      disabled: description === '',
      loading: submitting,
      onClick: async () => {
        setSubmitting(true)
        let newTask: TaskObject = {
          description,
          assignedTo: assignedTo?.value,
          isPriority: isPriority || false,
          createdByClerkId: clerk?.id,
          dateCreated: dayjs.utc().format(),
        }
        const jobId = await createTask(newTask)
        mutate(`job`)
        // mutateJobs([...jobs, { ...newTask, jobId }], false)
        setSubmitting(false)
        clearDialog()
        logCreateJob(description, clerk, jobId)
        setAlert({
          open: true,
          type: 'success',
          message: `NEW JOB CREATED`,
        })
      },
      text: 'CREATE JOB',
    },
  ]

  return (
    <Modal open={view?.taskDialog} closeFunction={clearDialog} title={'NEW JOB'} buttons={buttons}>
      <div className="h-dialogsm">
        <TextField
          inputLabel="Description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <div className="text-sm mt-2">Job assigned to</div>
        <Select
          className="w-full self-stretch"
          value={assignedTo}
          options={roles?.map((role: string) => ({
            value: role,
            label: role,
          }))}
          onChange={(roleWrapper: any) => setAssignedTo(roleWrapper)}
        />
        <div className="flex mt-2">
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={isPriority}
            onChange={() => setIsPriority(!isPriority)}
          />
          <div className="ml-2">Priority job</div>
        </div>
      </div>
    </Modal>
  )
}
