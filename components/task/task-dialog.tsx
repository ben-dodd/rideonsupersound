// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useJobs, useLogs, useClerks } from "@/lib/swr-hooks";
import { viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { ModalButton, TaskObject, ClerkObject } from "@/lib/types";

// Functions
import { saveLog, saveTaskToDatabase } from "@/lib/db-functions";

// Components
import Modal from "@/components/_components/container/modal";
import TextField from "@/components/_components/inputs/text-field";
import Select from "react-select";

export default function TaskDialog() {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);

  // SWR
  const { clerks } = useClerks();
  const { logs, mutateLogs } = useLogs();
  const { jobs, mutateJobs } = useJobs();

  // State
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(null);
  const [isPriority, setIsPriority] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function clearDialog() {
    setDescription("");
    setAssignedTo(null);
    setIsPriority(false);
    setView({ ...view, taskDialog: false });
  }

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled: description === "",
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let newTask: TaskObject = {
          description,
          assigned_to_clerk_id: assignedTo?.value,
          is_priority: isPriority || false,
        };
        const id = await saveTaskToDatabase(newTask, clerk);
        mutateJobs([...jobs, { ...newTask, id }], false);
        setSubmitting(false);
        clearDialog();
        saveLog(
          {
            log: `New job (${description}) created.`,
            clerk_id: clerk?.id,
            table_id: "stock",
            row_id: id,
          },
          logs,
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `NEW JOB CREATED`,
        });
      },
      text: "CREATE TASK",
    },
  ];

  return (
    <Modal
      open={view?.taskDialog}
      closeFunction={clearDialog}
      title={"CREATE TASK"}
      buttons={buttons}
    >
      <div className="h-dialogsm">
        <TextField
          inputLabel="Description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <div className="text-sm mt-2">Task assigned to</div>
        <Select
          className="w-full self-stretch"
          value={assignedTo}
          options={clerks?.map((clerk: ClerkObject) => ({
            value: clerk?.id,
            label: clerk?.name,
          }))}
          onChange={(clerkWrapper) => setAssignedTo(clerkWrapper)}
        />
        <div className="flex cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={isPriority}
            onChange={() => setIsPriority(!isPriority)}
          />
          <div className="ml-2">Priority task</div>
        </div>
      </div>
    </Modal>
  );
}
