// Packages
import { useAtom } from "jotai";

// DB
import { useJobs } from "@/lib/swr-hooks";
import { pageAtom } from "@/lib/atoms";
import { TaskObject } from "@/lib/types";

// Components
import ListTask from "./list-task";
import TaskDialog from "./task-dialog";

export default function TaskScreen() {
  // SWR
  const { jobs, isJobsLoading } = useJobs();

  // Atoms
  const [page] = useAtom(pageAtom);

  return (
    <>
      <div
        className={`flex overflow-x-hidden ${page !== "jobs" ? "hidden" : ""}`}
      >
        <div className="h-menu w-full overflow-y-scroll px-2 bg-white">
          <div className="text-2xl mt-4 mb-2 text-black font-mono">Jobs</div>
          {isJobsLoading ? (
            <div className="w-full flex h-full">
              <div className="loading-icon" />
            </div>
          ) : (
            jobs?.map((task: TaskObject) => (
              <ListTask task={task} key={task?.id} />
            ))
          )}
        </div>
      </div>
      <TaskDialog />
    </>
  );
}
