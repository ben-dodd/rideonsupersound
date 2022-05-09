import { useState } from "react";
import { useAtom } from "jotai";

// DB
import { useClerks, useJobs } from "@/lib/swr-hooks";
import { TaskObject, ClerkObject, StocktakeObject } from "@/lib/types";
import { clerkAtom } from "@/lib/atoms";
import { completeTask } from "@/lib/db-functions";
import dayjs from "dayjs";

type ListItemProps = {
  stocktake: StocktakeObject;
};

export default function StocktakeListItem({ stocktake }: ListItemProps) {
  // SWR
  const { clerks } = useClerks();
  const { jobs, mutateJobs } = useJobs();

  // Atoms
  const [clerk] = useAtom(clerkAtom);

  // State

  return (
    <div className={`flex w-full border-b border-yellow-100 py-1 text-sm`}>
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex w-2/12">
          <div className="mx-2 w-1/12">{stocktake?.description}</div>
          <div className="font-bold pr-4 text-pink-600">
            {dayjs(stocktake?.date_started).format("D MMMM YYYY")}
          </div>
        </div>
        <div className={`w-4/12`}></div>
        {/*<div className="grid grid-cols-3 w-2/5">
          <div className="text-blue-800">{`Created by ${
            clerks?.filter(
              (c: ClerkObject) => c?.id === task?.created_by_clerk_id
            )[0]?.name
          }`}</div>*/}
        <div className="w-3/12">
          {/* {task?.assigned_to ? (
            <div>{`Assigned to ${task?.assigned_to}`}</div>
          ) : (
            <div />
          )} */}
        </div>
        <div className="w-3/12 text-right">
          {/* {task?.completed_by_clerk_id
            ? `Completed by ${
                clerks?.filter(
                  (c: ClerkObject) => c?.id === task?.completed_by_clerk_id
                )[0]?.name
              } (${dayjs(task?.date_completed).format("D MMMM YYYY, h:mm A")})`
            : ""} */}
        </div>
      </div>
    </div>
  );
}
