// Packages
import { useAtom } from 'jotai'
import { useState } from 'react'

// DB
import { alertAtom, clerkAtom, viewAtom } from 'lib/atoms'
import { useJobs } from 'lib/database/read'
import { ModalButton, RoleTypes, TaskObject } from 'lib/types'

// Functions

// Components
import TextField from 'components/inputs/text-field'
import Modal from 'components/modal'
import { logCreateJob } from 'features/log/lib/functions'
import dayjs from 'dayjs'
import Select from 'react-select'

export default function JobDialog() {
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)
  const [, setAlert] = useAtom(alertAtom)
  const { jobs, mutateJobs } = useJobs()
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState(null)
  const [isPriority, setIsPriority] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function clearDialog() {
    setDescription('')
    setAssignedTo(null)
    setIsPriority(false)
    setView({ ...view, taskDialog: false })
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
          assigned_to: assignedTo?.value,
          is_priority: isPriority || false,
          created_by_clerk_id: clerk?.id,
          date_created: dayjs.utc().format(),
        }
        const jobId = await saveTaskToDatabase(newTask)
        mutateJobs([...jobs, { ...newTask, jobId }], false)
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
    <Modal
      open={view?.taskDialog}
      closeFunction={clearDialog}
      title={'NEW JOB'}
      buttons={buttons}
    >
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
function saveTaskToDatabase(newTask: TaskObject) {
  throw new Error('Function not implemented.')
}
