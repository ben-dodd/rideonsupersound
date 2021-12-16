import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useClerks, useJobs } from "@/lib/swr-hooks";
import { TaskObject, ClerkObject } from "@/lib/types";
import { clerkAtom } from "@/lib/atoms";
import { fDateTime } from "@/lib/data-functions";
import { completeTask } from "@/lib/db-functions";

type ListItemProps = {
  task: TaskObject;
};

export default function ListTask({ task }: ListItemProps) {
  // SWR
  const { clerks } = useClerks();
  const { jobs, mutateJobs } = useJobs();

  // Atoms
  const [clerk] = useAtom(clerkAtom);

  // State
  const [checked, setChecked] = useState(task?.is_completed);

  return (
    <div
      className={`flex w-full border-b border-yellow-100 py-1 font-mono text-xs${
        task?.is_completed
          ? " bg-gray-200 text-gray-600"
          : task?.is_priority
          ? " bg-red-100 text-black font-bold"
          : " text-black"
      }`}
    >
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex w-3/12">
          <div className="mx-2 w-1/12">
            <input
              className="cursor-pointer"
              type="checkbox"
              checked={checked}
              disabled={checked}
              onChange={() => {
                setChecked(!checked);
                const otherJobs = jobs?.filter(
                  (t: TaskObject) => t?.id !== task?.id
                );
                mutateJobs(
                  [
                    ...otherJobs,
                    {
                      ...task,
                      completed_by_clerk_id: clerk?.id,
                      is_completed: true,
                    },
                  ],
                  false
                );
                completeTask(task, clerk);
              }}
            />
          </div>
          <div className="font-bold pr-4 text-pink-600">
            {fDateTime(task?.date_created)}
          </div>
        </div>
        <div className={`w-7/12 ${checked ? "line-through" : ""}`}>
          {task?.description}
        </div>
        {/*<div className="grid grid-cols-3 w-2/5">
          <div className="text-blue-800">{`Created by ${
            clerks?.filter(
              (c: ClerkObject) => c?.id === task?.created_by_clerk_id
            )[0]?.name
          }`}</div>*/}
        {task?.assigned_to ? (
          <div>{`Assigned to ${task?.assigned_to}`}</div>
        ) : (
          <div />
        )}
        <div className="w-4/12 text-right">
          {task?.completed_by_clerk_id
            ? `Completed by ${
                clerks?.filter(
                  (c: ClerkObject) => c?.id === task?.completed_by_clerk_id
                )[0]?.name
              } (${fDateTime(task?.date_completed)})`
            : ""}
        </div>
      </div>
    </div>
  );
}
