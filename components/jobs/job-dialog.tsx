// Packages
import { useState } from 'react'
import { useAtom } from 'jotai'

// DB
import { useJobs, useLogs, useClerks } from '@/lib/swr-hooks'
import { viewAtom, clerkAtom, alertAtom } from '@/lib/atoms'
import { ModalButton, TaskObject, ClerkObject, RoleTypes } from '@/lib/types'

// Functions
import { saveLog, saveTaskToDatabase } from '@/lib/db-functions'

// Components
import Modal from '@/components/_components/container/modal'
import TextField from '@/components/_components/inputs/text-field'
import Select from 'react-select'
import dayjs from 'dayjs'
import { mysqlDate } from '@/lib/data-functions'

export default function JobDialog() {
  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)
  const [, setAlert] = useAtom(alertAtom)

  // SWR
  // const { clerks } = useClerks();
  const { logs, mutateLogs } = useLogs()
  const { jobs, mutateJobs } = useJobs()

  // State
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
          date_created: mysqlDate(dayjs.utc().format()),
        }
        const id = await saveTaskToDatabase(newTask)
        mutateJobs([...jobs, { ...newTask, id }], false)
        setSubmitting(false)
        clearDialog()
        saveLog(
          {
            log: `New job (${description}) created.`,
            clerk_id: clerk?.id,
            table_id: 'stock',
            row_id: id,
          },
          logs,
          mutateLogs
        )
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
