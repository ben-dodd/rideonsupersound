// Packages
import { useAtom } from "jotai";

// DB
import { useTasks } from "@/lib/swr-hooks";
import { pageAtom } from "@/lib/atoms";
import { TaskObject } from "@/lib/types";

// Components
import ListTask from "./list-task";
import TaskDialog from "./task-dialog";

export default function TaskScreen() {
  // SWR
  const { tasks, isTasksLoading } = useTasks();

  // Atoms
  const [page] = useAtom(pageAtom);

  return (
    <>
      <div
        className={`flex overflow-x-hidden ${page !== "tasks" ? "hidden" : ""}`}
      >
        <div className="h-menu w-full overflow-y-scroll px-2 bg-white">
          <div className="text-2xl mt-4 mb-2 text-black font-mono">Tasks</div>
          {isTasksLoading ? (
            <div className="w-full flex h-full">
              <div className="loading-icon" />
            </div>
          ) : (
            tasks?.map((task: TaskObject) => (
              <ListTask task={task} key={task?.id} />
            ))
          )}
        </div>
      </div>
      <TaskDialog />
    </>
  );
}
